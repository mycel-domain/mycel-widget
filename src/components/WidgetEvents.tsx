import { useWalletsStore } from "../store/wallets";

export function WidgetEvents() {
  const connectedWallets = useWalletsStore.use.connectedWallets();
  const getWalletsDetails = useWalletsStore.use.getWalletsDetails();

  // const widgetEvents = useEvents();

  // useEffect(() => {
  //   widgetEvents.on(MainEvents.StepEvent, (widgetEvent) => {
  //     const { event, step } = widgetEvent;
  //     const shouldRefetchBalance =
  //       (event.type === StepEventType.TX_EXECUTION &&
  //         event.status === StepExecutionEventStatus.TX_SENT &&
  //         !isApprovalTX(step)) ||
  //       event.type === StepEventType.SUCCEEDED;

  //     if (shouldRefetchBalance) {
  //       const fromAccount = connectedWallets.find(
  //         (account) => account.chain === step?.fromBlockchain
  //       );
  //       const toAccount =
  //         step?.fromBlockchain !== step?.toBlockchain &&
  //         connectedWallets.find(
  //           (wallet) => wallet.chain === step?.toBlockchain
  //         );

  //       fromAccount && getWalletsDetails([fromAccount]);
  //       toAccount && getWalletsDetails([toAccount]);
  //     }
  //   });

  //   return () => widgetEvents.all.clear();
  // }, [widgetEvents, connectedWallets.length]);

  return null;
}
