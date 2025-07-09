import React, { useState } from "react";
import {
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Star,
  List,
  LayoutGrid,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { politicians as politiciansData } from "@/data/politicians";

export default function Politicians() {
  const [search, setSearch] = useState("");
  const [party, setParty] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("return");
  const [viewMode, setViewMode] = useState("grid");

  const allPoliticians = Object.entries(politiciansData).map(([name, data]) => ({
    name,
    ...data,
  }));

  const states = [...new Set(allPoliticians.map((p) => p.state))].sort();

  const filtered = allPoliticians
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.state.toLowerCase().includes(search.toLowerCase());

      const matchesParty = party === "all" || p.party.toLowerCase() === party;
      const matchesState = stateFilter === "all" || p.state === stateFilter;

      return matchesSearch && matchesParty && matchesState;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "return":
          return (
            parseFloat(b.totalReturn.replace("%", "")) -
            parseFloat(a.totalReturn.replace("%", ""))
          );
        case "trades":
          return b.trades - a.trades;
        case "followers":
          return b.followers - a.followers;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Summary stats
  const totalPoliticians = filtered.length;
  const avgReturn =
    filtered.reduce((acc, p) => acc + parseFloat(p.totalReturn), 0) /
    (filtered.length || 1);
  const totalTrades = filtered.reduce((acc, p) => acc + p.trades, 0);
  const totalFollowers = filtered.reduce((acc, p) => acc + p.followers, 0);

  return (
    <div className="min-h-screen px-4 py-8 text-brand-800 bg-brand-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-900">All Politicians</h1>
          <p className="text-brand-600">Track U.S. politicians based on their trading activity</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Grid
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            List
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Card className="bg-brand-800 text-brand-100 border-brand-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Politicians</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalPoliticians}</CardContent>
        </Card>

        <Card className="bg-brand-800 text-brand-100 border-brand-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Return</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold text-green-400">
            +{avgReturn.toFixed(1)}%
          </CardContent>
        </Card>

        <Card className="bg-brand-800 text-brand-100 border-brand-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Trades</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalTrades}</CardContent>
        </Card>

        <Card className="bg-brand-800 text-brand-100 border-brand-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Followers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">{totalFollowers}</CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6 bg-brand-50">
        <CardHeader>
          <CardTitle className="text-brand-800">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-brand-400" />
              <Input
                placeholder="Search by name or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={party} onValueChange={setParty}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by party" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Parties</SelectItem>
                <SelectItem value="d">Democrat</SelectItem>
                <SelectItem value="r">Republican</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="return">Total Return</SelectItem>
                <SelectItem value="trades">Number of Trades</SelectItem>
                <SelectItem value="followers">Followers</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Politician Cards */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {filtered.map((p, i) => (
          <Card
            key={i}
            className="hover:shadow-md transition-shadow bg-white text-brand-900"
          >
            <CardHeader className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback>
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{p.name}</h3>
                  <p className="text-sm text-brand-500">{p.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <Badge
                      className={
                        p.party === "D"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {p.party}
                    </Badge>
                    <span>{p.state}-{p.district}</span>
                  </div>
                </div>
              </div>
              <Star
                className={`h-4 w-4 mt-2 ${
                  p.isWatched ? "text-yellow-500 fill-current" : ""
                }`}
              />
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-green-600 font-bold text-lg">
                    {p.totalReturn}
                  </p>
                  <p className="text-xs text-brand-500">Return</p>
                </div>
                <div>
                  <p className="font-bold text-lg">{p.winRate}</p>
                  <p className="text-xs text-brand-500">Win Rate</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <p className="font-medium">{p.trades}</p>
                  <p className="text-xs text-brand-500">Trades</p>
                </div>
                <div>
                  <p className="font-medium">{p.followers}</p>
                  <p className="text-xs text-brand-500">Followers</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Top Sectors</p>
                <div className="flex flex-wrap gap-1">
                  {p.topSectors.map((sector, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {sector}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t mt-2">
                <div className="flex items-center gap-1 text-sm">
                  {p.recentPerformance.startsWith("+") ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={
                      p.recentPerformance.startsWith("+")
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
                  >
                    {p.recentPerformance}
                  </span>
                  <span className="text-brand-400 text-xs">30d</span>
                </div>
                <Button size="sm" asChild>
                  <Link to={`/politicians/${encodeURIComponent(p.name)}`}>
                    View Profile
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
