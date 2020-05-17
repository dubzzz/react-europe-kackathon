import { useState, useEffect } from "react";

export enum AuthenticationStatus {
  None = "None",
  Connection = "Connection",
  Connected = "Connected",
}

export function useAuthentication() {
  // TODO Interdependant states, move to useReducer
  const [status, setStatus] = useState(AuthenticationStatus.None);
  const [token, setToken] = useState("");

  useEffect(() => {
    if (token === "") {
      return;
    }

    setStatus(AuthenticationStatus.Connection);

    // Simulate API call
    const timeoutToken = setTimeout(
      () => setStatus(AuthenticationStatus.Connected),
      1000
    );
    return () => clearTimeout(timeoutToken);
  }, [token]);

  return { token, status, updateToken: setToken };
}
