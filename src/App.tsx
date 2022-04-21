import "./App.css";
import { useEthereum } from "./EthereumProvider";

function App() {
  const { wallet, balance, connectWallet } = useEthereum();
  return (
    <div className="App">
      {!wallet && <button onClick={connectWallet}>Connect wallet</button>}
      <h2>Address: {wallet}</h2>
      <h2>Balance: {balance}</h2>
    </div>
  );
}

export default App;
