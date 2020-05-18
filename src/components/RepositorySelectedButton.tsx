import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import styled from "styled-components";
import { Repository } from "../types/Repository";
import RepositorySelectorDialog from "./RepositorySelectorDialog";

type Props = {
  repository?: Repository;
  onRepositorySelected: (repo: Repository) => void;
  onRepositoryRemoved: () => void;
  className?: string;
};

function RepositorySelectedButtonInternal(props: Props) {
  const {
    repository,
    onRepositorySelected,
    onRepositoryRemoved,
    className,
  } = props;
  const [selectAnotherRepo, setSelectAnotherRepo] = useState(false);

  return (
    <div className={className}>
      Selected repository:&nbsp;
      {repository !== undefined ? (
        <Button
          aria-label={`Clear previously selected repository ${repository.repo} by ${repository.owner}`}
          icon="close"
          onClick={() => onRepositoryRemoved()}
        >
          <code>{repository.owner}</code>
          <span className="RepositorySelectedButton-selectedPackageSeparator">
            &nbsp;/&nbsp;
          </span>
          <code>{repository.repo}</code>
        </Button>
      ) : (
        <span className="RepositorySelectedButton-noSelectedPackage">none</span>
      )}
      <Button
        aria-label="Select a repository"
        icon="edit"
        look="bare"
        onClick={() => setSelectAnotherRepo(true)}
      />
      {selectAnotherRepo && (
        <RepositorySelectorDialog
          onRepositorySelected={(newRepository) => {
            onRepositorySelected(newRepository);
            setSelectAnotherRepo(false);
          }}
          onClose={() => setSelectAnotherRepo(false)}
        />
      )}
    </div>
  );
}

const RepositorySelectedButton = styled(RepositorySelectedButtonInternal)`
  & button .k-icon {
    opacity: 0.39;
  }
  & button:hover .k-icon {
    opacity: 1;
  }
  & button code {
    color: cornflowerblue;
  }
  & button .RepositorySelectedButton-selectedPackageSeparator {
    color: #aaa;
  }
  & .RepositorySelectedButton-noSelectedPackage {
    font-style: italic;
    opacity: 0.39;
  }
`;

export default RepositorySelectedButton;
