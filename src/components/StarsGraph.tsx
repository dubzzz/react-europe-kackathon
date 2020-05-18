import React, { useState, useEffect, useRef, useMemo } from "react";
import { gql, ApolloQueryResult } from "apollo-boost";
import { useApolloClient } from "@apollo/react-hooks";
import { Repository } from "../types/Repository";
import {
  Chart,
  ChartTooltip,
  ChartTitle,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
} from "@progress/kendo-react-charts";

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
};

function StarsGraphInternal(props: Props) {
  const { repository } = props;

  const currentRepositoryRef = useRef(repository);
  const [stars, setStars] = useState([] as Date[]);
  const { categories, data } = useMemo(() => {
    const orderedStars = [...stars].sort((a, b) => +a - +b);
    const categories: string[] = [];
    const count: number[] = [];
    for (const newStarDate of orderedStars) {
      const monthLabel = String(newStarDate.getMonth() + 1).padStart(2, "0");
      const yearLabel = String(newStarDate.getFullYear()).substr(2);
      const starCategory = `${monthLabel} / ${yearLabel}`;
      if (categories[categories.length - 1] === starCategory) {
        count[count.length - 1] += 1;
      } else {
        categories.push(starCategory);
        count.push(1);
      }
    }
    return {
      categories,
      data: count,
    };
  }, [stars]);

  const client = useApolloClient();

  useEffect(() => {
    currentRepositoryRef.current = repository;
    setStars([]);

    const fetchAll = async () => {
      let cursor: string | undefined = undefined;

      while (true) {
        const out: ApolloQueryResult<{
          repository: {
            stargazers: { edges: { starredAt: string; cursor: string }[] };
          };
        }> = await client.query({
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
          ...stargazers.map((r) => new Date(r.starredAt)),
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

  return (
    <Chart>
      <ChartTooltip />
      <ChartTitle text="Stars history by month" />
      <ChartCategoryAxis>
        <ChartCategoryAxisItem
          title={{ text: "Months" }}
          categories={categories}
        />
      </ChartCategoryAxis>
      <ChartSeries>
        <ChartSeriesItem type="line" data={data} />
      </ChartSeries>
    </Chart>
  );
}

const StarsGraph = StarsGraphInternal;

export default StarsGraph;
