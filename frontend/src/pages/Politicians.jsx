import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { PartyColors } from "@/lib/utils";
import { politicians } from "@/data/politicians";


export default function Politicians() {
  const [search, setSearch] = useState("");

  const filtered = politicians.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Politicians</h1>
        <Input
          placeholder="Search politicians"
          className="max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <Link to={`/politicians/${encodeURIComponent(p.name)}`} key={i}>
            <Card className="bg-brand-800 text-brand-100 border-brand-700 hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={p.avatar} />
                  <AvatarFallback>{p.name.split(" ").map(w => w[0]).join("")}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold">{p.name}</CardTitle>
                  <p className="text-sm text-brand-400">{p.state}</p>
                </div>
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <Badge
                  className={
                    p.party === "D"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }
                >
                  {p.party}
                </Badge>
                <div className="text-sm">
                  {p.trades} trades •{" "}
                  <span
                    className={
                      p.performance.startsWith("+")
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {p.performance}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
