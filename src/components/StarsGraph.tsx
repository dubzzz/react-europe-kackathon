import React, { useState, useEffect, useRef } from "react";
import { gql } from "apollo-boost";
import { useApolloClient } from "@apollo/react-hooks";
import styled from "styled-components";
import { Repository } from "../types/Repository";

const REPO_STARS = gql`
  query RepoStars($owner: String!, $repo: String!, $cursor: String) {
    repository(owner: $owner, name: $repo) {
      stargazers(
        first: 100
        orderBy: { field: STARRED_AT, direction: DESC }
        after: $cursor
      ) {
        edges {
          starredAt
          cursor
        }
      }
    }
  }
`;

type Props = {
  repository: Repository;
  className?: string;
};

function StarsGraphInternal(props: Props) {
  const { repository, className } = props;

  const currentRepositoryRef = useRef(repository);
  const [stars, setStars] = useState([] as Date[]);
  const client = useApolloClient();

  useEffect(() => {
    currentRepositoryRef.current = repository;
    setStars([]);

    const fetchAll = async () => {
      let cursor: string | undefined = undefined;

      while (true) {
        const out: any = await client.query<{
          repository: {
            stargazers: { edges: { starredAt: string; cursor: string }[] };
          };
        }>({
          query: REPO_STARS,
          variables: { owner: repository.owner, repo: repository.repo, cursor },
        });
        const stargazers = out.data.repository.stargazers.edges;

        // repository has been changed by the user
        if (currentRepositoryRef.current !== repository) {
          return;
        }

        // update our stars
        setStars((previousStars) => [
          ...previousStars,
          ...stargazers.map((r: any) => new Date(r.starredAt)),
        ]);

        // leave the loop, no more results expected
        // it was the last page
        if (stargazers.length < 100) {
          return;
        }

        // update the cursor
        cursor = stargazers[stargazers.length - 1].cursor;
      }
    };
    fetchAll();
  }, [client, repository]);

  return <div className={className}>{stars.length}</div>;
}

const StarsGraph = styled(StarsGraphInternal)``;

export default StarsGraph;
