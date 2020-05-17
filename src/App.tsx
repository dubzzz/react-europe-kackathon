import React from "react";
import {
  useAuthentication,
  AuthenticationStatus,
} from "./hooks/Authentication";
import AuthenticationDialog from "./components/AuthenticationDialog";

function App() {
  const { token, status, updateToken } = useAuthentication();

  if (status !== AuthenticationStatus.Connected) {
    return (
      <AuthenticationDialog
        readOnly={status === AuthenticationStatus.Connection}
        onTokenChange={updateToken}
      />
    );
  }

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
