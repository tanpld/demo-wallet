import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";
import { abi } from "./abi";

interface TOKEN {
  name: string;
  address: string;
}

export const SUPPORTED_TOKENS: any = {
  CRO: {
    name: "CRO",
    address: "",
    decimals: 18,
  },
  USDC: {
    name: "USDC",
    address: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    decimals: 6,
  },
  CROISSANT: {
    name: "CROISSANT",
    address: "0xa0C3c184493f2Fae7d2f2Bd83F195a1c300FA353",
    decimals: 18,
  },
};

const EthereumContext = createContext<{
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
    console.log(token);
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

    setBalance(ethers.utils.formatUnits(value._hex, SUPPORTED_TOKENS[token]?.decimals));
  };

  useEffect(() => {
    const { ethereum } = window as any;
    if (!ethereum) {
      setEthereumEnabled(false);
    }
    setEthereumEnabled(true);
  }, []);

  useEffect(() => {
    if (wallet) {
      getBalance(wallet, "CRO");
    }
  }, [wallet]);

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

const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error("Must use inside EthereumContext");
  }
  return context;
};

export { useEthereum };
export default EthereumProvider;
