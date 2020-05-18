import React, { useState } from "react";
import {
  useAuthentication,
  AuthenticationStatus,
} from "./hooks/Authentication";
import AuthenticationDialog from "./components/AuthenticationDialog";
import { ApolloProvider } from "@apollo/react-hooks";
import { Repository } from "./types/Repository";
import RepositorySelectedButton from "./components/RepositorySelectedButton";
import StarsGraph from "./components/StarsGraph";

function App() {
  const { client, status, updateToken } = useAuthentication();
  const [repository, setRepository] = useState<Repository | undefined>({
    owner: "dubzzz",
    repo: "fast-check",
  });

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
      <h1>Stars history</h1>
      <RepositorySelectedButton
        repository={repository}
        onRepositorySelected={(repo) => setRepository(repo)}
        onRepositoryRemoved={() => setRepository(undefined)}
      />
      {repository && <StarsGraph repository={repository} />}
    </ApolloProvider>
  );
}

export default App;
