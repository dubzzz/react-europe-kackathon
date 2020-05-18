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
import LoadingSpinner from "./LoadingSpinner";

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
  type: "by-month" | "sum";
};

function StarsGraphInternal(props: Props) {
  const { repository, type } = props;

  const currentRepositoryRef = useRef(repository);
  const [loading, setLoading] = useState(false);
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
        if (type === "by-month") count.push(1);
        else if (type === "sum") count.push((count[count.length - 1] || 0) + 1);
      }
    }
    return {
      categories,
      data: count,
    };
  }, [stars, type]);

  const client = useApolloClient();

  useEffect(() => {
    currentRepositoryRef.current = repository;
    setStars([]);

    const fetchAll = async () => {
      setLoading(true);
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
          setLoading(false);
          return;
        }

        // update the cursor
        cursor = stargazers[stargazers.length - 1].cursor;
      }
    };
    fetchAll();
  }, [client, repository]);

  if (loading) {
    return (
      <div>
        History for {stars.length} stars have been fetched
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Chart>
      <ChartTooltip />
      <ChartTitle
        text={type === "by-month" ? "Stars history by month" : "Stars history"}
      />
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
