import { Sequelize } from "sequelize";
import { WalletModel, walletCreation } from "../models/Wallet";
import { TokenModel, tokenCreation } from "../models/Token";
const sequelize = new Sequelize(process.env.PG_DB!,  process.env.PG_USER!, process.env.PG_PASS!,{
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT!),
  dialect: "postgres",
  dialectOptions: {
      ssl: {
          require: true,
          rejectUnauthorized: false
      }
   },
});
WalletModel.init(walletCreation, { tableName: "Wallets", sequelize });
TokenModel.init(tokenCreation, { tableName: "Tokens", sequelize });
export default sequelize;
