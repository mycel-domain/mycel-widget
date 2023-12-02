import AptosLogo from "../assets/chains/aptos.svg";
import SuiLogo from "../assets/chains/sui.svg";
import ZetaLogo from "../assets/chains/zeta.svg";
import ShardeumLogo from "../assets/chains/shardeum.svg";

export const tokenList = [
  {
    address: null,
    blockchain: "ETHEREUM_MAINNET_MAINNET",
    coinSource: "CoinGecko",
    coinSourceUrl: "https://api.rango.exchange/tokens/SOURCES/COINGECKO.png",
    decimals: 18,
    name: "Ethreum",
    image: "https://api.rango.exchange/blockchains/ethereum.svg",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "ETH",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: "0xdd69db25f6d620a7bad3023c5d32761d353d3de9",
    blockchain: "ETHEREUM_TESTNET_GOERLI",
    coinSource: "CoinGecko",
    coinSourceUrl: "https://api.rango.exchange/tokens/SOURCES/COINGECKO.png",
    decimals: 18,
    name: "Goerli ETH",
    image: "https://api.rango.exchange/i/hncTcy",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "ETH",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "BNB_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: null,
    image: "https://api.rango.exchange/blockchains/bsc.svg",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "BNB",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "BNB_TESTNET_TESTNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "BNB Testnet",
    image: "https://api.rango.exchange/blockchains/bsc.svg",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "BNB",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: "0x912ce59144191c1204e64559fe8253a0e49e6548",
    blockchain: "ARBITRUM_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Arbitrum",
    image: "https://api.rango.exchange/blockchains/arbitrum.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "ARB",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "ARBITRUM_TESTNET_GOERLI",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Arbitrum Goerli",
    image: "https://api.rango.exchange/blockchains/arbitrum.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "ARB",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "POLYGON_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Polygon",
    image: "https://api.rango.exchange/blockchains/polygon.svg",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "MATIC",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "POLYGON_TESTNET_MUMBAI",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Polygon Mumbai",
    image: "https://api.rango.exchange/blockchains/polygon.svg",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "MATIC",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: "0x4200000000000000000000000000000000000042",
    blockchain: "OPTIMISM_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Optimism",
    image: "https://api.rango.exchange/blockchains/optimism.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "OP",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "OPTIMISM_TESTNET_GOERLI",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Optimism Goerli",
    image: "https://api.rango.exchange/blockchains/optimism.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "OP",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "AVALANCHE_MAINNET_CCHAIN",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: null,
    image: "https://api.rango.exchange/tokens/AVAX_CCHAIN/AVAX.png",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "AVAX",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "AVALANCHE_TESTNET_FUJI",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Avalanche Fuji",
    image: "https://api.rango.exchange/tokens/AVAX_CCHAIN/AVAX.png",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "AVAX",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "GNOSIS_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: null,
    image: "https://api.rango.exchange/blockchains/gnosis.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "GNO",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "GNOSIS_TESTNET_CHIADO",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Gnosis Chiado",
    image: "https://api.rango.exchange/blockchains/gnosis.svg",
    isPopular: false,
    isSecondaryCoin: false,
    symbol: "XDAI",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "SOLANA_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 9,
    name: "Solana",
    image: "https://api.rango.exchange/i/eLHYrb",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "SOL",
    usdPrice: null,
    type: "SOLANA",
  },
  {
    address: null,
    blockchain: "SOLANA_TESTNET_TESTNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 9,
    name: "Testnet SOL",
    image: "https://api.rango.exchange/i/eLHYrb",
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "SOL",
    usdPrice: null,
    type: "SOLANA",
  },
  {
    address: null,
    blockchain: "APTOS_MAINNET_MAINNET",
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
  },
  {
    address: null,
    blockchain: "APTOS_TESTNET_TESTNET",
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
  },
  {
    address: null,
    blockchain: "SUI_MAINNET_MAINNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 9,
    name: "SUI",
    image: SuiLogo,
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "SUI",
    usdPrice: 19.408,
    type: "SUI",
  },
  {
    address: null,
    blockchain: "SUI_TESTNET_TESTNET",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 9,
    name: "Testnet SUI",
    image: SuiLogo,
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "SUI",
    usdPrice: null,
    type: "SUI",
  },
  {
    address: null,
    blockchain: "SHARDEUM_BETANET_SPHINX",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 18,
    name: "Shardeum Betanet",
    image: ShardeumLogo,
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "SHM",
    usdPrice: null,
    type: "EVM",
  },
  {
    address: null,
    blockchain: "ZETA_TESTNET_ATHENS",
    coinSource: null,
    coinSourceUrl: null,
    decimals: 9,
    name: "Zeta Testnet",
    image: ZetaLogo,
    isPopular: true,
    isSecondaryCoin: false,
    symbol: "ZETA",
    usdPrice: null,
    type: "EVM",
  },
];
