import { useParams, Link } from "react-router-dom";
import { politicians } from "@/data/politicians";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";


export default function PoliticianPage() {
  const { name } = useParams();
  const data = politicians[name];

  if (!data) return <p className="p-6 text-muted-foreground">Politician not found.</p>;

  return (
    <div className="px-6 py-8 space-y-6">
      <Link to="/" className="text-sm text-brand-600 hover:text-brand-400 no-underline flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-xl">
            {name}
            <Badge
              className={data.party === "D" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}
            >
              {data.party}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{data.bio}</p>
          <div className="space-y-2">
            {data.trades.map((t, i) => (
              <div
                key={i}
                className="flex justify-between items-center border p-3 rounded-md text-sm"
              >
                <div>
                  <div className="font-medium">{t.action} {t.stock}</div>
                  <div className="text-muted-foreground">{t.amount}</div>
                </div>
                <div className={t.change.startsWith("+") ? "text-green-600" : "text-red-600"}>
                  {t.change} • {t.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
