import { ICommand } from "../types/types";
// import { Ping } from "./ping";
import { Wallet } from "./wallet";
import { CreateWallet } from "./createWallet";
import { Commands } from "./commands";
import { Address } from "./address";
import { AddToken } from "./addToken";
import { SendEther } from "./sendEther";
import { TipEther } from "./tipEther";
// import { MigrateToken } from "./migrateToken";
import { TransferToken } from "./transferToken";
import { TipToken } from "./tipToken";
import { SetPassword } from "./setPassword";
import { ForgotPassword } from "./forgotPassword";
import { ExportKey } from "./exportKey";

export const CommandList: ICommand[] = [
  Commands,
  CreateWallet,
  Address,
  AddToken,
  Wallet,
  TipEther,
  TipToken,
  SendEther,
  TransferToken,
  SetPassword,
  ForgotPassword,
  ExportKey,
  // MigrateToken
];
