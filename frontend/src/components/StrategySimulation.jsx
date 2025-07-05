
import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

const backtestData = [
  { month: "Jan 2023", portfolio: 100000, sp500: 100000 },
  { month: "Mar 2023", portfolio: 108500, sp500: 103200 },
  { month: "Jun 2023", portfolio: 125600, sp500: 108900 },
  { month: "Sep 2023", portfolio: 142300, sp500: 112400 },
  { month: "Dec 2023", portfolio: 156800, sp500: 118700 },
  { month: "Jan 2024", portfolio: 178900, sp500: 124300 },
];

export default function StrategySimulation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Strategy Simulation</CardTitle>
        <CardDescription>Backtest: Mirror Nancy Pelosi’s trades since 2023</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Select defaultValue="nancy-pelosi">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select politician" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nancy-pelosi">Nancy Pelosi</SelectItem>
              <SelectItem value="dan-crenshaw">Dan Crenshaw</SelectItem>
              <SelectItem value="josh-gottheimer">Josh Gottheimer</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">+78.9%</div>
            <div className="text-sm text-muted-foreground">vs S&P 500: +24.3%</div>
          </div>
        </div>

        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={backtestData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Area
                type="monotone"
                dataKey="portfolio"
                stackId="1"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.2}
              />
              <Area
                type="monotone"
                dataKey="sp500"
                stackId="2"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
