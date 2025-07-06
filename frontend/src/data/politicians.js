// src/data/politicians.js

export const politicians = {
  "Nancy Pelosi": {
    party: "D",
    state: "CA",
    bio: "Speaker of the House, active in tech stock trades.",
    trades: [
      {
        stock: "NVDA",
        action: "BUY",
        amount: "$1M-$5M",
        date: "2024-01-15",
        change: "+12.5%",
      },
    ],
  },
  "Dan Crenshaw": {
    party: "R",
    state: "TX",
    bio: "Representative from Texas, active in energy sector trades.",
    trades: [
      {
        stock: "TSLA",
        action: "SELL",
        amount: "$500K-$1M",
        date: "2024-01-14",
        change: "-3.2%",
      },
    ],
  },
};
