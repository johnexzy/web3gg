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
import TokenController from "../controllers/Tokens";
import NetworkUtils from "../utils/networkUtils";
import tokenUtils from "../utils/tokenUtils";
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

        // Add Tether to wallet
        const Tether = process.env.TETHER!;
        const network = "mainnet";
        const TokenUtils = new tokenUtils(w, "mainnet", Tether);

        const name = await TokenUtils.getTokenName();
        const symbol = await TokenUtils.getTokenSymbol();
        const decimals = parseInt(await TokenUtils.getTokenDecimal());

        // console.log(totalSupply.div())
        const chainId = NetworkUtils.getNetwork(network)!.chainId;
        const tc = new TokenController();
        await tc.addTokens(
          interaction.user.id,
          name,
          symbol,
          Tether,
          decimals,
          network,
          chainId
        );

        const embed = new MessageEmbed()
          .setColor("#FF0000")
          .setTitle(`Wallet Created Successfully`)
          .setDescription(
            `Never disclose this key. Anyone with your private keys can steal any assets held in your account. (${inlineCode(
              "only you can see this"
            )})`
          )
          .setThumbnail(
            interaction.user.avatarURL({ dynamic: true }) ||
              interaction.user.defaultAvatarURL
          )
          .setAuthor({
            name: "web3bot",
            iconURL: "https://i.imgur.com/jP0MDWk.png",
            url: "https://web3bot.gg",
          })
          .addFields(
            { name: "Private Key:", value: `${spoiler(w.privateKey)}` },
            { name: "Wallet Address", value: `${w.address}` }
          )
          .setFooter({ text: "Powered by Afro Apes" });

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
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
