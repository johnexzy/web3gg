import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import WalletBuilder from "../common/wallet";
import {utils} from "ethers"
import TokenController from "../controllers/Tokens";
import NetworkUtils from "../utils/networkUtils";
import etherUtils from "../utils/etherUtils";
import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const SendEther: ICommand = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send Ether to Address")
    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Select Blockchain network")
        .setRequired(true)
        .addChoice("Mainnet", "mainnet")
        .addChoice("Rinkeby Testnet", "rinkeby")
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("Account to send to")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to send")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    try {
      const user_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
      const network = interaction.options.getString("network", true);
      const to = interaction.options.getString("to", true);
      const amount = interaction.options.getNumber("amount", true);
      if (user_pkey) {
        const w = new WalletBuilder().importFromPhrase(user_pkey);
        const walletUtils = new etherUtils(w, network);
        const bal = await walletUtils.balance();
        const gas = await walletUtils.estimateGasPriceTransfer();
        console.log(gas);
        if (
          !utils
            .parseEther(bal)
            .gt(utils.parseEther(amount.toString()).add(gas))
        ) {
          const embed = new MessageEmbed().setColor("RED").addFields({
            name: "Insufficient Funds",
            value: `amount to send exceeds balance`,
          });
          await interaction.editReply({ embeds: [embed] });
          return;
        }
        const tx = await walletUtils.send(to, amount.toString());
        if (!tx) {
          const embed = new MessageEmbed().setColor("RED").addFields({
            name: "Incorrect Address",
            value: `Please verify address`,
          });
          await interaction.editReply({ embeds: [embed] });
          return;
        }
        const row = new MessageActionRow().addComponents(
          new MessageButton()
            .setURL(`${process.env[network]}/tx/${tx.hash}`)
            .setLabel("View transaction on explorer")
            .setStyle("LINK")
        );

        const embed = new MessageEmbed().setColor("GREEN").addFields({
          name: "Success",
          value: `You sent ${amount}ETH (${network}) to ${to}`,
        });
        await interaction.editReply({
          embeds: [embed],
          components: [row]
        });
      } else {
        // const string = quote()
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.editReply({
        content: "There was an error while executing this command!"
      });
    }
  },
};
