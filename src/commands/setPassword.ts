import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";

import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const SetPassword: ICommand = {
  data: new SlashCommandBuilder()
    .setName("change-password")
    .setDescription("change account password")
    .addStringOption((options) =>
      options
        .setName("current-password")
        .setDescription("current password for this wallet")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("new-password")
        .setDescription("new password")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ephemeral: true});
    try {
      const current_password = interaction.options.getString(
        "current-password",
        true
      );
      const new_password = interaction.options.getString("new-password", true);
      const wallet_address = await user_wallet.fromIdGetAddress(interaction.user.id);
      if (!wallet_address) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        }).setFooter({text: "Powered by Afro Apes"});
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      if (new_password.length < 5) {
        const err_passwords = new MessageEmbed().setColor("RED").addFields({
          name: "❌ Passwords should be at least 6 characters length",
          value: `\u200b`,
        }).setFooter({text: "Powered by Afro Apes"});
        await interaction.editReply({ embeds: [err_passwords] });
        return;
      }
      const updatePass = await user_wallet.changePassword(
        interaction.user.id,
        current_password,
        new_password
      );
      if (updatePass === -1) {
        throw new Error("unexpected error");
      }
      if (updatePass === 0) {
        let embedResponse = new MessageEmbed().setColor("RED").addFields({
          name: "incorrect password",
          value: `use ${inlineCode(
            "/reset-password"
          )} to reset your password with private key `,
        });
        await interaction.editReply({ embeds: [embedResponse] });
        return;
      }
      const embed = new MessageEmbed()
        .setColor("BLUE")
        .setTitle(`Password changed successfully`)
        .setThumbnail(
          interaction.user.avatarURL({ dynamic: true }) ||
            interaction.user.defaultAvatarURL
        )
        .setAuthor({
          name: "Web3Bot",
          iconURL: process.env.ICON_URL,
          url: process.env.WEBSITE,
        })
        .setFooter({ text: "Powered by Afro Apes" });
      await interaction.editReply({ embeds: [embed] });
      return;
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
