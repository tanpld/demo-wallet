import { useEffect, useState } from "react";
import "./App.css";
import { SUPPORTED_TOKENS } from "./constants";
import useEthereum from "./useEthereum";

function App() {
  const {
    wallet,
    balance,
    isConnectingWallet,
    isGettingBalance,
    connectWallet,
    getBalance,
  } = useEthereum();
  const [currentToken, setCurrentToken] = useState("CRO");

  const handleSelectToken = (e: any) => {
    setCurrentToken(e.target.value);
    getBalance(wallet, e.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isGettingBalance) {
        getBalance(wallet, currentToken);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [wallet, isGettingBalance, currentToken]);

  return (
    <div className="App">
      {!wallet && !isConnectingWallet && (
        <button onClick={connectWallet}>Connect wallet</button>
      )}
      {wallet && !isConnectingWallet && (
        <select
          name="tokens"
          id="tokens"
          onChange={handleSelectToken}
          // disabled={isGettingBalance}
        >
          {Object.keys(SUPPORTED_TOKENS)?.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      )}
      {isConnectingWallet && <p>Connecting...</p>}
      {wallet && <h2>Address: {wallet}</h2>}

      {balance && (
        <h2>
          Balance: {balance} {currentToken}
        </h2>
      )}
    </div>
  );
}

export default App;
