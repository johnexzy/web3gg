import { ICommand } from "../types/types";
// import { Ping } from "./ping";
import { Wallet } from "./wallet";
import { CreateWallet } from "./create_wallet";
import { Commands } from "./commands";
import { Address } from "./address";
import {AddToken} from "./addToken";
import { SendEther } from "./sendEther";
import { TipEther } from "./tipEther";
import { MigrateToken } from "./migrateToken";

export const CommandList: ICommand[] = [
  Commands,
  CreateWallet,
  Address,
  AddToken,
  Wallet,
  TipEther,
  SendEther,
  MigrateToken
];
