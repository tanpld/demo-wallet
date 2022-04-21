import { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";

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

  const handleSelectToken = (e: SelectChangeEvent) => {
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
      <Card style={{ width: 1024 }}>
        {wallet && <CardHeader title={wallet} />}
        <Divider />
        <CardContent>
          {wallet && !balance && <CircularProgress size={32} />}

          {balance && (
            <Typography variant="h3">
              {isGettingBalance ? (
                <CircularProgress size={32} />
              ) : (
                <>
                  {balance} {currentToken}
                </>
              )}
            </Typography>
          )}
          {balance && (
            <Select
              value={currentToken}
              onChange={handleSelectToken}
              size="small"
              style={{ marginTop: 24 }}
            >
              {Object.keys(SUPPORTED_TOKENS)?.map((key) => (
                <MenuItem key={key} value={key}>
                  {key}
                </MenuItem>
              ))}
            </Select>
          )}

          {isConnectingWallet && <CircularProgress />}

          {!wallet && !isConnectingWallet && (
            <Button onClick={connectWallet}>Connect wallet</Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
