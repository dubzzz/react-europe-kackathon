import { useState, useEffect, useMemo } from "react";
import ApolloClient, { gql } from "apollo-boost";

const CONNECTED_USER = gql`
  {
    viewer {
      login
    }
  }
`;

export enum AuthenticationStatus {
  None = "None",
  Connection = "Connection",
  Connected = "Connected",
}

const LocalStorageKey = "github-token";

export function useAuthentication() {
  const [status, setStatus] = useState(AuthenticationStatus.None);
  const [token, setToken] = useState(
    localStorage.getItem(LocalStorageKey) || ""
  );
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: "https://api.github.com/graphql",
        request: (operation) => {
          operation.setContext({
            headers: {
              authorization: token ? `Bearer ${token}` : "",
            },
          });
        },
      }),
    [token]
  );

  useEffect(() => {
    if (token === "") {
      localStorage.removeItem(LocalStorageKey);
      return;
    }

    let canceled = false;
    setStatus(AuthenticationStatus.Connection);

    client.query({ query: CONNECTED_USER }).then(
      () => {
        if (canceled) return;
        localStorage.setItem(LocalStorageKey, token);
        setStatus(AuthenticationStatus.Connected);
      },
      () => {
        if (canceled) return;
        localStorage.removeItem(LocalStorageKey);
        setStatus(AuthenticationStatus.None);
      }
    );
    return () => {
      canceled = true;
    };
  }, [client, token]);

  return { client, status, updateToken: setToken };
}
