// src/pages/StrategySimulationPage.jsx

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import NiceDateRangePicker from "@/components/ui/NiceDateRangePicker";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useNavigate } from "react-router-dom";

function mergeHistory(portfolioHistory = [], sp500History = []) {
  const data = {};
  for (const pt of portfolioHistory) data[pt.date] = { date: pt.date, portfolio: pt.balance };
  for (const sp of sp500History) {
    if (!data[sp.date]) data[sp.date] = { date: sp.date };
    data[sp.date].sp500 = sp.sp500_value;
  }
  return Object.values(data).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Utility: Only show badge for positive returns
function getReturnBadge(pol) {
  if (pol.total_return && pol.total_return.startsWith("+")) {
    return (
      <Badge variant="default" className="text-lg">
        {pol.total_return}
      </Badge>
    );
  }
  // Show N/A or nothing for non-positive
  return (
    <Badge
      variant="outline"
      className="text-lg text-muted-foreground border-muted-foreground"
      style={{ background: "transparent", borderColor: "#ddd" }}
    >
      N/A
    </Badge>
  );
}

export default function StrategySimulationPage() {
  const [politicians, setPoliticians] = useState([]);
  const [selectedPolId, setSelectedPolId] = useState("");
  const [initialAmount, setInitialAmount] = useState("100000");
  const [strategy, setStrategy] = useState("mirror");
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [simResult, setSimResult] = useState(null);

  const navigate = useNavigate();

  // Fetch politicians from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/politicians")
      .then((res) => res.json())
      .then((data) => setPoliticians(data))
      .catch(() => setPoliticians([]));
  }, []);

  // Only politicians with trades > 0
  const filteredFigures = politicians.filter(
    (p) => p.trades && p.trades > 0
  );

  const selectedPolName =
    filteredFigures.find((p) => String(p.id) === String(selectedPolId))?.name || "";

  const runSimulation = async () => {
    setLoading(true); setError(""); setSimResult(null);
    try {
      const body = {
        politician_ids: [parseInt(selectedPolId)],
        start_date: dateRange[0] ? dateRange[0].toISOString().slice(0, 10) : "2023-01-01",
        end_date: dateRange[1] ? dateRange[1].toISOString().slice(0, 10) : "2023-12-31",
        investment_amount: parseFloat(initialAmount),
        simulation_strategy: strategy,
      };
      const response = await fetch("http://localhost:8000/api/simulate-trades", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Simulation failed");
      const data = await response.json();
      setSimResult(data);
    } catch (err) { setError(err.message || "Unknown error"); }
    finally { setLoading(false); }
  };

  const chartData =
    simResult && (simResult.portfolio_history || simResult.sp500_history)
      ? mergeHistory(simResult.portfolio_history, simResult.sp500_history)
      : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate("/")}>← Home</Button>
              <Button variant="ghost" onClick={() => navigate("/politicians")}>All Figures</Button>
              <Button variant="ghost" onClick={() => navigate("/profile")}>Profile</Button>
              <div>
                <h1 className="text-3xl font-bold">Simulate a Strategy</h1>
                <p className="text-base text-muted-foreground">
                  See how you’d do by following trades made by public figures
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Setup */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Start a Simulation</CardTitle>
                <CardDescription>
                  Pick a Politician and try different “what if” scenarios.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <Label htmlFor="politician" className="text-lg">Choose a Politician</Label>
                  <Select value={selectedPolId} onValueChange={setSelectedPolId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select someone to follow" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredFigures.map((pol) => (
                        <SelectItem key={pol.id} value={String(pol.id)}>
                          {pol.name} ({pol.party})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="initial-amount" className="text-lg">Starting Balance</Label>
                  <Input id="initial-amount" type="number" min={1000}
                    value={initialAmount}
                    onChange={(e) => setInitialAmount(e.target.value)}
                    placeholder="How much to start with?" />
                </div>
                <div>
                  <Label className="text-lg">Date Range</Label>
                  <NiceDateRangePicker value={dateRange} onChange={setDateRange} />
                </div>
                <div>
                  <Label htmlFor="strategy" className="text-lg">Simulation Style</Label>
                  <Select value={strategy} onValueChange={setStrategy}>
                    <SelectTrigger>
                      <SelectValue placeholder="How to follow trades?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="mirror">Mirror All Disclosed Trades</SelectItem>
                        <SelectItem value="tech-sector">Follow Only Technology Sector</SelectItem>
                        <SelectItem value="delayed">Follow Trades With 7-Day Delay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={runSimulation}
                  className="w-full py-3 text-lg"
                  disabled={!selectedPolId || loading}
                >
                  <BarChart3 className="h-6 w-6 mr-2" />
                  {loading ? "Simulating..." : "Start Simulation"}
                </Button>
              </CardContent>
            </Card>
            {/* Public Figures Stats */}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Politcians with Real Trades</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredFigures.length === 0 ? (
                  <div className="text-muted-foreground text-center py-6">
                    No Politcians with trade data found for this period.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {filteredFigures.map((pol) => (
                      <div key={pol.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-base">{pol.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {pol.trades} {pol.trades === 1 ? "trade" : "trades"}
                          </div>
                        </div>
                        {getReturnBadge(pol)}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {loading && (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center text-muted-foreground text-lg">Running simulation...</div>
                </CardContent>
              </Card>
            )}
            {error && (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center text-red-600 text-lg">{error}</div>
                </CardContent>
              </Card>
            )}

            {/* Show results */}
            {simResult && (
              <div className="space-y-10">
                {/* Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Your Gain/Loss</CardTitle>
                      <TrendingUp className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className={`text-3xl font-bold ${simResult.total_return >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {(simResult.total_return * 100).toFixed(2)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Portfolio Value</CardTitle>
                      <DollarSign className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        ${simResult.final_balance?.toLocaleString() ?? "--"}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-medium">Number of Trades</CardTitle>
                      <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">
                        {simResult.trade_results ? simResult.trade_results.length : 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Chart */}
                {chartData.length > 1 ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio vs. S&P 500</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={chartData}>
                            <XAxis
                              dataKey="date"
                              tickFormatter={str =>
                                new Date(str).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                              }
                            />
                            <YAxis />
                            <Tooltip
                              labelFormatter={v =>
                                new Date(v).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
                              }
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="portfolio"
                              stroke="#4F46E5"
                              strokeWidth={3}
                              name="Your Portfolio"
                              dot={false}
                              isAnimationActive={false}
                              connectNulls
                            />
                            <Line
                              type="monotone"
                              dataKey="sp500"
                              stroke="#F59E0B"
                              strokeWidth={2}
                              name="S&P 500"
                              dot={false}
                              isAnimationActive={false}
                              connectNulls
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-muted-foreground mt-8 text-center text-base">
                    No trades or performance available for this period.
                  </div>
                )}

                {/* Breakdown */}
                {simResult.trade_analysis && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Trade Breakdown</CardTitle>
                      <CardDescription>
                        How your simulation did, trade by trade
                        {selectedPolName && <> following <span className="font-semibold">{selectedPolName}</span></>}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {simResult.trade_analysis.win_count + simResult.trade_analysis.lose_count}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Trades</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {simResult.trade_analysis.win_count}
                          </div>
                          <div className="text-sm text-muted-foreground">Profitable</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {simResult.trade_analysis.lose_count}
                          </div>
                          <div className="text-sm text-muted-foreground">Losing</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            {simResult.trade_analysis.win_rate}%
                          </div>
                          <div className="text-sm text-muted-foreground">Winning Percentage</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between text-base">
                          <span>Best Trade ({simResult.trade_analysis.best_trade.ticker})</span>
                          <span className="text-green-600 font-semibold">
                            {(simResult.trade_analysis.best_trade.return * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span>Worst Trade ({simResult.trade_analysis.worst_trade.ticker})</span>
                          <span className="text-red-600 font-semibold">
                            {(simResult.trade_analysis.worst_trade.return * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between text-base">
                          <span>Average Time Held</span>
                          <span className="font-semibold">
                            {simResult.trade_analysis.average_hold_time} days
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* No result fallback */}
            {!loading && !error && !simResult && (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-[600px]">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-2xl font-medium mb-2">
                      Try Your First Simulation
                    </h3>
                    <p className="text-muted-foreground mb-6 text-base">
                      Pick a public figure and see what would have happened if you mirrored their trades.
                    </p>
                    <div className="space-y-2 text-base text-muted-foreground">
                      <p>• Mirror trades with one click</p>
                      <p>• Compare your returns to the S&P 500</p>
                      <p>• Simple, honest results — no jargon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
