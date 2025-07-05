// src/components/SectorExposure.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const sectorData = [
  { name: "Technology", value: 35, color: "#8884d8" },
  { name: "Healthcare", value: 20, color: "#82ca9d" },
  { name: "Finance", value: 18, color: "#ffc658" },
  { name: "Energy", value: 15, color: "#ff7300" },
  { name: "Consumer", value: 12, color: "#00ff88" },
];

export default function SectorExposure() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sector Exposure</CardTitle>
        <CardDescription>Current portfolio allocation</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sectorData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2 mt-4">
          {sectorData.map((sector, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                <span>{sector.name}</span>
              </div>
              <span className="font-medium">{sector.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
