// src/components/PerformanceChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function PerformanceChart({ data, politicianName }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>
          {politicianName} vs S&P 500 (last 6 months)
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="politician"
              stroke="#4F46E5"
              strokeWidth={2}
              name={politicianName}
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
