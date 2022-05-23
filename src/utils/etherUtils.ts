import { utils, Wallet } from "ethers";
import Provider from "../providers/provider";
import { IEtherUtils } from "../types/types";
export default class EtherUtils extends Provider implements IEtherUtils {
  wallet: Wallet;
  constructor(wallet: Wallet, network: string) {
    super(network);
    this.wallet = wallet;
  }
  async send(to: string, amount: string) {
    if (!utils.isAddress(to)) {
      return false;
    }

    // Create a transaction object
    let tx: utils.Deferrable<any> = {
      to: to,
      // Convert currency unit from ether to wei
      value: utils.parseEther(amount),
    };
    // Send a transaction
    const signer = await this.wallet.connect(this.getProvider());
    return await signer.sendTransaction(tx);
  }
  async balance() {
    const signer = await this.wallet.connect(this.getProvider());
    const bal = await signer.getBalance();
    return utils.formatEther(bal);
  }
  async estimateGasPriceTransfer() {
    const fee = await this.provider.getFeeData();
    return fee.maxFeePerGas!.mul(22000);
  }
}
