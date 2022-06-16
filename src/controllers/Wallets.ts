import CryptoJS from "../utils/cryptoUtil";
import bycrypt from "bcryptjs";
import { WalletModel } from "../models/Wallet";
import { Snowflake } from "discord.js";

type NumberResponse = 1 | 0 | -1;
export default class UserWallet {
  wallets;
  constructor() {
    this.wallets = WalletModel;
  }

  /**
   * Save key user pair
   * @param {String} user_id user discord id
   * @param {string} pkey user key
   * @param {string} address user wallet address
   * @param {string} password user password
   * @returns {void}
   */
  async saveKeytoUser(
    user_id: Snowflake,
    pkey: string,
    address: string,
    password: string
  ) {
    try {
      // const phash =
      await this.wallets.create({
        disc_id: user_id,
        pkey: CryptoJS.encode(pkey),
        address: address,
        password: await bycrypt.hash(password, await bycrypt.genSalt()),
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
      //console.log(User?.pkey);
      if (!User) {
        return "";
      }
      return CryptoJS.decode(User?.pkey);
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
  async fromIdGetAddress(disc_id: Snowflake): Promise<string> {
    try {
      const User: WalletModel | null = await this.wallets.findOne({
        where: { disc_id },
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

  /**
   * Verify Passowrd
   * @param {string} disc_id user discord id
   * @param {string} password user password
   * @returns {Number} -1, 1 or 0
   * -1 : no password or unexpected error
   *  0 : incorrect password
   *  1 : successful
   */
  async passwordVerify(
    disc_id: Snowflake,
    password: string
  ): Promise<NumberResponse> {
    try {
      const User: WalletModel | null = await this.wallets.findOne({
        where: { disc_id },
      });
      if (User?.password === null || User?.password === '') {
        return -1;
      }
      return bycrypt.compareSync(password, User?.password!) ? 1 : 0;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  /**
   * change Passowrd
   * @param {string} disc_id user discord id
   * @param {string} password user password
   * @returns {Number} -1, 1 or 0
   * -1 : no password or unexpected error
   *  0 : incorrect password
   *  1 : successful
   */
  async changePassword(
    disc_id: Snowflake,
    current_password: string,
    new_password: string
  ): Promise<NumberResponse> {
    try {
      const isVerified = await this.passwordVerify(disc_id, current_password);
      if (isVerified === 0) {
        return isVerified;
      }
      if (isVerified === -1) {
        if (current_password !== process.env.PASSWORD_DEFAULT) {
          return isVerified;
        }
      }

      const updatePass = await this.updatePass(disc_id, new_password);
      if (updatePass) {
        return 1;
      }
      return updatePass ? 1 : 0;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  /**
   * Update Passowrd
   * @param {string} disc_id user discord id
   * @param {string} password user password
   * @returns {Boolean} 
   */
  async updatePass(disc_id: Snowflake, password: string): Promise<boolean> {
    const res = await this.wallets.update(
      {
        password: bycrypt.hashSync(password, bycrypt.genSaltSync()),
      },
      {
        where: { disc_id },
      }
    );
    return res.length > 0;
  }
}
