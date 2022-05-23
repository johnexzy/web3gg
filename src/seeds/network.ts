import { NetworkType } from "../types/types";

export default [
  {
    network: "mainnet",
    name: "Ethereum",
    chainId: 1,
    currency: "ETH",
    rpc: [
      "https://eth-mainnet.alchemyapi.io/v2/7lR5N50UXB4y8URS4S9J3JPuxHWkW8uH",
      "https://eth-mainnet.blastapi.io/d3ed394a-bb83-4d1c-bb83-12ff8708c81a",
      "https://rpc.ankr.com/eth",
    ],
    explorer: "https://etherscan.io"
  },
  {
    network: "rinkeby",
    name: "Rinkeby Ethereum",
    chainId: 4,
    currency: "ETH",
    rpc: ["https://rpc.ankr.com/eth_rinkeby"],
    explorer: "https://rinkeby.etherscan.io"
  },
  {
    network: "polygon",
    name: "Polygon",
    chainId: 137,
    currency: "MATIC",
    rpc: [
      "https://polygon-mainnet.g.alchemy.com/v2/7lR5N50UXB4y8URS4S9J3JPuxHWkW8uH",
      "https://polygon-rpc.com",
      "https://rpc.ankr.com/polygon",
      "https://rpc-mainnet.maticvigil.com/v1/f27258bff83e00a5dde0695d9e5c54ccedc69e11",
    ],
    explorer: "https://polygonscan.com"
  },
  {
    network: "bsc",
    name: "Binance Smart Chain",
    chainId: 137,
    currency: "MATIC",
    rpc: [
      "https://rpc.ankr.com/bsc",
      "https://bsc-dataseed1.ninicoin.io/",
      "https://bsc-dataseed1.defibit.io/",
    ],
    explorer: "https://bscscan.com"
  },
] as NetworkType[];
