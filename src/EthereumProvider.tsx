import { createContext, ReactNode, useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abi";
import { SUPPORTED_TOKENS } from "./constants";

export const EthereumContext = createContext<{
  wallet: string;
  balance: any;
  isEthereumEnabled: boolean;
  isConnectingWallet: boolean;
  isGettingBalance: boolean;
  connectWallet: () => Promise<void>;
  getBalance: (wallet: string, token: string) => Promise<void>;
} | null>(null);

const EthereumProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [isConnectingWallet, setIsConnectingWallet] = useState(false);
  const [isGettingBalance, setIsGettingBalance] = useState(false);
  const [isEthereumEnabled, setEthereumEnabled] = useState(false);

  const connectWallet = async () => {
    setIsConnectingWallet(true);
    const { ethereum } = window as any;
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(accounts[0]);
    } catch (error) {}
    setIsConnectingWallet(false);
  };

  const getBalance = async (wallet: string, token: string) => {
    if (!wallet) return;
    setIsGettingBalance(true);
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rpc.artemisone.org/cronos"
    );

    let tokenContract;
    let value;
    if (token === "CRO") {
      value = await provider.getBalance(wallet);
    } else {
      tokenContract = new ethers.Contract(
        SUPPORTED_TOKENS[token]?.address,
        abi,
        provider
      );
      value = await tokenContract.balanceOf(wallet);
    }

    setIsGettingBalance(false);
    setBalance(
      ethers.utils.formatUnits(value._hex, SUPPORTED_TOKENS[token]?.decimals)
    );
  };

  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) {
      setEthereumEnabled(false);
    }
    setEthereumEnabled(true);
  }, []);

  const value = {
    wallet,
    balance,
    isEthereumEnabled,
    isConnectingWallet,
    isGettingBalance,
    connectWallet,
    getBalance,
  };
  return (
    <EthereumContext.Provider value={value}>
      {children}
    </EthereumContext.Provider>
  );
};

export default EthereumProvider;
