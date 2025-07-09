import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Star, Bell, TrendingUp, Calendar, BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import PerformanceChart from "@/components/PerformanceChart";
import SectorExposure from "@/components/SectorExposure";

import { politicians } from "@/data/politicians";

export default function PoliticianPage() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const politician = politicians[decodedName];

  const [isWatched, setIsWatched] = useState(politician?.isWatched ?? false);
  const partyMap = {
    D: { label: "Democrat", color: "bg-blue-100 text-blue-800" },
    R: { label: "Republican", color: "bg-red-100 text-red-800" },
  };

  if (!politician) {
    return <div className="p-6 text-center text-red-600">Politician not found.</div>;
  }

  const partyColors = {
    Democrat: "bg-blue-100 text-blue-800",
    Republican: "bg-red-100 text-red-800",
  };

  return (
    <div className="min-h-screen bg-brand-100 text-brand-800">
      {/* Header */}
      <header className="border-b border-brand-300 bg-brand-50">
        <div className="max-w-6xl mx-auto px-4 py-6 flex justify-between items-center">
          <Link to="/politicians">
            <Button variant="ghost" className="text-brand-800">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Politicians
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button
              variant={isWatched ? "outline" : "default"}
              onClick={() => setIsWatched(w => !w)}
            >
              <Star className={`h-4 w-4 mr-1 ${isWatched ? "text-yellow-500 fill-current" : ""}`} />
              {isWatched ? "Following" : "Follow"}
            </Button>
            <Button variant="default">
              <Bell className="h-4 w-4 mr-1" />
              Notify Me
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* Profile Overview */}
        <Card>
        <CardContent className="pt-6">
  <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6">

    {/* Avatar */}
    <Avatar className="h-24 w-24">
      <AvatarImage src={politician.avatar || "/placeholder.svg"} />
      <AvatarFallback className="text-2xl">
        {politician.name?.split(" ").map((n) => n[0]).join("") || "??"}
      </AvatarFallback>
    </Avatar>

    {/* Middle Info: Name, Badge, Bio */}
    <div className="flex-1 space-y-2">
      {/* ✅ Politician Name */}
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-brand-900">
          {politician.name || "Unnamed Politician"}
        </h1>
        <Badge
          variant="outline"
          className={
            politician.party === "D"
              ? "bg-blue-100 text-blue-800"
              : politician.party === "R"
              ? "bg-red-100 text-red-800"
              : "bg-gray-100 text-gray-800"
          }
        >
          {politician.party === "D"
            ? "Democrat"
            : politician.party === "R"
            ? "Republican"
            : politician.party}
        </Badge>
      </div>

      {/* Title, State, Followers */}
      <p className="text-sm text-muted-foreground">
        {politician.title} • {politician.state}-{politician.district} •{" "}
        {politician.followers.toLocaleString()} followers
      </p>

      {/* Bio */}
      <p className="text-sm leading-relaxed max-w-2xl">
        {politician.bio ||
          `${politician.name} has served in Congress representing ${politician.state}-${politician.district}.`}
      </p>
    </div>

    {/* Metrics */}
    <div className="grid grid-cols-2 gap-4 text-center">
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-2xl font-bold text-green-600">{politician.totalReturn}</p>
        <p className="text-sm text-muted-foreground">Return</p>
      </div>
      <div className="bg-muted/50 p-4 rounded-lg">
        <p className="text-2xl font-bold">{politician.winRate}</p>
        <p className="text-sm text-muted-foreground">Win Rate</p>
      </div>
    </div>
  </div>
</CardContent>


        </Card>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2 flex justify-between">
              <CardTitle className="text-sm">Total Trades</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">{politician.trades}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex justify-between">
              <CardTitle className="text-sm">Avg Hold Time</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-2xl font-bold">{politician.avgHoldTime}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2 flex justify-between">
              <CardTitle className="text-sm">Best Trade</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">{politician.bestTrade}</CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="trades">Recent Trades</TabsTrigger>
            <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="performance">
                    <PerformanceChart
            politicianName={politician.name}
            data={politician.performanceData.map((item) => ({
              month: item.month,
              politician: item.pelosi, // Replace `pelosi` with dynamic key if needed
              market: item.market,
            }))}
          />

          </TabsContent>

          <TabsContent value="trades">
            <Card>
              <CardHeader>
                <CardTitle>Recent Trades</CardTitle>
                <CardDescription>Latest trading activity and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stock</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Entry Price</TableHead>
                      <TableHead>Current Price</TableHead>
                      <TableHead>Return</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {politician.recentTrades?.map((trade, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="font-medium">{trade.stock}</div>
                          <div className="text-xs text-muted-foreground">{trade.company}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={trade.action === "BUY" ? "default" : "destructive"}>
                            {trade.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{trade.amount}</TableCell>
                        <TableCell>{trade.date}</TableCell>
                        <TableCell>${trade.entryPrice}</TableCell>
                        <TableCell>${trade.currentPrice}</TableCell>
                        <TableCell className={trade.return.startsWith("+") ? "text-green-600" : "text-red-600"}>
                          {trade.return}
                        </TableCell>
                        <TableCell>{trade.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sectors">
            <SectorExposure data={politician.sectorData} />
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>
                  How this politician compares to others and market benchmarks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <p className="text-xl font-bold">1st</p>
                    <p className="text-sm text-muted-foreground">Rank among Democrats</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold">3rd</p>
                    <p className="text-sm text-muted-foreground">Overall ranking</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-green-600">+11.6%</p>
                    <p className="text-sm text-muted-foreground">vs S&P 500</p>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2 text-sm">Key Insights</h4>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Outperformed 89% of tracked politicians in the last 12 months</li>
                    <li>Technology sector allocation 15% higher than average politician</li>
                    <li>Average trade size significantly larger than peers</li>
                    <li>Consistently profitable in growth stocks during market volatility</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
