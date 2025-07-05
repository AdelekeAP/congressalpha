import React from "react";
import {
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import PerformanceChart from "@/components/PerformanceChart";
import StrategySimulation from "@/components/StrategySimulation";
import TopPerformers from "@/components/TopPerformers";
import SectorExposure from "@/components/SectorExposure";
import AlertSettings from "@/components/AlertSettings";
import NewsHighlights from "@/components/NewsHighlights";
import RecentTrades from "@/components/RecentTrades";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const recentTrades = [
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

export default function Dashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">Active Politicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">+23% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+18.7%</div>
            <p className="text-xs text-muted-foreground">vs S&P 500: +12.4%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4B</div>
            <p className="text-xs text-muted-foreground">YTD Disclosed</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Trades + News */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Trades - 2/3 width */}
        <div className="md:col-span-2">
          <RecentTrades />
        </div>
        {/* News Highlights - 1/3 width */}
        <div className="md:col-span-1">
          <NewsHighlights />
        </div>
      </div>

      {/* Lower Section: Charts & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PerformanceChart />
          <StrategySimulation />
        </div>
        <div className="space-y-8">
          <TopPerformers />
          <SectorExposure />
          <AlertSettings />
        </div>
      </div>
    </div>
  );
}
