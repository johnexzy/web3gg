import { Sequelize } from "sequelize";
import { WalletModel, walletCreation } from "../models/Wallet";
import { TokenModel, tokenCreation } from "../models/Token";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});
WalletModel.init(walletCreation, { tableName: "Wallets", sequelize });
TokenModel.init(tokenCreation, { tableName: "Tokens", sequelize });
export default sequelize;
