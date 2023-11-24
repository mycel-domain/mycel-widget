import React from "react";
import { containsText } from "../../hooks";

import { LoadingStatus } from "../../types/meta";
import { styled } from "../../theme";
import { NotFoundAlert } from "../../UI/Alert/NotFoundAlert";
import { LoadingFailedAlert, SecondaryPage, Spinner } from "../../UI";
import { TokenList, TokenWithAmount } from "../../UI/TokenList/TokenList";

export const LoaderContainer = styled("div", {
  display: "flex",
  justifyContent: "center",
  width: "100%",
  paddingTop: "33%",
  flex: 1,
});
export interface PropTypes {
  list: TokenWithAmount[];
  selected: TokenWithAmount | null;
  onChange: (token: TokenWithAmount) => void;
  onBack?: () => void;
  loadingStatus: LoadingStatus;
  hasHeader?: boolean;
}

const filterTokens = (list: TokenWithAmount[], searchedFor: string) =>
  list.filter(
    (token) =>
      containsText(token.symbol, searchedFor) ||
      containsText(token.address || "", searchedFor) ||
      containsText(token.name || "", searchedFor)
  );

export function TokenSelector(props: PropTypes) {
  const { list, selected, hasHeader, onChange, onBack, loadingStatus } =
    props;

  return (
    <SecondaryPage
      textField={true}
      hasHeader={hasHeader}
      title={"Select token"}
      onBack={onBack}
      textFieldPlaceholder="Search tokens by name"
    >
      {(searchedFor) => {
        const filteredTokens = filterTokens(list, searchedFor);

        return loadingStatus === "loading" ? (
          <LoaderContainer>
            <Spinner size={24} />
          </LoaderContainer>
        ) : loadingStatus === "failed" ? (
          <LoadingFailedAlert />
        ) : filteredTokens.length ? (
          <TokenList
            searchedText={searchedFor}
            list={filteredTokens}
            selected={selected}
            onChange={onChange}
          />
        ) : (
          <NotFoundAlert catergory="Token" searchedFor={searchedFor} />
        );
      }}
    </SecondaryPage>
  );
}
