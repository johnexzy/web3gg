import { SlashCommandBuilder, inlineCode, bold } from "@discordjs/builders";
import { ICommand } from "../types/types";
import { MessageEmbed } from "discord.js";
import WalletBuilder from "../common/wallet";
import TokenController from "../controllers/Tokens";
import NetworkUtils from "../utils/networkUtils";
import tokenUtils from "../utils/tokenUtils";
import UserWallet from "../controllers/Wallets";
const user_wallet = new UserWallet();

export const AddToken: ICommand = {
  data: new SlashCommandBuilder()
    .setName("import-token")
    .setDescription("Import ERC-20 Tokens with contract address")
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
        .setName("contract_address")
        .setDescription("Contract Address of ERC-20 token")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    try {
      const account = interaction.user;
      const network = interaction.options.getString("network", true);
      const contractAddress = interaction.options.getString(
        "contract_address",
        true
      );
      if (!tokenUtils.isValidAddress(contractAddress)) {
        const err = new MessageEmbed()
          .setColor("DARK_RED")
          .addField(
            "❌ Invalid Address",
            "the contract address specified is not valid"
          );
        await interaction.editReply({ embeds: [err] });
        return;
      }

      const w_user = await user_wallet.fromIdGetKey(account.id);
      const w = new WalletBuilder().importFromPrivateKey(w_user);
      const TokenUtils = new tokenUtils(w, network, contractAddress);
      const bytecode = await TokenUtils.getCode();
      const networkObj = NetworkUtils.getNetwork(network)!;
      if (bytecode === "0x") {
        const err = new MessageEmbed()
          .setColor("DARK_RED")
          .addField(
            "❌ Contract Address Not Found",
            `the contract address specified is not found on ${network} network`
          );
        await interaction.editReply({ embeds: [err] });
        return;
      }
      const name = await TokenUtils.getTokenName();
      const symbol = await TokenUtils.getTokenSymbol();
      const decimals = parseInt(await TokenUtils.getTokenDecimal());

      // get Total Supply of Tokens (type is BigNumber)
      const totalSupply =
        parseInt((await TokenUtils.getTotalSupply()).toString()) /
        10 ** decimals;
      // console.log(totalSupply.div())
      const chainId = NetworkUtils.getNetwork(network)!.chainId;
      const tc = new TokenController();
      const res = await tc.addTokens(
        account.id,
        name,
        symbol,
        contractAddress,
        decimals,
        network,
        chainId
      );
      if (res === 409) {
        const err = new MessageEmbed()
          .setColor("DARK_RED")
          .addField(
            "Token already exists",
            `use ${inlineCode("/wallet " + network)} to view token balances`
          );
        await interaction.editReply({ embeds: [err] });
        return;
      }
      const embed = new MessageEmbed()
        .setTitle(`Token Imported Succesfully`)
        .setColor("GREEN")
        .addField("Name", name, true)
        .addField("Symbol", symbol, true)
        .addField("Network", network)
        .addField("Total Supply", totalSupply.toString())
        .setAuthor({ name: 'Web3Bot', iconURL: process.env.ICON_URL, url: process.env.WEBSITE })
        .setThumbnail(account.avatarURL({dynamic: true}) || account.defaultAvatarURL)
        .setFooter({
          text: `use ${inlineCode(
            "/wallet " + networkObj.name
          )} to view token balances`,
        });

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: "There was an error while executing this command!",
      });
    }
  },
};
