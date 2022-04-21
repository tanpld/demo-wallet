import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ethers } from "ethers";

const EthereumContext = createContext<{
  wallet: string;
  balance: any;
  isEthereumEnabled: boolean;
  connectWallet: () => Promise<void>;
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

  const getBalance = async (wallet: string) => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://cronosrpc-2.xstaking.sg",
      {
        chainId: 25,
        name: "Cronos",
        ensAddress: "0xA0b73E1Ff0B80914AB6fe0444E65848C4C34450b",
      }
    );
    const value = await provider.getBalance(wallet, "latest");
    setBalance(ethers.utils.formatEther(value._hex));
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
      getBalance(wallet);
    }
  }, [wallet]);

  const value = {
    wallet,
    balance,
    isEthereumEnabled,
    connectWallet,
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
