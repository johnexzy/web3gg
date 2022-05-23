import {
  SlashCommandBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

import { BigNumber, Wallet } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";

export interface ICommand {
  data:
    | Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
    | SlashCommandSubcommandsOnlyBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}

export type NetworkType = {
  network: string;
  name: string;
  chainId: number;
  currency: string;
  rpc: string[];
  explorer: string;
};

export interface IEtherUtils {
  wallet: Wallet;
  send: (to: string, amount: string) => Promise<boolean | TransactionResponse>;
  balance: () => Promise<string>;
  estimateGasPriceTransfer: () => Promise<BigNumber>;
}
export abstract class ICrypto {
  static encode: (pkey: string) => string;
  static decode: (pkey: string) => string;
}
export abstract class NetworkUtilsType {
  static getRpcUrl: (network: string) => string;
  static getNetwork: (network: string) => NetworkType | undefined;
}
