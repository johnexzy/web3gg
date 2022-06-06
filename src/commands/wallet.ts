import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import etherUtils from "../utils/etherUtils.js";
import tokenUtils from "../utils/tokenUtils.js";
import NetworkUtils from "../utils/networkUtils.js";
import WalletBuilder from "../common/wallet";
import TokenController from "../controllers/Tokens";
import UserWallet from "../controllers/Wallets";
const user = new UserWallet();

export const Wallet: ICommand = {
  data: new SlashCommandBuilder()
    .setName("wallet")
    .setDescription("Replies with wallet balance")
    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Select Blockchain network")
        .setRequired(true)
        .addChoice("Ethereum", "mainnet")
        .addChoice("Binance Smart Chain", "bsc")
        .addChoice("Polygon", "polygon")
        .addChoice("Rinkeby", "rinkeby")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    try {
      const account = interaction.user;
      const network = interaction.options.getString("network", true);
      const user_pkey = await user.fromIdGetKey(account.id);
      if (!user_pkey) {
        // const string = quote()
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `${account.toString()}, use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      const w = new WalletBuilder().importFromPrivateKey(user_pkey);
      const walletUtils = new etherUtils(w, network);
      const bal = (await walletUtils.balance()).slice(0, 6);
      const networkObj = NetworkUtils.getNetwork(network)!;
      const embed = new MessageEmbed()
        .setTitle(`Wallet Balance for ${networkObj.name}`)
        .setColor("GREEN")
        .addFields(
          {
            name: "Balance",
            value: `${account.toString()} You have ${bold(bal)}${
              networkObj.currency
            } (${network})`,
          },
          {
            name: "\u200b",
            value: bold(networkObj.name + " Token Balances"),
          }
        );
      const tc = new TokenController();
      const tokens = await tc.getAllTokensByUserWithNetwork(
        interaction.user.id,
        network
      );
      const t = await tc.getAllTokensByTokenTransactions(w.address, network);
      const allTokens = [...tokens, ...t]
      if (tokens.length === 0) {

        embed.addField(
          "\u200b",
          `No Token Imported, use ${inlineCode("/import-token")} command`
        );
      }

    //   const tokentx = await fetch(
    //     url, //'https://httpbin.org/get',
    //     {
    //         method: "GET",
    //         timeout: 10000,
    //         headers: {
    //             Range: `bytes=${offset}-${offsetEnd}`
    //         },
    //     }
    // );
      const tokenContract: string[] = []
      for (const t of allTokens) {
        if (tokenContract.includes(t.contract_address)) {
          continue
        }
        tokenContract.push(t.contract_address)
        const tokenBalance = await new tokenUtils(
          w, // wallet
          network, //network
          t.contract_address //contract_address
        ).getTokenBalance();

        const div = 10 ** t.decimals;
        const tokenBalanceTonumber: number =
          parseInt(tokenBalance.toString()) / div;
        embed.addField(
          bold(t.name),
          `${tokenBalanceTonumber} ${t.symbol}`,
          true
        );
      }
      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
