import AptosLogo from "../assets/chains/aptos.svg";
import SuiLogo from "../assets/chains/sui.svg";

export const chainList = [
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0x1",
    color: "#ecf0f1",
    defaultDecimals: 18,
    displayName: "Ethereum",
    enabled: true,
    feeAssets: [
      {
        blockchain: "ETHEREUM_MAINNET_MAINNET",
        symbol: "ETH",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://etherscan.io/address/{wallet}",
      blockExplorerUrls: ["https://etherscan.io"],
      chainName: "Ethereum",
      enableGasV2: true,
      infoType: "EvmMetaInfo",
      nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" },
      rpcUrls: ["https://rpc.ankr.com/eth"],
      transactionUrl: "https://etherscan.io/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/ethereum.svg",
    name: "ETHEREUM_MAINNET_MAINNET",
    shortName: "ETH",
    sort: 0,
    type: "EVM",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0x5",
    color: "#ecf0f1",
    defaultDecimals: 18,
    displayName: "Ethereum Goerli",
    enabled: true,
    feeAssets: [
      {
        blockchain: "ETHEREUM_TESTNET_GOERLI",
        symbol: "ETH",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://goerli.etherscan.io/address/{wallet}",
      blockExplorerUrls: ["https://goerli.etherscan.io/"],
      chainName: "Ethereum Goerli Testnet",
      enableGasV2: true,
      infoType: "EvmMetaInfo",
      nativeCurrency: { decimals: 18, name: "ETH", symbol: "ETH" },
      rpcUrls: ["https://rpc.ankr.com/eth_goerli"],
      transactionUrl: "https://goerli.etherscan.io/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/i/hncTcy",
    name: "ETHEREUM_TESTNET_GOERLI",
    shortName: "Goerli ETH",
    sort: 1,
    type: "EVM",
  },
  {
    addressPatterns: ["^[1-9A-HJ-NP-Za-km-z]{32,44}$"],
    chainId: "testnet-beta",
    color: "#708DD2",
    defaultDecimals: 9,
    displayName: "Solana",
    enabled: true,
    feeAssets: [{ blockchain: "SOLANA", symbol: "SOL", address: null }],
    info: {
      blockExplorerUrls: ["https://explorer.solana.com"],
      transactionUrl: "https://explorer.solana.com/tx/{txHash}?cluster",
    },
    logo: "https://api.rango.exchange/blockchains/solana.svg",
    name: "SOLANA_MAINNET_MAINNET",
    shortName: "Solana",
    sort: 17,
    type: "SOLANA",
  },
  {
    addressPatterns: ["^[1-9A-HJ-NP-Za-km-z]{32,44}$"],
    chainId: "testnet",
    color: "#708DD2",
    defaultDecimals: 9,
    displayName: "Solana Testnet",
    enabled: true,
    feeAssets: [
      {
        blockchain: "SOLANA_TESTNET_TESTNET",
        symbol: "SOL",
        address: null,
      },
    ],
    info: {
      blockExplorerUrls: ["https://explorer.solana.com"],
      transactionUrl: "https://explorer.solana.com/tx/{txHash}?cluster=testnet",
    },
    logo: "https://api.rango.exchange/blockchains/solana.svg",
    name: "SOLANA_TESTNET_TESTNET",
    shortName: "Solana Testnet",
    sort: 17,
    type: "SOLANA",
  },
  {
    addressPatterns: "0x[a-fA-F0-9]{64}",
    chainId: null,
    color: "#708DD2",
    defaultDecimals: 8,
    displayName: "Aptos",
    enabled: true,
    feeAssets: [
      {
        blockchain: "APTOS_MAINNET_MAINNET",
        symbol: "APT",
        address: null,
      },
    ],
    info: {
      blockExplorerUrls: ["https://explorer.aptoslabs.com"],
      transactionUrl:
        "https://explorer.aptoslabs.com/txn/275823155?network=mainnet",
    },
    logo: AptosLogo,
    name: "APTOS_MAINNET_MAINNET",
    shortName: "APTOS",
    sort: 15,
    type: "APTOS",
  },
  {
    addressPatterns: "0x[a-fA-F0-9]{64}",
    chainId: "testnet-beta",
    color: "#708DD2",
    defaultDecimals: 8,
    displayName: "Aptos Testnet",
    enabled: true,
    feeAssets: [
      {
        blockchain: "APTOS_TESTNET_TESTNET",
        symbol: "APT",
        address: null,
      },
    ],
    info: {
      blockExplorerUrls: ["https://explorer.aptoslabs.com"],
      transactionUrl:
        "https://explorer.aptoslabs.com/txn/275823155?network=testnet",
    },
    logo: AptosLogo,
    name: "APTOS_TESTNET_TESTNET",
    shortName: "APTOS Testnet",
    sort: 15,
    type: "APTOS",
  },
  {
    addressPatterns: "0x[a-fA-F0-9]{64}",
    chainId: null,
    color: "#708DD2",
    defaultDecimals: 9,
    displayName: "Sui",
    enabled: true,
    feeAssets: [
      {
        blockchain: "SUI_MAINNET_MAINNET",
        symbol: "SUI",
        address: null,
      },
    ],
    info: {
      blockExplorerUrls: ["https://suiexplorer.com/"],
      transactionUrl: "https://suiexplorer.com/address/{txHash}",
    },
    logo: SuiLogo,
    name: "SUI_MAINNET_MAINNET",
    shortName: "SUI",
    sort: 15,
    type: "SUI",
  },
  {
    addressPatterns: "0x[a-fA-F0-9]{64}",
    chainId: null,
    color: "#708DD2",
    defaultDecimals: 9,
    displayName: "Sui Testnet",
    enabled: true,
    feeAssets: [
      {
        blockchain: "SUI_TESTNET_TESTNET",
        symbol: "SUI",
        address: null,
      },
    ],
    info: {
      blockExplorerUrls: ["https://suiexplorer.com/"],
      transactionUrl:
        "https://suiexplorer.com/address/{txHash}?network=testnet",
    },
    logo: SuiLogo,
    name: "SUI_TESTNET_TESTNET",
    shortName: "SUI Testnet",
    sort: 15,
    type: "SUI",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0x38",
    color: "#F3BA2F",
    defaultDecimals: 18,
    displayName: "BNB Smart Chain",
    enabled: true,
    feeAssets: [
      {
        blockchain: "BNB_MAINNET_MAINNET",
        symbol: "BNB",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://bscscan.com/address/{wallet}",
      blockExplorerUrls: ["https://bscscan.com"],
      transactionUrl: "https://bscscan.com/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/bsc.svg",
    name: "BNB_MAINNET_MAINNET",
    shortName: "BSC",
    sort: 1,
    type: "EVM",
  },
  {
    addressPatterns: "^(0x)[0-9A-Fa-f]{40}$",
    chainId: "0xa4b1",
    color: "#28a0f0",
    defaultDecimals: 18,
    displayName: "Arbitrum",
    enabled: true,
    feeAssets: [
      {
        blockchain: "ARBITRUM_MAINNET_MAINNET",
        symbol: "ETH",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://arbiscan.io/address/{wallet}",
      blockExplorerUrls: "https://arbiscan.io",
      transactionUrl: "https://arbiscan.io/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/arbitrum.svg",
    name: "ARBITRUM_MAINNET_MAINNET",
    shortName: "Arbitrum",
    sort: 2,
    type: "EVM",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0x89",
    color: "#8247E5",
    defaultDecimals: 18,
    displayName: "Polygon",
    enabled: true,
    feeAssets: [
      {
        blockchain: "POLYGON_MAINNET_MAINNET",
        symbol: "MATIC",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://polygonscan.com/address/{wallet}",
      blockExplorerUrls: "https://polygonscan.com",
      transactionUrl: "https://polygonscan.com/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/polygon.svg",
    name: "POLYGON_MAINNET_MAINNET",
    shortName: "Polygon",
    sort: 3,
    type: "EVM",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0xa",
    color: "#FF0420",
    defaultDecimals: 18,
    displayName: "Optimism",
    enabled: true,
    feeAssets: [
      {
        blockchain: "OPTIMISM_MAINNET_MAINNET",
        symbol: "ETH",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://optimistic.etherscan.io/address/{wallet}",
      blockExplorerUrls: "https://optimistic.etherscan.io",
      transactionUrl: "https://optimistic.etherscan.io/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/optimism.svg",
    name: "OPTIMISM_MAINNET_MAINNET",
    shortName: "Optimisum",
    sort: 6,
    type: "EVM",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0xa86a",
    color: "#e84142",
    defaultDecimals: 18,
    displayName: "Avalanche",
    enabled: true,
    feeAssets: [
      {
        blockchain: "AVALANCHE_MAINNET_CCHAIN",
        symbol: "AVAX",
        address: null,
      },
    ],
    info: {
      addressUrl: "https://snowtrace.io/address/{wallet}",
      blockExplorerUrls: "https://snowtrace.io",
      transactionUrl: "https://snowtrace.io/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/avax_cchain.svg",
    name: "AVALANCHE_MAINNET_CCHAIN",
    shortName: "Avax",
    sort: 7,
    type: "EVM",
  },
  {
    addressPatterns: ["^(0x)[0-9A-Fa-f]{40}$"],
    chainId: "0x64",
    color: "#3E6957",
    defaultDecimals: 18,
    displayName: "Gnosis",
    enabled: false,
    feeAssets: [
      { blockchain: "GNOSIS_MAINNET_MAINNET", XDAI: "", address: null },
    ],
    info: {
      addressUrl: "https://blockscout.com/xdai/mainnet/address/{wallet}",
      blockExplorerUrls: "https://rpc.gnosischain.com",
      transactionUrl: "https://blockscout.com/xdai/mainnet/tx/{txHash}",
    },
    logo: "https://api.rango.exchange/blockchains/gnosis.svg",
    name: "GNOSIS_MAINNET_MAINNET",
    shortName: "Gnosis",
    sort: 45,
    type: "EVM",
  },
];
