import React from "react";
import MycelLogo from "../../assets/mycel.svg";
import { styled } from "../../theme";

const Container = styled("div", {
  display: "flex",
  width: "100%",
  justifyContent: "end",
  alignItems: "center",
  paddingTop: "$16",
});

const StyledAnchor = styled("a", {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  textDecoration: "none",
});

export function BottomLogo() {
  return (
    <Container>
      <StyledAnchor href="https://www.mycel.domains/" target="_blank">
        <img src={MycelLogo} width="100" alt="mycel-logo" />
      </StyledAnchor>
    </Container>
  );
}
