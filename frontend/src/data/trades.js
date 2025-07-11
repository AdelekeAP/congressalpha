import { politicians } from "./politicians";

export const trades = Object.entries(politicians).flatMap(([name, data]) =>
  data.recentTrades.map((trade) => ({
    politician: name,
    party: data.party,
    avatar: data.avatar,
    stock: trade.stock,
    company: trade.company,
    action: trade.action,
    amount: trade.amount,
    date: trade.date,
    price: trade.entryPrice,
    currentPrice: trade.currentPrice,
    return: trade.return,
  }))
);
