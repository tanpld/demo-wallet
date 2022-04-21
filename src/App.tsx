import { useEffect, useState } from "react";
import "./App.css";
import { SUPPORTED_TOKENS } from "./constants";
import useEthereum from "./useEthereum";

function App() {
  const { wallet, balance, connectWallet, getBalance } = useEthereum();
  const [currentToken, setCurrentToken] = useState("CRO");

  const handleSelectToken = (e: any) => {
    setCurrentToken(e.target.value);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getBalance(wallet, currentToken);
    }, 2000);
    return () => clearInterval(interval);
  }, [getBalance, currentToken, wallet]);

  return (
    <div className="App">
      {!wallet && <button onClick={connectWallet}>Connect wallet</button>}
      {wallet && (
        <select name="tokens" id="tokens" onChange={handleSelectToken}>
          {Object.keys(SUPPORTED_TOKENS)?.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      )}
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
