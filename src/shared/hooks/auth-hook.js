import { useCallback, useEffect, useState } from "react";

let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpiresIn, setTokenExpiresIn] = useState();
  const [userId, setUserId] = useState(false);

  const login = useCallback((uid, token, expiration) => {
    setToken(token);
    setUserId(uid);
    const expirationDate =
      expiration || new Date(new Date().getTime() + 2 * 1000 * 60 * 60);
    setTokenExpiresIn(expirationDate);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: expirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken();
    setTokenExpiresIn(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpiresIn) {
      const remainingTime = tokenExpiresIn.getTime() - new Date().getTime();
      logoutTimer = setTimeout(() => logout(), remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpiresIn]);

  return { login, logout, userId, token };
};
