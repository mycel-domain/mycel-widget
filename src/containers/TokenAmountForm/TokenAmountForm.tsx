import React from 'react';
import { BlockchainMeta, ConnectedWallet } from '../../types';
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
import { TokenWithBalance } from "../../types/meta";

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

type TokenAmountFormProps = {
  onAmountChange: (amount: string) => void;
  chain: BlockchainMeta | null;
  token: TokenWithBalance | null;
  loadingStatus: 'loading' | 'success' | 'failed';
  setInputAmount: (amount: string) => void;
  connectedWallets: ConnectedWallet[];
  inputAmount: string;
  onChainClick: () => void;
  onTokenClick: () => void;
}

export function TokenAmountForm(props: TokenAmountFormProps) {
  const {
    chain,
    token,
    loadingStatus,
    inputAmount,
    onChainClick,
    onTokenClick,
  } = props;

  const ImagePlaceholder = styled('span', {
    width: '24px',
    height: '24px',
    backgroundColor: '$neutral100',
    borderRadius: '99999px',
  });

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
      <Container type={'filled'}>
        <div className="head">
          <Typography variant="body2" color="neutral800">
            Token Info
          </Typography>
        </div>
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
                (event) => {
                  props.onAmountChange(event.target.value);
                }
              }
            />
          </div>
        </div>
      </Container>
    </Box>
  );
}

