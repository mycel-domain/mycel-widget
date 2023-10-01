import { TransactionState } from "../store/transaction";
import { SettingsState } from "../store/settings";

interface TransactionStoreParams {
  fromChain?: TransactionState["fromChain"];
  toChain?: TransactionState["toChain"];
  fromToken?: TransactionState["fromToken"];
  toToken?: TransactionState["toToken"];
  inputAmount?: TransactionState["inputAmount"];
}

interface SettingsStoreParams {
  slippage: any;
  customSlippage: any;
  disabledLiquiditySources: any;
  infiniteApprove?: SettingsState["infiniteApprove"];
}

export type BestRouteEqualityParams =
  | {
      store: "bestRoute";
      prevState: TransactionStoreParams;
      currentState: TransactionStoreParams;
    }
  | {
      store: "settings";
      prevState: SettingsStoreParams;
      currentState: SettingsStoreParams;
    };
