import CryptoJS from "../utils/cryptoUtil";
import { Model, ModelStatic } from "sequelize";
import sequelize from "../core/sequelize";
import { WalletModel } from "../models/Wallet";
import { Snowflake } from "discord.js";
export default class UserWallet {
  wallets
  constructor() {
    this.wallets = WalletModel;
  }

  /**
   * Save key user pair
   * @param {String} user_id user discord id
   * @param {string} pkey user key
   * @param {string} address user wallet address
   * @returns {void}
   */
  async saveKeytoUser(user_id: Snowflake, pkey: string, address: string) {
    try {
      await this.wallets.create({
        disc_id: user_id,
        pkey: CryptoJS.encode(pkey),
        address: address,
      });
    } catch (error) {
      console.log(error);
      console.error("SaveKeytoUser: ", error);
    }
  }

  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user
   */
  async fromIdGetKey(disc_id: Snowflake): Promise<string> {
    try {

      const User = await this.wallets.findOne({
        where: { disc_id },
      });

      if (!User) {
        return "";
      }
      return CryptoJS.decode(User.pkey);
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user keyv
   */
  async fromIdGetAddress(user_id: Snowflake): Promise<string> {
    try {
      const User: WalletModel | null = await this.wallets.findOne({
        where: { disc_id: user_id },
      });
      if (!User) {
        return "";
      }
      return User.address;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
}
