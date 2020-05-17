import React, { useState } from "react";
import {
  useAuthentication,
  AuthenticationStatus,
} from "./hooks/Authentication";
import AuthenticationDialog from "./components/AuthenticationDialog";
import { ApolloProvider } from "@apollo/react-hooks";
import RepositorySelector from "./components/RepositorySelector";
import { Repository } from "./types/Repository";
import RepositorySelectedButton from "./components/RepositorySelectedButton";
import StarsGraph from "./components/StarsGraph";

function App() {
  const { client, status, updateToken } = useAuthentication();
  const [repository, setRepository] = useState<Repository | undefined>(
    undefined
  );

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
      {repository === undefined ? (
        <RepositorySelector
          onRepositorySelected={(repo) => setRepository(repo)}
        />
      ) : (
        <>
          <RepositorySelectedButton
            repository={repository}
            onRepositoryRemoved={() => setRepository(undefined)}
          />
          <StarsGraph repository={repository} />
        </>
      )}
    </ApolloProvider>
  );
}

export default App;
