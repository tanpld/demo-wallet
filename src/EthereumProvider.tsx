import { createContext, ReactNode, useEffect, useState } from "react";
import { ethers } from "ethers";
import { abi } from "./abi";
import { SUPPORTED_TOKENS } from "./constants";

export const EthereumContext = createContext<{
  wallet: string;
  balance: any;
  isEthereumEnabled: boolean;
  connectWallet: () => Promise<void>;
  getBalance: (wallet: string, token: string) => Promise<void>;
} | null>(null);

const EthereumProvider = ({ children }: { children: ReactNode }) => {
  const [wallet, setWallet] = useState("");
  const [balance, setBalance] = useState("");
  const [isEthereumEnabled, setEthereumEnabled] = useState(false);

  const connectWallet = async () => {
    const { ethereum } = window as any;
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setWallet(accounts[0]);
  };

  const getBalance = async (wallet: string, token: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://evm.cronos.org"
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
