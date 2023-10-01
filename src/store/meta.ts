import { create } from "zustand";
import { httpService } from "../utils/httpService";
import createSelectors from "./selectors";
import { removeDuplicateFrom } from "../utils/common";
import AptosLogo from "../assets/chains/aptos.svg";
import SUILogo from "../assets/chains/sui.svg";
import { MetaResponse } from "../types/api/main";

export type LoadingStatus = "loading" | "success" | "failed";

export interface MetaState {
  meta: MetaResponse;
  loadingStatus: LoadingStatus;
  fetchMeta: () => Promise<void>;
}

export const useMetaStore = createSelectors(
  create<MetaState>()((set) => ({
    meta: { blockchains: [], popularTokens: [], swappers: [], tokens: [] },
    loadingStatus: "loading",
    fetchMeta: async () => {
      try {
        const response = await httpService().getAllMetadata();
        const chainThatHasTokenInMetaResponse = removeDuplicateFrom(
          response.tokens.map((t) => t.blockchain)
        );
        const enabledChains = response.blockchains.filter(
          (chain) =>
            chain.enabled &&
            chainThatHasTokenInMetaResponse.includes(chain.name)
        );
        response.tokens.push(
          {
            address: "0xdd69db25f6d620a7bad3023c5d32761d353d3de9",
            blockchain: "GETH",
            coinSource: "CoinGecko",
            coinSourceUrl:
              "https://api.rango.exchange/tokens/SOURCES/COINGECKO.png",
            decimals: 18,
            name: "Goerli ETH",
            image: "https://api.rango.exchange/i/hncTcy",
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "GETH",
            usdPrice: 1563.382,
          },
          {
            address: null,
            blockchain: "SOLANA_TESTNET",
            coinSource: null,
            coinSourceUrl: null,
            decimals: 9,
            name: "Testnet SOL",
            image: "https://api.rango.exchange/i/eLHYrb",
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "SOL",
            usdPrice: 19.408,
          },
          {
            address: null,
            blockchain: "APTOS",
            coinSource: null,
            coinSourceUrl: null,
            decimals: 9,
            name: "APT",
            image: AptosLogo,
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "APT",
            usdPrice: null,
            type: "APTOS",
          } as any,
          {
            address: null,
            blockchain: "APTOS_TESTNET",
            coinSource: null,
            coinSourceUrl: null,
            decimals: 9,
            name: "Testnet APT",
            image: AptosLogo,
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "APT",
            usdPrice: 19.408,
            type: "APTOS",
          } as any,
          {
            address: null,
            blockchain: "SUI",
            coinSource: null,
            coinSourceUrl: null,
            decimals: 9,
            name: "SUI",
            image: SUILogo,
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "SUI",
            usdPrice: 19.408,
            type: "SUI",
          } as any,
          {
            address: null,
            blockchain: "SUI_TESTNET",
            coinSource: null,
            coinSourceUrl: null,
            decimals: 9,
            name: "Testnet SUI",
            image: SUILogo,
            isPopular: true,
            isSecondaryCoin: false,
            symbol: "SUI",
            usdPrice: null,
            type: "SUI",
          } as any
        );
        response.blockchains.push(
          {
            addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
            chainId: "0x5",
            color: "#ecf0f1",
            defaultDecimals: 18,
            displayName: "Goerli ETH",
            enabled: true,
            feeAssets: [{ blockchain: "GETH", symbol: "GETH", address: null }],
            info: {
              addressUrl: "https://goerli.etherscan.io/address/{wallet}",
              blockExplorerUrls: ["https://goerli.etherscan.io/"],
              chainName: "Ethereum Goerli Testnet",
              enableGasV2: true,
              infoType: "EvmMetaInfo",
              nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" },
              rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
              transactionUrl: "https://goerli.etherscan.io/tx/",
            },
            logo: "https://api.rango.exchange/i/hncTcy",
            name: "GETH",
            shortName: "GETH",
            sort: 0,
            type: "EVM",
            isTestnet: true,
          } as any,
          {
            addressPatterns: ["^[1-9A-HJ-NP-Za-km-z]{32,44}$"],
            chainId: "testnet-beta",
            color: "#708DD2",
            defaultDecimals: 9,
            displayName: "Solana Testnet",
            enabled: true,
            feeAssets: [
              { blockchain: "SOLANA_TESTNET", symbol: "SOL", address: null },
            ],
            info: null,
            logo: "https://api.rango.exchange/blockchains/solana.svg",
            name: "SOLANA_TESTNET",
            shortName: "Solana Test",
            sort: 15,
            type: "SOLANA",
            isTestnet: true,
          } as any,
          {
            addressPatterns: ["0x[a-fA-F0-9]{64}"],
            chainId: null,
            color: "#708DD2",
            defaultDecimals: 8,
            displayName: "Aptos",
            enabled: true,
            feeAssets: [{ blockchain: "APTOS", symbol: "APT", address: null }],
            info: {
              blockExplorerUrls: ["https://explorer.aptoslabs.com"],
              transactionUrl:
                "https://explorer.aptoslabs.com/txn/275823155?network=mainnet",
            },
            logo: AptosLogo,
            name: "APTOS",
            shortName: "APTOS",
            sort: 15,
            type: "APTOS",
            isTestnet: false,
          } as any,
          {
            addressPatterns: ["0x[a-fA-F0-9]{64}"],
            chainId: null,
            color: "#708DD2",
            defaultDecimals: 8,
            displayName: "Aptos Testnet",
            enabled: true,
            feeAssets: [
              { blockchain: "APTOS_TESTNET", symbol: "APT", address: null },
            ],
            info: {
              blockExplorerUrls: ["https://explorer.aptoslabs.com"],
              transactionUrl:
                "https://explorer.aptoslabs.com/txn/275823155?network=testnet",
            },
            logo: AptosLogo,
            name: "APTOS_TESTNET",
            shortName: "APTOS Testnet",
            sort: 15,
            type: "APTOS",
            isTestnet: true,
          } as any,
          {
            addressPatterns: ["0x[a-fA-F0-9]{64}"],
            chainId: null,
            color: "#708DD2",
            defaultDecimals: 9,
            displayName: "Sui",
            enabled: true,
            feeAssets: [{ blockchain: "SUI", symbol: "SUI", address: null }],
            info: {
              blockExplorerUrls: ["https://suiexplorer.com/"],
              transactionUrl: "https://suiexplorer.com/txBlock/{txHash}",
            },
            logo: SUILogo,
            name: "SUI",
            shortName: "SUI",
            sort: 15,
            type: "SUI",
            isTestnet: false,
          } as any,
          {
            addressPatterns: ["0x[a-fA-F0-9]{64}"],
            chainId: null,
            color: "#708DD2",
            defaultDecimals: 9,
            displayName: "Sui Testnet",
            enabled: true,
            feeAssets: [
              { blockchain: "SUI_TESTNET", symbol: "SUI", address: null },
            ],
            info: {
              blockExplorerUrls: ["https://suiexplorer.com/"],
              transactionUrl:
                "https://suiexplorer.com/txBlock/{txHash}?network=testnet",
            },
            logo: SUILogo,
            name: "SUI_TESTNET",
            shortName: "SUI Testnet",
            sort: 15,
            type: "SUI",
            isTestnet: true,
          } as any
        );
        response.blockchains = response.blockchains.sort(
          (a, b) => a.sort - b.sort
        );
        set({ meta: response, loadingStatus: "success" });
      } catch (error) {
        set({ loadingStatus: "failed" });
      }
    },
  }))
);
