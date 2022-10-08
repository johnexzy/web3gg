import { Wallet, providers, Contract, utils } from "ethers";
import abi  from "../abi/erc20.json";
import TokenUtils from "../utils/tokenUtils";
export default class Cowry extends TokenUtils {
  wallet: Wallet;
  constructor(network: string) {
    super((new Wallet(process.env.PRIVATE_KEY as string)), network, process.env.COWRY_ADDRESS!);
    this.wallet = new Wallet(process.env.PRIVATE_KEY as string);
  }
  
  async interact(address: string, amount: string) {
    const connectedContract = new Contract(
      process.env.CONTRACT_ADDRESS as string,
      abi,
      await this.initializeSinger()
    );
    const tx = await connectedContract.transfer(
      address,
      utils.parseEther(amount.toString())
    );
    await tx.wait();
    return tx;
  }
}
