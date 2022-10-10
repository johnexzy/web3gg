import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { utils } from "ethers";
import {
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  GuildMemberRoleManager, Role
} from "discord.js";
import WalletBuilder from "../common/wallet";
import UserWallet from "../controllers/Wallets";
import Cowry from "../common/token";
import EtherUtils from "../utils/etherUtils";
const user_wallet = new UserWallet();

export const MigrateToken: ICommand = {
  data: new SlashCommandBuilder()
    .setName("migrate")
    .setDescription(`Migrate ${inlineCode("COWRY")} onchain. (10% fee applies)`)

    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription("The amount of cowries to send, 10% fee applies")
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("to")
        .setDescription("Migrate Cowries to this user")
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

      if (
        !(interaction.member!.roles as GuildMemberRoleManager).cache.has(
          process.env.ADMIN_ROLE as string
        )
      ) {
        await interaction.editReply({
          content: `You are not authorized to use this command`,
        });
        return;
      }
      const admin_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
      const password = interaction.options.getString("password") as string;
      const to = interaction.options.getUser("to", true);
      const amount = interaction.options.getNumber("amount", true) * 0.9;
      const recepient_key = await user_wallet.fromIdGetKey(to.id);
      if (admin_pkey) {
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
        if (recepient_key) {
          const recipient_address = new WalletBuilder().getAddressFromKey(
            recepient_key
          );
          const Cw = await new Cowry("goerli");
          const decimals = parseInt(await Cw.getTokenDecimal());
          const amountInBigNumber = amount * Math.pow(10, decimals);
          console.log(amountInBigNumber)
          const tokenBalance =
            parseInt((await Cw.getTokenBalance()) as string) /
            Math.pow(10, decimals);
          console.log(tokenBalance) // 10,000,000
          // check for gas fee
          const gasPrice = await Cw.estimateGasPriceTransfer();
          const etherUtils = new EtherUtils(
            new WalletBuilder().masterWallet(),
            "goerli"
          );
          const coinBalance = await etherUtils.balance();

          if (!utils.parseEther(coinBalance).gt(gasPrice)) {
            const embed = new MessageEmbed()
              .setColor("RED")
              .addFields({
                name: "Insufficient Fund to pay gas",
                value: `Minimum of ${gasPrice.toString()} is required`,
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
                value: `amount to send exceeds balance in master wallet`,
              })
              .setTimestamp();
            await interaction.editReply({ embeds: [embed] });
            return;
          }
          const tx = await Cw.transfer(recipient_address, amountInBigNumber.toString());
          console.log(tx)
          if (tx == false) {
            const embed = new MessageEmbed().setColor("RED").addFields({
              name: "Unexpected Error Occurred",
              value: `Please contact AfroLab's developers`,
            });
            await interaction.editReply({ embeds: [embed] });
            return;
          }
          const row = new MessageActionRow().addComponents(
            new MessageButton()
              .setURL(`https://rinkeby.etherscan.io/tx/${tx.hash}`)
              .setLabel("View transaction on etherscan")
              .setStyle("LINK")
          );

          const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(
              `☑️Migration Successfull`
            )
            .setDescription(
              `Migrated ${amount} ${inlineCode("COWRY")} to ${to.tag}. 10% of ${amount / 0.9} was deducted as a migration fee`
            )
            .setFooter({ text: "Powered by AfroLabs" });
          // await wait(4000);
          await interaction.editReply({
            content: "Migration Successfull Successfull",
          });
          await interaction.channel?.send({
            embeds: [embed],
            components: [row],
          });
        } else {
          await interaction.editReply({
            content: `${to.toString()} use ${inlineCode(
              "/create-wallet"
            )} to create or import a wallet `,
          });
        }
      } else {
        await interaction.editReply({ 
          content: `${interaction.user.toString()} use ${inlineCode(
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
