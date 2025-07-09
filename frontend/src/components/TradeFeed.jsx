"use client";

import { trades as mockTrades } from "@/data/trades";
import { useEffect, useState } from "react";
import {
  Search,
  Download,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TradeFeed = () => {
  const [trades, setTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterParty, setFilterParty] = useState("all");
  const [filterAction, setFilterAction] = useState("all");
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fetch("http://localhost:8000/api/trades/")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setTrades(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    setTrades(mockTrades);
    setLoading(false);
  }, []);

  const filteredTrades = trades.filter((trade) => {
    const matchesSearch =
      trade.politician?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.stock?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trade.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesParty = filterParty === "all" || trade.party === filterParty;
    const matchesAction = filterAction === "all" || trade.action === filterAction;

    return matchesSearch && matchesParty && matchesAction;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground">Loading trades...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      {/* Header */}
      <header className="border-b bg-card mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">All Trades</h1>
            <p className="text-muted-foreground">
              Complete trading history from tracked politicians
            </p>
          </div>
        </div>
      </header>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter trades by politician, party, or action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search politician, stock, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={filterParty} onValueChange={setFilterParty}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="D">Democrat</SelectItem>
                <SelectItem value="R">Republican</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="BUY">Buy Orders</SelectItem>
                <SelectItem value="SELL">Sell Orders</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Trades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trading Activity</CardTitle>
          <CardDescription>
            Showing {filteredTrades.length} of {trades.length} trades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Politician</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry</TableHead>
                <TableHead>Current</TableHead>
                <TableHead>Return</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTrades.map((trade, index) => (
                <TableRow key={index}>
                  {/* Politician + Party */}
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={trade.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {trade.politician
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "??"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{trade.politician}</div>
                        <Badge
                          className={`text-xs ${
                            trade.party === "D" ? "bg-blue-100 text-blue-800" :
                            trade.party === "R" ? "bg-red-100 text-red-800" :
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {trade.party}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>

                  {/* Stock + Company */}
                  <TableCell>
                    <div>
                      <div className="font-medium">{trade.stock}</div>
                      <div className="text-sm text-muted-foreground">{trade.company}</div>
                    </div>
                  </TableCell>

                  {/* Action */}
                  <TableCell>
                    <Badge variant={trade.action === "BUY" ? "default" : "destructive"}>
                      {trade.action}
                    </Badge>
                  </TableCell>

                  {/* Amount */}
                  <TableCell>{trade.amount}</TableCell>

                  {/* Date */}
                  <TableCell>{trade.date}</TableCell>

                  {/* Entry Price */}
                  <TableCell>{trade.price?.startsWith("$") ? trade.price : `$${trade.price}`}</TableCell>

                  {/* Current Price */}
                  <TableCell>{trade.currentPrice?.startsWith("$") ? trade.currentPrice : `$${trade.currentPrice}`}</TableCell>

                  {/* Return */}
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {trade.return?.startsWith("+") ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span
                        className={`font-medium ${
                          trade.return?.startsWith("+") ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {trade.return}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradeFeed;
