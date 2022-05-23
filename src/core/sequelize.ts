import { Sequelize } from "sequelize";
import { WalletModel, walletCreation } from "../models/Wallet";
import { TokenModel, tokenCreation } from "../models/Token";
// const sequelize = new Sequelize('database', 'username', 'password', {
//   host: 'localhost',
//   dialect: /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
// });
const sequelize = new Sequelize("postgres://hyccnrkpeozskc:3c3f75a82f323208315e3c4bb7ba330a94f07faf8032d5afdb2178cbf99a5588@ec2-34-236-94-53.compute-1.amazonaws.com:5432/d8ja28r2gmut18", {ssl:true},) // Example for postgres

WalletModel.init(walletCreation, { tableName: "Wallets", sequelize });
TokenModel.init(tokenCreation, { tableName: "Tokens", sequelize });
export default sequelize;
// "postgres://hyccnrkpeozskc:3c3f75a82f323208315e3c4bb7ba330a94f07faf8032d5afdb2178cbf99a5588@ec2-34-236-94-53.compute-1.amazonaws.com:5432/d8ja28r2gmut18", {