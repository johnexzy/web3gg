import { Snowflake } from "discord.js";
import sequelize from "../core/sequelize";
import { TokenModel } from "../models/Token";
import fetch from "node-fetch";
import NetworkUtils from "../utils/networkUtils";
import { TokenTx } from "../types/types";
// const wallet_model = require('../models/wallets')
export default class Tokens {
  tokens;
  constructor() {
    this.tokens = TokenModel;
  }

  /**
   * Save Tokens user pair
   * @param {Params} args - disc_id, name, symbol, contract_address, network, chain_id
   * @returns {void}
   */
  async addTokens(
    disc_id: Snowflake,
    name: string,
    symbol: string,
    contract_address: string,
    decimals: number,
    network: string,
    chain_id: number
  ): Promise<number> {
    try {
      // check if token is already added by user to network
      const ifExist = await this.findTokenbyContract(
        disc_id,
        contract_address,
        network
      );

      //if exist return 409
      if (ifExist !== null) {
        return 409;
      }

      console.log(
        "Saving Token ",
        name,
        symbol,
        contract_address,
        decimals,
        network,
        chain_id
      );
      // save the token
      await this.tokens.create({
        disc_id: disc_id,
        name: name,
        symbol: symbol,
        contract_address: contract_address,
        decimals: decimals,
        network: network,
        chain_id: chain_id,
      });
      return 201;
      // await this.keyv.set(user_id, Crypto.encode(pPhrase));
    } catch (error) {
      console.error("AddTokens: ", error);
      return 500;
    }
  }

  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user keyv
   */
  async getAllTokensByUser(disc_id: Snowflake): Promise<TokenModel[]> {
    try {
      const tokens = await this.tokens.findAll({ where: { disc_id: disc_id } });
      if (!tokens) {
        return [];
      }
      return tokens;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  /**
   * Get all token by user and network
   * @param {string} disc_id -user discord id
   * @returns {Array} Tokens
   */
  async getAllTokensByUserWithNetwork(disc_id: Snowflake, network: string) {
    try {
      const tokens = await this.tokens.findAll({
        where: { disc_id: disc_id, network: network },
      });
      if (!tokens) {
        return [];
      }
      return tokens;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  /**
   * Get all token by Transactoins and network
   * @param {string} address -user address
   * @param
   * @returns {Array} Tokens
   */
  async getAllTokensByTokenTransactions(wallet_addr: string, network: string) {
    try {
      const net = NetworkUtils.getNetwork(network)!;
      let apiKeys: string[];
      switch (network) {
        case "bsc":
          apiKeys = process.env.bsc_key!.split(",");
          break;
        case "rinkeby":
          apiKeys = process.env.rinkeby_key!.split(",");
          break;
        case "mainnet":
          apiKeys = process.env.mainnet_key!.split(",");
          break;
        case "polygon":
          apiKeys = process.env.polygon_key!.split(",");
          break;

        default:
          apiKeys = [];
          break;
      }

      console.log(apiKeys);
      const apiKey = apiKeys![Math.floor(Math.random() * apiKeys.length)];
      const tokensTnxResp = await fetch(
        `${net.api}&apikey=${apiKey}&address=${wallet_addr}`
      );
      const tokenstnx: TokenTx = await tokensTnxResp.json();
      console.log(tokenstnx);
      if (tokenstnx.status !== "1" || typeof tokenstnx.result !== "object") {
        return [];
      }
      const tokens =
        typeof tokenstnx.result === "object" && tokenstnx.result.length
          ? tokenstnx.result.map((t) => {
              const {
                tokenName,
                tokenSymbol,
                tokenDecimal,
                contractAddress,
              } = t;
              return {
                name: tokenName,
                symbol: tokenSymbol,
                decimals: tokenDecimal,
                contract_address: contractAddress,
                network: net.network,
                chain_id: net.chainId,
              };
            })
          : [];
      const unique = [...new Set(tokens)];
      return unique;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user keyv
   */
  async findTokenbyName(
    disc_id: Snowflake,
    name: string
  ): Promise<TokenModel | null> {
    try {
      const token = await this.tokens.findOne({
        where: { disc_id: disc_id, name: name },
      });
      if (!token) {
        return null;
      }
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user keyv
   */
  async findTokenbySymbol(
    disc_id: Snowflake,
    symbol: string
  ): Promise<TokenModel | null> {
    try {
      const token = await this.tokens.findOne({ where: { disc_id, symbol } });
      if (!token) {
        return null;
      }
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Get Key from User DIscord ID
   * @param {string} user_id user discord id
   * @returns {string} user keyv
   */
  async findTokenbyContract(
    disc_id: Snowflake,
    contract_address: string,
    network: string
  ): Promise<TokenModel | null> {
    try {
      const token = await this.tokens.findOne({
        where: {
          disc_id: disc_id,
          contract_address: contract_address,
          network: network,
        },
      });
      // if token is null return null
      if (!token) {
        return null;
      }
      return token;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
