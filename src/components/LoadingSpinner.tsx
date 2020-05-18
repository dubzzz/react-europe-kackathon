import React from "react";
import styled from "styled-components";

type Props = {
  className?: string;
};

function LoadingSpinnerInternal(props: Props) {
  const { className } = props;
  return (
    <div className={`k-loading-mask ${className}`}>
      <span className="k-loading-text">Loading</span>
      <div className="k-loading-image"></div>
      <div className="k-loading-color"></div>
    </div>
  );
}

const LoadingSpinner = styled(LoadingSpinnerInternal)`
  pointer-events: none;
`;

export default LoadingSpinner;
