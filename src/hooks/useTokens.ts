import React from "react";
import { getTokenList } from "../utils/tokens";

export function useTokens() {
  const [tokenList, setTokensList] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      await getTokenList().then((res) => setTokensList(res.tokens));
    })();
  }, []);

  return { tokenList };
}
