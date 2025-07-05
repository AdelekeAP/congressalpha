// src/components/TopPerformers.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const topPerformers = [
  { name: "Nancy Pelosi", returns: "23.4%", trades: 47, winRate: "78%", party: "D" },
  { name: "Dan Crenshaw", returns: "19.2%", trades: 32, winRate: "72%", party: "R" },
  { name: "Josh Gottheimer", returns: "16.8%", trades: 28, winRate: "68%", party: "D" },
  { name: "Austin Scott", returns: "14.5%", trades: 23, winRate: "65%", party: "R" },
];

const TopPerformers = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Top Performers</CardTitle>
        <CardDescription>Best returns this year</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.trades} trades • {p.winRate} win rate
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-green-600">{p.returns}</div>
                <Badge
                  variant="outline"
                  className={`text-xs ${p.party === "D" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
                >
                  {p.party}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;
