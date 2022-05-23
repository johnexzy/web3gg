import CryptoJS from "crypto-js";
import { ICrypto } from "../types/types";
export default class Crypto extends ICrypto {
  /**
   * key encoder
   * @param {String} pkey - key
   * @returns encoded key
   */
  static encode(pkey: string) {
    return CryptoJS.AES.encrypt(
      pkey,
      process.env.crypto_salt as string
    ).toString();
  }

  /**
   * key decoder
   * @param {String} pkey - encoded key
   * @returns decoded key
   */
  static decode(pkey: string): string {
    return CryptoJS.AES.decrypt(
      pkey,
      process.env.crypto_salt as string
    ).toString(CryptoJS.enc.Utf8);
  }
}
