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

export const SendEther: ICommand = {
  data: new SlashCommandBuilder()
    .setName("send")
    .setDescription("Send ETH, BNB or MATIC to Address")

    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Select Blockchain network")
        .setRequired(true)
        .addChoice("Ethereum", "mainnet")
        .addChoice("Binance Smart Chain", "bsc")
        .addChoice("Polygon", "polygon")
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
    )
    .addStringOption((option) =>
      option
        .setName("password")
        .setDescription("input your password to proceed")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const user_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
      const network = interaction.options.getString("network", true);
      const to = interaction.options.getString("to", true);
      const amount = interaction.options.getNumber("amount", true);
      const password = interaction.options.getString("password", true);
      if (user_pkey) {
        const w = new WalletBuilder().importFromPrivateKey(user_pkey);
        const walletUtils = new etherUtils(w, network);
        const bal = await walletUtils.balance();
        const gas = await walletUtils.estimateGasPriceTransfer();
        const networkObj = NetworkUtils.getNetwork(network)!;
        if (
          !utils
            .parseEther(bal)
            .gt(utils.parseEther(amount.toString()).add(gas))
        ) {
          const embed = new MessageEmbed()
            .setColor("RED")
            .addFields({
              name: "Insufficient Funds",
              value: `amount to send exceeds balance`,
            })
            .setTimestamp();
          await interaction.editReply({ embeds: [embed] });
          return;
        }
        const verifyPassword = await user_wallet.passwordVerify(
          interaction.user.id,
          password
        );
        if (verifyPassword === -1) {
          let embedResponse = new MessageEmbed()
            .setColor("RED")
            .addFields({
              name: "no password set for this wallet, please set a password",
              value: `use ${inlineCode("/change-password")}`,
            })
            .setTimestamp();
          await interaction.editReply({ embeds: [embedResponse] });
          return;
        }
        if (verifyPassword === 0) {
          let embedResponse = new MessageEmbed().setColor("RED").addFields({
            name: "incorrect password",
            value: `use ${inlineCode(
              "/reset-password"
            )} to recover your password with private key `,
          });
          await interaction.editReply({ embeds: [embedResponse] });
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
            .setURL(`${networkObj.explorer}/tx/${tx.hash}`)
            .setLabel("View transaction on explorer")
            .setStyle("LINK")
        );

        const embed = new MessageEmbed()
          .setColor("GREEN")
          .setAuthor({
            name: "Web3Bot",
            iconURL: "https://i.imgur.com/jP0MDWk.png",
            url: "https://web3bot.gg",
          })
          .setThumbnail(
            interaction.user.avatarURL({ dynamic: true }) ||
              interaction.user.defaultAvatarURL
          )
          .addFields({
            name: "Transaction Successfull🎉🎉",
            value: `${interaction.user.toString()} transferred ${bold(
              amount.toString() + networkObj.currency
            )} (${network}) to ${to}`,
          })
          .setTimestamp()
          .setFooter({ text: "Powered by Afro Apes" });
        await interaction.deleteReply();
        await interaction.channel?.send({
          embeds: [embed],
          components: [row],
        });
        return;
      } else {
        // const string = quote()
        const embed = new MessageEmbed()
          .setColor("RED")
          .addFields({
            name: "No wallet initialized",
            value: `use ${inlineCode(
              "/create-wallet"
            )} to create a new wallet or import existing wallet`,
          })
          .setTimestamp()
          .setFooter({ text: "Powered by Afro Apes" });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
