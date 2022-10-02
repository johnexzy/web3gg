import { Wallet, providers, Contract, utils } from "ethers";
import abi from "../abi/erc20.json";
import Provider from "../providers/provider";
export default class ERC20Token extends Provider {
  wallet: Wallet;
  contract: Contract;
  constructor(contractAddress: string, network: string, wallet: Wallet) {
    super(network);
    this.wallet = wallet;
    this.contract = new Contract(
      contractAddress as string,
      abi,
      this.getProvider()
    );
  }
  async transfer(address: string, amount: string) {
    const tx = await this.contract.transfer(
      address,
      utils.parseEther(amount.toString())
    );
    await tx.wait();
    return tx;
  }
  async balance(amount: string){
    const bal = await this.contract.balanceOf(this.wallet.address)
    console.log(bal);
    return bal
  }
}
