import { Injectable } from '@angular/core';
import Web3 from 'web3';
declare let window: any;
const address = '0x128b815ebb31Eb859867e6462d1a57eB6afa1BB2';
const abi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
    signature: 'constructor',
  },
  {
    inputs: [],
    name: 'getPlayers',
    outputs: [{ internalType: 'address[]', name: '', type: 'address[]' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x8b5b9ccc',
  },
  {
    inputs: [],
    name: 'manager',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0x481c6a75',
  },
  {
    inputs: [],
    name: 'newPlayer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true,
    signature: '0x75479c34',
  },
  {
    inputs: [],
    name: 'pickWinner',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
    signature: '0x5d495aea',
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'players',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
    constant: true,
    signature: '0xf71d96cb',
  },
];

@Injectable({
  providedIn: 'root',
})
export class LotteryService {
  web3: any;

  constructor() {}

  public loadMetamask = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You Should consider using MetaMask!');
    }
  };

  public getManager = async (): Promise<string | null> => {
    try {
      const contract = new window.web3.eth.Contract(abi, address);
      const manager = await contract.methods.manager().call();
      return manager;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public getPlayers = async (): Promise<string[] | null> => {
    try {
      const contract = new window.web3.eth.Contract(abi, address);
      const manager = await contract.methods.getPlayers().call();
      return manager;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public getBalance = async (): Promise<string | null> => {
    try {
      const contract = new window.web3.eth.Contract(abi, address);
      const balance = await window.web3.eth.getBalance(contract.options.address);
      return window.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  public newPlayer = async (etherAmount: string): Promise<boolean> => {
    try {
      const accounts = await window.web3.eth.getAccounts();
      const contract = new window.web3.eth.Contract(abi, address);
      await contract.methods.newPlayer().send({
        from: accounts[0],
        value: window.web3.utils.toWei(etherAmount, 'ether')
      });
      return true;
    } catch (error) {
      return false;
    }
  };

  public pickWinner = async (): Promise<boolean> => {
    try {
      const accounts = await window.web3.eth.getAccounts();
      const contract = new window.web3.eth.Contract(abi, address);
      await contract.methods.pickWinner().send({
        from: accounts[0]
      });
      return true;
    } catch (error) {
      return false;
    }
  };
}
