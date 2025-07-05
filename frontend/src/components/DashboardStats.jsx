import React from "react";

const DashboardStats = ({ trades }) => {
  const uniqueNames = [...new Set(trades.map(t => t.name))];
  const totalTrades = trades.length;
  const avgPerformance = "+18.7%"; // Placeholder
  const totalVolume = "$2.4B"; // Placeholder — can calculate later

  const cards = [
    { label: "Active Politicians", value: uniqueNames.length },
    { label: "Total Trades", value: totalTrades },
    { label: "Avg Performance", value: avgPerformance },
    { label: "Total Volume", value: totalVolume },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, i) => (
        <div key={i} className="bg-white shadow p-4 rounded-lg">
          <h4 className="text-gray-500 text-sm">{card.label}</h4>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
