import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const TradeCard = ({ trade }) => {
  const isBuy =
    trade.type?.toLowerCase().includes("buy") ||
    trade.type?.toLowerCase().includes("purchase");

  const change = isBuy ? "+12.5%" : "-3.2%"; // Placeholder logic
  const initials = trade.name
    ? trade.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "??";

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm hover:shadow-md transition">
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={trade.avatar || "/placeholder.svg"} alt={trade.name} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold text-base">{trade.name || "Unknown"}</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">{trade.type?.toUpperCase()}</span> {trade.stock}
            </p>
            <p className="text-xs text-muted-foreground">{trade.amount}</p>
          </div>
        </div>

        <div className="text-right">
          <div
            className={`flex items-center justify-end text-sm font-semibold ${
              isBuy ? "text-green-600" : "text-red-600"
            }`}
          >
            {isBuy ? <FaArrowUp className="mr-1" /> : <FaArrowDown className="mr-1" />}
            {change}
          </div>
          <p className="text-xs text-muted-foreground">{trade.date}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeCard;
