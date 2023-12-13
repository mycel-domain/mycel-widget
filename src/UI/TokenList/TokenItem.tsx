import React, { CSSProperties } from "react";
import { styled } from "../../theme";
import { Button } from "../Button";
import { Typography } from "../Typography";
import { TokenWithAmount } from "./TokenList";
import { Image } from "../common";
import { Token } from "../../types/api/main";
import { replaceIPFSUrlToHTTP } from "../../utils/common";
import { useTransactionStore } from "../../store/transaction";

const TokenImageContainer = styled("div", {
  paddingRight: "$16",
});

const TokenNameContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const TokenAmountContainer = styled("div", {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-end",
});

interface PropTypes {
  token: TokenWithAmount;
  selected: boolean;
  onClick: (token: Token) => void;
  style?: CSSProperties;
}

export function TokenItem(props: PropTypes) {
  const { token, style, onClick, selected } = props;
  const fromChain = useTransactionStore.use.fromChain();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        ...style,
        height: "48px",
        top: `${parseFloat(style?.top as string) + 0}px`,
        padding: "0 4px",
      }}
    >
      <Button
        variant="outlined"
        size="large"
        align="start"
        onClick={onClick.bind(null, token)}
        type={selected ? "primary" : undefined}
        prefix={
          <TokenImageContainer>
            <Image
              src={replaceIPFSUrlToHTTP(token.logoURI)}
              size={32}
              onError={({ currentTarget }) => {
                currentTarget.src = fromChain?.logo as string;
              }}
            />
          </TokenImageContainer>
        }
        suffix={
          token.balance?.amount && (
            <TokenAmountContainer>
              <Typography variant="body2">{token.balance.amount}</Typography>
              <Typography variant="caption">
                {`${token.balance.usdValue}$`}
              </Typography>
            </TokenAmountContainer>
          )
        }
      >
        <TokenNameContainer>
          <Typography variant="body1">{token.symbol}</Typography>
          <Typography variant="caption" color="neutral600">
            {token.name}
          </Typography>
        </TokenNameContainer>
      </Button>
    </div>
  );
}
