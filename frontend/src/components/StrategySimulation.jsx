import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Example data per politician
const previewData = {
  "Nancy Pelosi": {
    chart: [
      { month: "Jan 2023", portfolio: 100000, sp500: 100000 },
      { month: "Mar 2023", portfolio: 108500, sp500: 103200 },
      { month: "Jun 2023", portfolio: 125600, sp500: 108900 },
      { month: "Sep 2023", portfolio: 142300, sp500: 112400 },
      { month: "Dec 2023", portfolio: 156800, sp500: 118700 },
      { month: "Jan 2024", portfolio: 178900, sp500: 124300 },
    ],
    totalReturn: "+78.9%",
    vsSP500: "+24.3%",
  },
  "Dan Crenshaw": {
    chart: [
      { month: "Jan 2023", portfolio: 100000, sp500: 100000 },
      { month: "Mar 2023", portfolio: 105000, sp500: 103200 },
      { month: "Jun 2023", portfolio: 117000, sp500: 108900 },
      { month: "Sep 2023", portfolio: 132000, sp500: 112400 },
      { month: "Dec 2023", portfolio: 139000, sp500: 118700 },
      { month: "Jan 2024", portfolio: 146000, sp500: 124300 },
    ],
    totalReturn: "+46.0%",
    vsSP500: "+15.2%",
  },
  "Josh Gottheimer": {
    chart: [
      { month: "Jan 2023", portfolio: 100000, sp500: 100000 },
      { month: "Mar 2023", portfolio: 103000, sp500: 103200 },
      { month: "Jun 2023", portfolio: 109000, sp500: 108900 },
      { month: "Sep 2023", portfolio: 117000, sp500: 112400 },
      { month: "Dec 2023", portfolio: 123000, sp500: 118700 },
      { month: "Jan 2024", portfolio: 128000, sp500: 124300 },
    ],
    totalReturn: "+28.0%",
    vsSP500: "+3.8%",
  },
};

const politicians = Object.keys(previewData);

export default function StrategySimulation() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("Nancy Pelosi");

  const data = previewData[selected];

  return (
    <Card className="relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Strategy Simulation
        </CardTitle>
        <CardDescription>
          Preview: How would you have performed by mirroring a top politician’s trades?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap justify-between items-end mb-2 gap-2">
          <div>
            {/* Politician dropdown for preview */}
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Choose politician" />
              </SelectTrigger>
              <SelectContent>
                {politicians.map((pol) => (
                  <SelectItem key={pol} value={pol}>{pol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground mt-1">Backtest: {selected} 2023-24</div>
            <div className="text-2xl font-bold text-green-600">{data.totalReturn}</div>
            <div className="text-xs text-muted-foreground">vs S&P 500: {data.vsSP500}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate("/strategy-simulation")}
            className="mt-2"
          >
            Try Full Simulation →
          </Button>
        </div>
        <div className="h-[140px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.chart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis hide />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="#4F46E5"
                fill="#4F46E5"
                fillOpacity={0.15}
                name="Portfolio"
              />
              <Area
                type="monotone"
                dataKey="sp500"
                stroke="#F59E0B"
                fill="#F59E0B"
                fillOpacity={0.12}
                name="S&P 500"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
