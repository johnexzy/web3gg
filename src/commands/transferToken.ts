import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { utils } from "ethers";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  GuildMemberRoleManager,
} from "discord.js";
import WalletBuilder from "../common/wallet";
import UserWallet from "../controllers/Wallets";
import NetworkUtils from "../utils/networkUtils";
import tokenUtils from "../utils/tokenUtils";
import EtherUtils from "../utils/etherUtils";
const user_wallet = new UserWallet();

export const TransferToken: ICommand = {
  data: new SlashCommandBuilder()
    .setName("transfer")
    .setDescription(`Transfer ${inlineCode("ERC20")} token to address.`)
    .addStringOption((option) =>
      option
        .setName("network")
        .setDescription("Select Blockchain network")
        .setRequired(true)
        .addChoice("Ethereum", "mainnet")
        .addChoice("Binance Smart Chain", "bsc")
        .addChoice("Polygon", "polygon")
        .addChoice("Goerli Testnet", "goerli")
    )
    .addStringOption((option) =>
      option
        .setName("token_address")
        .setDescription("Contract address of erc20 token")
        .setRequired(true)
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
    const user_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
    const network = interaction.options.getString("network", true);
    const to = interaction.options.getString("to", true);
    const token_address = interaction.options.getString("token_address", true);
    const amount = interaction.options.getNumber("amount", true);
    const password = interaction.options.getString("password", true);
    try {
      if (user_pkey) {
        const wallet = new WalletBuilder().importFromPrivateKey(user_pkey);
        const TokenUtils = new tokenUtils(wallet, network, token_address);
        const networkObj = NetworkUtils.getNetwork(network)!;
        const name = await TokenUtils.getTokenName();
        const symbol = await TokenUtils.getTokenSymbol();
        const decimals = parseInt(await TokenUtils.getTokenDecimal());

        // check balance

        const tokenBalance =
          parseInt((await TokenUtils.getTokenBalance()).toString()) /
          Math.pow(10, decimals);

        // amount in BigNumber
        const amountInBigNumber = amount * Math.pow(10, decimals);

        // check for gas fee
        const gasPrice = await TokenUtils.estimateGasPriceTransfer();
        const etherUtils = new EtherUtils(wallet, network);

        const coinBalance = await etherUtils.balance();

        if (!utils.parseEther(coinBalance).gt(gasPrice)) {
          const embed = new MessageEmbed()
            .setColor("RED")
            .addFields({
              name: "Insufficient Fund to pay gas",
              value: `amount to send exceeds balance`,
            })
            .setTimestamp();
          await interaction.editReply({ embeds: [embed] });
          return;
        }

        if (!(tokenBalance >= amount)) {
            const embed = new MessageEmbed()
              .setColor("RED")
              .addFields({
                name: "Insufficient Amount to transfer",
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
        const tx = await TokenUtils.transfer(to, amountInBigNumber.toString())
        if (tx == false) {
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
            iconURL: process.env.ICON_URL,
            url: process.env.WEBSITE,
          })
          .setThumbnail(
            interaction.user.avatarURL({ dynamic: true }) ||
              interaction.user.defaultAvatarURL
          )
          .addFields({
            name: "Transaction Successfull🎉🎉",
            value: `${interaction.user.toString()} transferred ${bold(
              amount.toString() + symbol
            )} (${network}) to ${to}`,
          })
          .setTimestamp()
          .setFooter({ text: "Powered by AfroLabs" });
        await interaction.editReply({
          content: "Transaction Successfull",
        });
        await interaction.channel?.send({
          embeds: [embed],
          components: [row],
        });
        return;
      } else {
        await interaction.editReply({
          content: `${to.toString()} use ${inlineCode(
            "/create-wallet"
          )} to create or import a wallet `,
        });
      }
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
