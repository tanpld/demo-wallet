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
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "@mui/material/Skeleton";

import "./App.css";
import { SUPPORTED_TOKENS } from "./constants";
import useEthereum from "./useEthereum";
import { CardActions } from "@mui/material";

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
      <Card sx={{ width: "70vw" }}>
        {isConnectingWallet && <CircularProgress size={24} />}
        {wallet && (
          <>
            <CardHeader title={wallet} />
            <Divider sx={{ opacity: wallet ? 1 : 0 }} />
            <LinearProgress sx={{ opacity: isGettingBalance ? 1 : 0 }} />
            <CardContent>
              {wallet && !balance && (
                <>
                  <Skeleton
                    variant="rectangular"
                    width={210}
                    height={56.02}
                    sx={{ margin: "0 auto" }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={40}
                    sx={{ margin: "0 auto", marginTop: "24px" }}
                  />
                </>
              )}

              {balance && (
                <Typography variant="h3">
                  {balance} {currentToken}
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
            </CardContent>
          </>
        )}

        <CardActions>
          {!wallet && !isConnectingWallet && (
            <Button onClick={connectWallet} sx={{ margin: "0 auto" }}>
              Connect wallet
            </Button>
          )}
        </CardActions>
      </Card>
    </div>
  );
}

export default App;
