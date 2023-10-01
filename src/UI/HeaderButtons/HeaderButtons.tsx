import React from "react";
import { Tooltip, Button, RetryIcon } from "..";
import { styled } from "../../theme";

const ButtonsContainer = styled("div", {
  display: "flex",
});

interface PropTypes {
  onClickRefresh?: () => void;
}

export function HeaderButtons(props: PropTypes) {
  const { onClickRefresh } = props;

  return (
    <ButtonsContainer>
      <Tooltip content={"Refresh"}>
        <Button
          variant="ghost"
          onClick={onClickRefresh}
          disabled={!onClickRefresh}
        >
          <RetryIcon size={24} disabled={!onClickRefresh} />
        </Button>
      </Tooltip>
    </ButtonsContainer>
  );
}
