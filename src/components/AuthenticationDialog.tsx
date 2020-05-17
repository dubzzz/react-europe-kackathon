import React, { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { Label } from "@progress/kendo-react-labels";
import { FormElement, FieldWrapper } from "@progress/kendo-react-form";
import { Input } from "@progress/kendo-react-inputs";
import styled from "styled-components";

type Props = {
  readOnly: boolean;
  onTokenChange: (token: string) => void;
  className?: string;
};

function AuthenticationDialogInternal(props: Props) {
  const { readOnly, onTokenChange, className } = props;
  const [githubKey, setGithubKey] = useState("");

  return (
    <Dialog
      title="Authentication token required"
      closeIcon={false}
      className={className}
    >
      <FormElement>
        <FieldWrapper>
          <Label editorId="token-input">GitHub access token:&nbsp;</Label>
          <Input
            id="token-input"
            value={githubKey}
            onChange={(e) => setGithubKey(e.target.value)}
            disabled={readOnly}
            readOnly={readOnly}
          />
        </FieldWrapper>
      </FormElement>
      <p className="AuthenticationDialog-help">
        You may find more details concerning how to create a personal access
        token{" "}
        <a
          href="https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        .
      </p>
      <DialogActionsBar>
        <Button
          onClick={() => onTokenChange(githubKey)}
          disabled={readOnly || githubKey === ""}
        >
          Send
        </Button>
      </DialogActionsBar>
    </Dialog>
  );
}

const AuthenticationDialog = styled(AuthenticationDialogInternal)`
  & .AuthenticationDialog-help {
    opacity: 0.39;
  }
`;

export default AuthenticationDialog;
