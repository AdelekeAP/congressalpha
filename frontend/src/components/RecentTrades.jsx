// src/components/RecentTrades.jsx
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Bell, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom"; // Add this at the top



const trades = [
  {
    politician: "Nancy Pelosi",
    party: "D",
    stock: "NVDA",
    action: "BUY",
    amount: "$1M-$5M",
    date: "2024-01-15",
    change: "+12.5%",
    avatar: "/placeholder.svg",
  },
  {
    politician: "Dan Crenshaw",
    party: "R",
    stock: "TSLA",
    action: "SELL",
    amount: "$500K-$1M",
    date: "2024-01-14",
    change: "-3.2%",
    avatar: "/placeholder.svg",
  },
];

const RecentTrades = () => {
  const [search, setSearch] = useState("");
  const [party, setParty] = useState("ALL");

  const filtered = trades.filter((t) => {
    const matchName = t.politician.toLowerCase().includes(search.toLowerCase());
    const matchParty = party === "ALL" || t.party === party;
    return matchName && matchParty;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Trades
        </CardTitle>
        <CardDescription>Latest activity by U.S. politicians</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filter Inputs */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <Input
            placeholder="Search by name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:w-1/2"
          />
          <Select onValueChange={setParty} defaultValue="ALL">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Party" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="D">Democrat</SelectItem>
              <SelectItem value="R">Republican</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Trade List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {filtered.map((trade, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 rounded-md border"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={trade.avatar} />
                  <AvatarFallback>
                    {trade.politician
                      .split(" ")
                      .map((w) => w[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                <div className="flex items-center gap-2">
                    <Link
                      to={`/politicians/${encodeURIComponent(trade.politician)}`}
                      className="font-medium text-brand-600 hover:text-brand-400 no-underline"
                    >
                      {trade.politician}
                    </Link>
                    <Badge
                      variant="outline"
                      className={
                        trade.party === "D"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {trade.party}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {trade.action} {trade.stock} • {trade.amount}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div
                  className={`flex items-center justify-end gap-1 ${
                    trade.change.startsWith("+") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {trade.change.startsWith("+") ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                  <span>{trade.change}</span>
                </div>
                <div className="text-sm text-muted-foreground">{trade.date}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTrades;
