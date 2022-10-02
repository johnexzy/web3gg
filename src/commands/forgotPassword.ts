import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";

import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const ForgotPassword: ICommand = {
  data: new SlashCommandBuilder()
    .setName("reset-password")
    .setDescription("Reset password with private key")
    .addStringOption((options) =>
      options
        .setName("private-key")
        .setDescription("your private key")
        .setRequired(true)
    )
    .addStringOption((options) =>
      options
        .setName("new-password")
        .setDescription("new password")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true});

    try {
      const privateKey = interaction.options.getString("private-key", true);
      const password = interaction.options.getString("new-password", true);
      const user_pkey = await user_wallet.fromIdGetKey(interaction.user.id);
      if (!user_pkey) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "No wallet initialized",
          value: `use ${inlineCode(
            "/create-wallet"
          )} to create a new wallet or import existing wallet`,
        }).setFooter({text: "Powered by AfroLabs"});
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      if (user_pkey !== privateKey) {
        const embed = new MessageEmbed().setColor("RED").addFields({
          name: "private key is not correct",
          value: `\u200b`,
        });
        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const result = await user_wallet.updatePass(
        interaction.user.id,
        password
      );
      if (result) {
        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(`☑️ Password reset was successful`)
          .setThumbnail(
            interaction.user.avatarURL({ dynamic: true }) ||
              interaction.user.defaultAvatarURL
          )
          .setAuthor({
            name: "Web3Bot",
            iconURL: process.env.ICON_URL,
            url: process.env.WEBSITE,
          })
          .setFooter({ text: "Powered by AfroLabs" });
        await interaction.editReply({ embeds: [embed] });
        return;
      }
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
      // const embed = new MessageEmbed().addField('wallet', )
      // await wait(4000);
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
