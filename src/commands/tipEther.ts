import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed, MessageActionRow, MessageButton } from "discord.js";
import WalletBuilder from "../common/wallet";
import { utils } from "ethers";
import TokenController from "../controllers/Tokens";
import NetworkUtils from "../utils/networkUtils";
import etherUtils from "../utils/etherUtils";
import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const TipEther: ICommand = {
  data: new SlashCommandBuilder()
    .setName("tip")
    .setDescription("Tip ETH, BNB or MATIC to a discord user")

    .addUserOption((option) =>
      option
        .setName("to")
        .setDescription("Tip ethers to this user")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to send")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Select Blockchain network")
        .setRequired(false)
        .addChoice("Ethereum", "mainnet")
        .addChoice("Binance Smart Chain", "bsc")
        .addChoice("Polygon", "polygon")
        .addChoice("Rinkeby Testnet", "rinkeby")
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: false });
    try {
      const user_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
      const network = interaction.options.getString("network") || "mainnet";
      const to = interaction.options.getUser("to", true);
      const w_recipient_key = await user_wallet.fromIdGetKey(to.id);
      const amount = interaction.options.getNumber("amount", true);
      if (!user_pkey) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      if (!w_recipient_key) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `${to.toString()}, to recieve tips, use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      const w_sender = new WalletBuilder().importFromPrivateKey(user_pkey);
      const addr_recipient = new WalletBuilder().importFromPrivateKey(
        w_recipient_key
      ).address;
      const walletUtils = new etherUtils(w_sender, network);
      const bal = await walletUtils.balance();
      const gas = await walletUtils.estimateGasPriceTransfer();
      const networkObj = NetworkUtils.getNetwork(network)!;
      if (
        !utils.parseEther(bal).gt(utils.parseEther(amount.toString()).add(gas))
      ) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "Insufficient Funds",
          value: `amount to send exceeds balance`,
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const tx = await walletUtils.send(addr_recipient, amount.toString());
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
          .setURL(`${networkObj.explorer}/tx/${tx.hash}`)
          .setLabel("View transaction on explorer")
          .setStyle("LINK")
      );

      const embed = new MessageEmbed()
        .setAuthor({
          name: "web3bot",
          iconURL: "https://i.imgur.com/jP0MDWk.png",
          url: "https://web3bot.gg",
        })
        .setColor("GREEN")
        .setThumbnail(
          interaction.user.avatarURL({ dynamic: true }) ||
            interaction.user.defaultAvatarURL
        )
        .addFields({
          name: "Success🎉🎉",
          value: `${interaction.user.toString()} tipped ${bold(
            amount.toString()
          )}${bold(networkObj.currency)} (${network}) to ${to}`,
        })
        .addField(
          `\u200b`,
          `use ${inlineCode("/wallet " + network)} to view balance`
        )
        .setFooter({ text: "Powered by Afro Apes" })
        .setURL(networkObj.explorer + "/tx/" + tx.hash);
      await interaction.editReply({
        embeds: [embed],
        components: [row],
      });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
