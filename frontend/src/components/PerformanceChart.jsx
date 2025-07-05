// src/components/PerformanceChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const performanceData = [
  { month: "Jan", pelosi: 4.2, market: 2.1, crenshaw: 3.8 },
  { month: "Feb", pelosi: 6.1, market: 1.8, crenshaw: 4.2 },
  { month: "Mar", pelosi: 8.3, market: 2.5, crenshaw: 5.1 },
  { month: "Apr", pelosi: 12.1, market: 3.2, crenshaw: 7.8 },
  { month: "May", pelosi: 15.4, market: 4.1, crenshaw: 9.2 },
  { month: "Jun", pelosi: 18.7, market: 4.8, crenshaw: 11.5 },
];

export default function PerformanceChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>Compare politician returns vs market benchmarks</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Line
              type="monotone"
              dataKey="pelosi"
              stroke="#4F46E5"
              strokeWidth={2}
              name="Nancy Pelosi"
            />
            <Line
              type="monotone"
              dataKey="crenshaw"
              stroke="#10B981"
              strokeWidth={2}
              name="Dan Crenshaw"
            />
            <Line
              type="monotone"
              dataKey="market"
              stroke="#F59E0B"
              strokeWidth={2}
              name="S&P 500"
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
