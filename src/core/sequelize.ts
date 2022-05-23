import { Sequelize } from "sequelize";
import { WalletModel, walletCreation } from "../models/Wallet";
import { TokenModel, tokenCreation } from "../models/Token";
const sequelize: Sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../db/web3gg.sqlite",
});

WalletModel.init(walletCreation, { tableName: "Wallets", sequelize });
TokenModel.init(tokenCreation, { tableName: "Tokens", sequelize });
export default sequelize