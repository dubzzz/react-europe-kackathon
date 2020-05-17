import React, { useState, useEffect, useRef } from "react";
import { FormElement, FieldWrapper } from "@progress/kendo-react-form";
import { Label } from "@progress/kendo-react-labels";
import { gql } from "apollo-boost";
import { useApolloClient } from "@apollo/react-hooks";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import styled from "styled-components";
import { Repository } from "../types/Repository";

const SEARCH_REPO = gql`
  query Search($query: String!) {
    search(query: $query, type: REPOSITORY, first: 10) {
      edges {
        node {
          ... on Repository {
            owner {
              login
            }
            name
          }
        }
      }
    }
  }
`;

type Props = {
  onRepositorySelected: (repo: Repository) => void;
  className?: string;
};

function RepositorySelectorInternal(props: Props) {
  const { onRepositorySelected, className } = props;
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([] as Repository[]);

  const lastQueryIdRef = useRef(0);
  const lastResultsIdRef = useRef(0);
  const client = useApolloClient();

  useEffect(() => {
    const currentQueryId = ++lastQueryIdRef.current;
    client
      .query<{
        search: {
          edges: { node: { owner: { login: string }; name: string } }[];
        };
      }>({ query: SEARCH_REPO, variables: { query } })
      .then(({ data }) => {
        if (currentQueryId < lastResultsIdRef.current) {
          // We already received more recent results
          return;
        }
        setSuggestions(
          data.search.edges.map(({ node }) => ({
            owner: node.owner.login,
            repo: node.name,
          }))
        );
      });
  }, [client, query]);

  return (
    <div className={className}>
      <FormElement>
        <FieldWrapper>
          <Label editorId="repo-selector-input">Repository name:&nbsp;</Label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} />
        </FieldWrapper>
      </FormElement>
      <div>
        {suggestions.map((s) => (
          <Button
            key={`${s.owner}/${s.repo}`}
            onClick={() => onRepositorySelected(s)}
          >
            <code>{s.owner}</code>&nbsp;/&nbsp;
            <code>{s.repo}</code>
          </Button>
        ))}
      </div>
    </div>
  );
}

const RepositorySelector = styled(RepositorySelectorInternal)``;

export default RepositorySelector;
