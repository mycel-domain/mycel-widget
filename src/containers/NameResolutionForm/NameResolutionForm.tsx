import React, { useState, useEffect } from 'react';
import { styled } from "@stitches/react";
import { BlockchainMeta } from '../../types';
import { RegistryRecord, RegistryNetworkName } from "mycel-client-ts/mycel.resolver/rest";
import {
  TextField,
  Typography,
} from '../..';
import { useClient } from "../../hooks/useClientProvider";
import { useTransactionStore } from '../../store/transaction';
import { convertToNameAndParent } from "../../utils/domainName";

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

type NameResolutionFormProps = {
  chain: BlockchainMeta | null;
  setError: (error: string) => void;
}

export function NameResolutionForm(props: NameResolutionFormProps) {
  const { client } = useClient();
  const targetNetworkName = useTransactionStore.use.targetNetworkName();
  const setDomainName = useTransactionStore.use.setDomainName();
  const domainName = useTransactionStore.use.domainName();
  const toAddress = useTransactionStore.use.toAddress();
  const setToAddress = useTransactionStore.use.setToAddress();

  const [mycelRecords, setMycelRecord] = useState<Record<string, RegistryRecord> | undefined>(
    undefined
  );

  const queryAllRecords = async (name: string, parent: string) => {
    try {
      const record = await client.MycelResolver.query.queryAllRecords(name, parent);
      setMycelRecord(record.data.values || undefined);
    } catch (e) {
      console.error(e);
      setMycelRecord(undefined);
    }
  }

  const getWalletAddr = (recordType: RegistryNetworkName) => {
    if (!mycelRecords || !mycelRecords[recordType] || !mycelRecords[recordType].walletRecord) {
      return "";
    } else {
      return mycelRecords[recordType].walletRecord?.value;
    }
  };


  useEffect(() => {
    if (domainName) {
      if (mycelRecords && targetNetworkName) {
        const walletAddr = getWalletAddr(targetNetworkName);
        if (walletAddr) {
          setToAddress(walletAddr);
          props.setError("");
        }
      } else {
        setToAddress("");
        props.setError(`${domainName} doesn't exists in registry on ${props.chain?.displayName}.`);
      }
    }
  }, [mycelRecords, targetNetworkName, domainName]);


  useEffect(() => {
    if (domainName) {
      const { name, parent } = convertToNameAndParent(domainName);
      queryAllRecords(name, parent);
    }
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
      </Container >
    </Box >
  );
};

