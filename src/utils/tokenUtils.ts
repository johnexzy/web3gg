import { BigNumber, Contract, utils, Wallet } from "ethers";
import { TransactionResponse } from "@ethersproject/abstract-provider";
import abi from "../abi/erc20.json";
import Provider from "../providers/provider";
export default class TokenUtils extends Provider {
  wallet: Wallet;
  contractAddress: string;
  constructor(wallet: Wallet, network: string, contract_address: string) {
    super(network);
    this.wallet = wallet;
    console.log(wallet.address);
    this.contractAddress = contract_address;
  }
  async initializeSinger(): Promise<Wallet> {
    return await this.wallet.connect(this.provider);
  }
  async connectedContract(): Promise<Contract> {
    console.log(this.contractAddress);
    const contract = new Contract(
      this.contractAddress,
      abi,
      await this.initializeSinger()
    );
    return contract;
  }
  static isValidAddress(address: string): boolean {
    return utils.isAddress(address);
  }
  async getCode(): Promise<string> {
    const bytecode = await this.provider.getCode(this.contractAddress);
    return bytecode;
  }
  async getTokenName(): Promise<string> {
    const cc = await this.connectedContract();
    // console.log(cc)
    const name = cc.name();
    return name;
  }
  async getTokenSymbol(): Promise<string> {
    return (await this.connectedContract()).symbol();
  }
  async getTokenDecimal(): Promise<string> {
    return (await this.connectedContract()).decimals();
  }
  async getTokenBalance(): Promise<BigNumber> {
    return (await this.connectedContract()).balanceOf(this.wallet.address);
  }
  async getTotalSupply(): Promise<BigNumber> {
    return (await this.connectedContract()).totalSupply();
  }
  async transfer(
    address: string,
    amount: string
  ): Promise<TransactionResponse> {
    const tx: TransactionResponse = (await this.connectedContract()).transfer(
      address,
      utils.parseEther(amount.toString())
    );
    await tx.wait();
    console.log(tx.hash);
    return tx;
  }
}
