import React from "react";
import {
  useAuthentication,
  AuthenticationStatus,
} from "./hooks/Authentication";
import AuthenticationDialog from "./components/AuthenticationDialog";
import { ApolloProvider } from "@apollo/react-hooks";

function App() {
  const { client, status, updateToken } = useAuthentication();

  if (status !== AuthenticationStatus.Connected) {
    return (
      <AuthenticationDialog
        readOnly={status === AuthenticationStatus.Connection}
        onTokenChange={updateToken}
      />
    );
  }

  return (
    <ApolloProvider client={client}>
      <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </ApolloProvider>
  );
}

export default App;
