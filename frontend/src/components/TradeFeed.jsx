import React, { useEffect, useState } from "react";
import TradeCard from "./TradeCard";
import DashboardStats from "./DashboardStats";
import { Card, CardHeader } from "@/components/ui/card";

const TradeFeed = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/trades/")
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading trades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <DashboardStats trades={trades} />

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Recent Trades</h2>
        </CardHeader>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trades.map((trade, index) => (
            <TradeCard key={index} trade={trade} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default TradeFeed;
