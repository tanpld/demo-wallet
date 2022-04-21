import { useContext } from "react";
import { EthereumContext } from "./EthereumProvider";

const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (!context) {
    throw new Error("Must use inside EthereumContext");
  }
  return context;
};

export default useEthereum;
