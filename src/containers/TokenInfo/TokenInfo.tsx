import type { TokenWithBalance } from '../../types/meta';
import {
  AngleDownIcon,
  Button,
  Divider,
  Image,
  InfoCircleIcon,
  styled,
  TextField,
  Typography,
} from '../..';
import { useRegistryDomain } from '../../hooks/useRegistryDomain';
import { RegistryDomain, RegistryNetworkName } from 'mycel-client-ts/mycel.registry/rest';
import React from 'react';
import { useTransactionStore } from '../../store/transaction';
import { BlockchainMeta, ConnectedWallet } from '../../types';
import { BestRouteResponse, Token } from '../../types/api/main';

type PropTypes = (
  | {
      type: 'From';
      onAmountChange: (amount: string) => void;
    }
  | {
      type: 'To';
      outputAmount: string;
      outputUsdValue: string;
      percentageChange: string;
      showPercentageChange: boolean;
    }
) & {
  chain: BlockchainMeta | null;
  token: Token | null;
  loadingStatus: 'loading' | 'success' | 'failed';
  fromChain: BlockchainMeta | null;
  toChain: BlockchainMeta | null;
  inputUsdValue: string;
  fromToken: TokenWithBalance | null;
  setInputAmount: (amount: string) => void;
  connectedWallets: ConnectedWallet[];
  inputAmount: string;
  bestRoute: BestRouteResponse | null;
  fetchingBestRoute: boolean;
  onChainClick: () => void;
  onTokenClick: () => void;
  tokenBalanceReal: string;
  tokenBalance: string;
};

const Box = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  overflow: 'hidden',
});

const Container = styled('div', {
  boxSizing: 'border-box',
  borderRadius: '$5',
  padding: '$8 $16 $16 $16',

  variants: {
    type: {
      filled: {
        backgroundColor: '$neutral100',
      },
      outlined: {
        border: '1px solid $neutral100',
        backgroundColor: '$surface',
      },
    },
  },

  defaultVariants: {
    type: 'filled',
  },

  '.head': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '32px',
  },
  '.form': {
    display: 'flex',
    width: '100%',
    padding: '$2 0',
    '.selectors': {
      width: '35%',

      '._text': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
    '.amount': {
      width: '30%',
    },
  },
  '.output-usd': {
    display: 'flex',
    div: {
      display: 'flex',
      paddingLeft: '$8',
    },
  },
});

const ImagePlaceholder = styled('span', {
  width: '24px',
  height: '24px',
  backgroundColor: '$neutral100',
  borderRadius: '99999px',
});

const getWalletAddr = (domain: RegistryDomain, recordType: RegistryNetworkName) => {
  if (!domain || !domain.walletRecords || !domain.walletRecords[recordType]) {
    return "";
  }
  return domain.walletRecords[recordType].value;
};

export function TokenInfo(props: PropTypes) {
  const {
    type,
    chain,
    token,
    loadingStatus,
    fromChain,
    inputAmount,
    onChainClick,
    onTokenClick,
  } = props;

  const { registryDomain, updateRegistryDomain } = useRegistryDomain();
  const targetNetworkName = useTransactionStore.use.targetNetworkName();
  const toAddress = useTransactionStore.use.toAddress();
  const setToAddress = useTransactionStore.use.setToAddress();
  const [domainName, setDomainName] = React.useState("");

  React.useEffect(() => {
    if (registryDomain) {
      const walletAddr = registryDomain ? getWalletAddr(registryDomain, targetNetworkName as RegistryNetworkName) : "";
      setToAddress(walletAddr || "");
    } else {
      setToAddress("");
    }
  }, [registryDomain, targetNetworkName]);


   React.useEffect(() => {
    updateRegistryDomain(domainName)
      .then()
      .catch((e) => {
        console.error(e);
      });
  }, [targetNetworkName, domainName]);

  const ItemSuffix = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {loadingStatus === 'failed' && <InfoCircleIcon color="error" size={24} />}
      <AngleDownIcon />
    </div>
  );

  return (
    <Box>
      <Container type={type === 'From' ? 'filled' : 'outlined'}>
        <div className="head">
          <Typography variant="body2" color="neutral800">
            {type === 'From' ? (
              'From'
            ) : (
              "To"
            )}
          </Typography>
            {/* <Options> // TODO: Get balance
              <div
                className="balance"
                onClick={() => {
                  if (tokenBalance !== '0') {
                    setInputAmount(tokenBalanceReal.split(',').join(''));
                  }
                }}>
                <Typography variant="body3" color="neutral600">
                  {'Balance'}: {tokenBalance} {fromToken?.symbol || ''}
                </Typography>
                <Divider size={4} />
                <Button type="primary" variant="ghost" size="compact">
                  Max
                </Button>
              </div>
            </Options> */}
        </div>
        {type === 'From' ? (
          <div className="form">
            <Button
              className="selectors"
              onClick={onChainClick}
              variant="outlined"
              disabled={loadingStatus === 'failed'}
              loading={loadingStatus === 'loading'}
              prefix={
                loadingStatus === 'success' && chain ? (
                  <Image src={chain.logo} size={24} />
                ) : (
                  <ImagePlaceholder />
                )
              }
              suffix={ItemSuffix}
              align="start"
              size="large">
              {loadingStatus === 'success' && chain
                ? chain.displayName
                : 'Chain'}
            </Button>
            <Divider size={12} direction="horizontal" />
            <Button
              className="selectors"
              onClick={onTokenClick}
              variant="outlined"
              disabled={
                loadingStatus === 'failed' || (type === 'From' && !fromChain)
              }
              loading={loadingStatus === 'loading'}
              prefix={
                loadingStatus === 'success' && token ? (
                  <Image src={token.image} size={24} />
                ) : (
                  <ImagePlaceholder />
                )
              }
              suffix={ItemSuffix}
              size="large"
              align="start">
              {loadingStatus === 'success' && token
                ? token.symbol
                : 'Token'}
            </Button>
            <Divider size={12} direction="horizontal" />
            <div className="amount">
              <TextField
                type="number"
                size="large"
                autoFocus
                placeholder="0"
                style={{
                  position: 'relative',
                  backgroundColor: '$background !important',
                }}
                value={inputAmount || ''}
                min={0}
                onChange={
                  type === 'From'
                    ? (event) => {
                        props.onAmountChange(event.target.value);
                      }
                    : undefined
                }
              />
            </div>
          </div>
        ) : (
          <>
          <div className="form">
            <TextField
              type="text"
              size="large"
              autoFocus
              style={{
                position: 'relative',
                backgroundColor: '$background !important',
              }}
              suffix={
                <span
                  style={{
                    position: 'absolute',
                    right: '4px',
                    bottom: '2px',
                  }}>
                  <Typography
                    variant="caption"
                    color="neutral800">{domainName}</Typography>
                </span>
              }
              value={domainName}
              onChange={(e) => {
                setDomainName(e.target.value)
              }}
            />
          </div>
          {domainName && targetNetworkName && (
            toAddress ? (
          <p style={{color: '#000', overflowWrap: 'break-word'}}>
            <span className="italic">{domainName}</span> on {targetNetworkName} is found: <span className="italic">{toAddress}</span>.
          </p>
        ) : (
          <p style={{color: '#d80128', overflowWrap: 'break-word'}}className="m-2 text-sm text-red-500">
            <span className="italic">{domainName}</span> doesn&apos;t exists in registry on {targetNetworkName}.
          </p>
        )
          )}
          </>
        )}
      </Container>
      {/* <Drawer // TODO: Add drawer fo confirmation
        open={true}
        showClose={true}
        anchor='top'
        title="Send Confirmation"
        content={<Alert type='primary'>
          <Typography variant="body2">
            Warning: Cancel <u>doesn't revert</u> your transaction if you've
            already signed and sent a transaction to the blockchain. It only
            stops next steps from being executed.
          </Typography>
        </Alert>}
        footer={<div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            variant="contained"
            type="success"
          >
            Skip
          </Button>
          <Divider size={16} direction="horizontal" />
          <Button
            variant="contained"
            type="error"
          >
            Cancel progress
          </Button>
        </div>}
        container={document.getElementById('swap-box')!} onClose={function (): void {
          throw new Error('Function not implemented.');
        } }      /> */}
    </Box>
  );
}
