import React, { useEffect } from 'react';
import { RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import {
  styled,
  TextField,
  Typography,
} from '../..';
import { useMycelResolver } from '../../hooks/useMycelResolver';
import { useTransactionStore } from '../../store/transaction';

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

export function NameResolutionForm() {
  const { mycelRecords, updateMycelRecords, getWalletAddr } = useMycelResolver();
  const targetNetworkName = useTransactionStore.use.targetNetworkName();
  const toAddress = useTransactionStore.use.toAddress();
  const setToAddress = useTransactionStore.use.setToAddress();
  const [domainName, setDomainName] = React.useState("");

  useEffect(() => {
    if (mycelRecords) {
      const walletAddr = getWalletAddr(targetNetworkName as RegistryNetworkName);
      setToAddress(walletAddr || "");
    } else {
      setToAddress("");
    }
  }, [mycelRecords, targetNetworkName]);


  useEffect(() => {
    updateMycelRecords(domainName)
      .then()
      .catch((e) => {
        console.error(e);
      });
  }, [targetNetworkName, domainName]);

  return (
    <Box>
      <Container type="outlined">
        <div className="head">
          <Typography variant="body2" color="neutral800">
            To
          </Typography>
        </div>
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
                  color="neutral800">{toAddress ? toAddress : ""}</Typography>
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
            <p style={{ color: '#000', overflowWrap: 'break-word' }}>
            </p>
          ) : (
            <p style={{ color: '#d80128', overflowWrap: 'break-word' }} className="m-2 text-sm text-red-500">
              <span className="italic">{domainName}</span> doesn&apos;t exists in registry on {targetNetworkName}.
            </p>
          )
        )}
      </Container >
    </Box >
  );
};

