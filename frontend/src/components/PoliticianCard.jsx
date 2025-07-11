// src/components/PoliticianCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, TrendingUp, TrendingDown } from "lucide-react";

export default function PoliticianCard({ data }) {
  const {
    name,
    avatar,
    title,
    party,
    state,
    district,
    totalReturn,
    winRate,
    trades,
    followers,
    topSectors,
    recentPerformance,
    isWatched,
  } = data;

  return (
    <Link to={`/politicians/${encodeURIComponent(name)}`}>
      <Card className="hover:shadow-md transition-shadow bg-white text-brand-900">
        <CardHeader className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-14 w-14">
              <AvatarImage src={avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-bold">{name}</CardTitle>
              {title && <p className="text-sm text-brand-500">{title}</p>}
              <div className="flex items-center gap-2 mt-1 text-xs">
                <Badge
                  className={
                    party === "D"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {party}
                </Badge>
                <span>{state}-{district}</span>
              </div>
            </div>
          </div>
          <Star
            className={`h-4 w-4 mt-2 ${
              isWatched ? "text-yellow-500 fill-current" : "text-muted-foreground"
            }`}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Top row: return & win rate */}
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-green-600 font-bold text-lg">{totalReturn}</p>
              <p className="text-xs text-brand-500">Return</p>
            </div>
            <div>
              <p className="font-bold text-lg">{winRate}</p>
              <p className="text-xs text-brand-500">Win Rate</p>
            </div>
          </div>

          {/* Second row: trades & followers */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm">
            <div>
              <p className="font-medium">{trades}</p>
              <p className="text-xs text-brand-500">Trades</p>
            </div>
            <div>
              <p className="font-medium">{followers}</p>
              <p className="text-xs text-brand-500">Followers</p>
            </div>
          </div>

          {/* Top sectors */}
          <div>
            <p className="text-sm font-medium mb-1">Top Sectors</p>
            <div className="flex flex-wrap gap-1">
              {topSectors.map((s) => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          {/* Recent perf */}
          {recentPerformance && (
            <div className="flex items-center justify-between pt-2 border-t mt-2 text-sm">
              <div className="flex items-center gap-1">
                {recentPerformance.startsWith("+") ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )}
                <span
                  className={
                    recentPerformance.startsWith("+")
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {recentPerformance}
                </span>
                <span className="text-brand-400 text-xs">30d</span>
              </div>
              <Button size="sm" variant="outline">
                View
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
