import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import styled from "styled-components";
import { Repository } from "../types/Repository";

type Props = {
  repository: Repository;
  onRepositoryRemoved: () => void;
  className?: string;
};

function RepositorySelectedButtonInternal(props: Props) {
  const { repository, onRepositoryRemoved, className } = props;

  return (
    <div className={className}>
      Selected repository:&nbsp;
      <Button
        className="RepositorySelectedButton-selectedPackage"
        icon="close"
        onClick={() => onRepositoryRemoved()}
      >
        <code>{repository.owner}</code>
        <span className="RepositorySelectedButton-selectedPackageSeparator">
          &nbsp;/&nbsp;
        </span>
        <code>{repository.repo}</code>
      </Button>
    </div>
  );
}

const RepositorySelectedButton = styled(RepositorySelectedButtonInternal)`
  & .RepositorySelectedButton-selectedPackage .k-icon {
    opacity: 0.39;
  }
  & .RepositorySelectedButton-selectedPackage:hover .k-icon {
    opacity: 1;
  }
  & .RepositorySelectedButton-selectedPackage code {
    color: cornflowerblue;
  }
  & .RepositorySelectedButton-selectedPackageSeparator {
    color: #aaa;
  }
`;

export default RepositorySelectedButton;
