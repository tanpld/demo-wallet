import "./App.css";
import { SUPPORTED_TOKENS, useEthereum } from "./EthereumProvider";

function App() {
  const { wallet, balance, connectWallet, getBalance } = useEthereum();
  return (
    <div className="App">
      {!wallet && <button onClick={connectWallet}>Connect wallet</button>}
      <select
        name="tokens"
        id="tokens"
        onChange={(e) => getBalance(wallet, e.target.value)}
      >
        {SUPPORTED_TOKENS?.map((token) => (
          <option key={token.name} value={token.address}>
            {token.name}
          </option>
        ))}
      </select>
      <h2>Address: {wallet}</h2>
      <h2>Balance: {balance}</h2>
    </div>
  );
}

export default App;
