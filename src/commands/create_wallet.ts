import {
  SlashCommandBuilder,
  inlineCode,
  bold,
  spoiler,
} from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import WalletBuilder from "../common/wallet";
import UserWallet from "../controllers/Wallets";
const user = new UserWallet();

export const CreateWallet: ICommand = {
  data: new SlashCommandBuilder()
    .setName("create-wallet")
    .setDescription("Create or import a Wallet")
    .addStringOption((option) =>
      option
        .setName("private-key")
        .setDescription("private for the wallet")
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const user_pkey = await user.fromIdGetKey(interaction.user.id);

      if (!user_pkey) {
        const _privateKey = interaction.options.getString("private-key");

        const w = _privateKey
          ? new WalletBuilder().importFromPrivateKey(_privateKey)
          : new WalletBuilder().initializeNewWallet();

        const embed = new MessageEmbed()
          .setColor("#FF0000")
          .setTitle(`Wallet Created Successfully`)
          .addFields(
            { name: "Private Key:", value: `${spoiler(w.privateKey)}` },
            { name: "Wallet Address", value: `${w.address}` }
          );

        await user.saveKeytoUser(interaction.user.id, w.privateKey, w.address);
        await interaction.editReply({ embeds: [embed] });
      } else {
        const walletFromKey = new WalletBuilder().importFromPrivateKey(
          user_pkey
        );

        const embed = new MessageEmbed().setColor("#0f1b67").addFields({
          name: `Hey ${interaction.user.username}, You already have a wallet`,
          value: `${interaction.user.toString()} ${walletFromKey.address}`,
        });
        await interaction.editReply({ embeds: [embed] });
      }
    } catch (error) {
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
