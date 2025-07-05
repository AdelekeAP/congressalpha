// src/components/NewsHighlights.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

const newsItems = [
  {
    headline: "Congress Proposes AI Regulation Bill",
    date: "2025-07-01",
    impact: "High",
    tickers: ["GOOG", "MSFT", "NVDA"],
  },
  {
    headline: "Trump Announces Pro-Crypto Campaign Platform",
    date: "2025-06-29",
    impact: "Medium",
    tickers: ["COIN", "BTC"],
  },
  {
    headline: "Senate Passes Infrastructure Spending Bill",
    date: "2025-06-26",
    impact: "Low",
    tickers: ["CAT", "DE", "VMC"],
  },
];

const impactColor = {
  High: "bg-red-600 text-white",
  Medium: "bg-yellow-500 text-black",
  Low: "bg-green-500 text-white",
};

export default function NewsHighlights() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          News Highlights
        </CardTitle>
        <CardDescription>
          News events with potential market impact
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {newsItems.map((item, idx) => (
          <div
            key={idx}
            className="border rounded-md p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
          >
            <div>
              <div className="font-medium">{item.headline}</div>
              <div className="text-sm text-muted-foreground">{item.date}</div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={impactColor[item.impact]}>{item.impact} Impact</Badge>
              {item.tickers.map((t, i) => (
                <Badge key={i} variant="outline">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
