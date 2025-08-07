import React from "react";
import {
  Bell,
  TrendingUp,
  Users,
  DollarSign,
  BarChart3,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

import { useNavigate } from "react-router-dom";

import PerformanceChart from "@/components/PerformanceChart";
import StrategySimulation from "@/components/StrategySimulation";
import TopPerformers from "@/components/TopPerformers";
import SectorExposure from "@/components/SectorExposure";
import AlertSettings from "@/components/AlertSettings";
import NewsHighlights from "@/components/NewsHighlights";
import RecentTrades from "@/components/RecentTrades";

// Mock aggregate performance data
const aggregatePerformance = [
  { month: "Jan", politicians: 3.4, market: 2.1 },
  { month: "Feb", politicians: 5.1, market: 1.8 },
  { month: "Mar", politicians: 6.3, market: 2.5 },
  { month: "Apr", politicians: 9.1, market: 3.2 },
  { month: "May", politicians: 11.4, market: 4.1 },
  { month: "Jun", politicians: 13.7, market: 4.8 },
];


export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card
            className="cursor-pointer hover:bg-muted/20 transition"
            onClick={() => navigate("/politicians")}
          >
          <CardHeader className="flex justify-between items-start">
            <CardTitle className="text-sm font-medium">Active Politicians</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">+12 this month</p>
          </CardContent>
        </Card>

        <Card
            className="cursor-pointer hover:bg-muted/20 transition"
            onClick={() => navigate("/trades")}
          >
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
        <div className="md:col-span-2">
          <RecentTrades />
        </div>
        <div className="md:col-span-1">
          <NewsHighlights />
        </div>
      </div>

      {/* Lower Section: Charts & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
        <StrategySimulation />
          <PerformanceChart
            politicianName="All Politicians"
            data={aggregatePerformance.map(item => ({
              month: item.month,
              politician: item.politicians,
              market: item.market,
            }))}
          />
         
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
