import { db } from "@/db";
import { visits } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TrafficLogPage() {
  // Fetch the last 200 visits to see exactly what is happening
  const rawVisits = await db
    .select()
    .from(visits)
    .orderBy(desc(visits.visitedAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Traffic Audit Log</h1>
      <p className="text-muted-foreground">
        Showing the last 200 raw database entries. Use this to spot bot
        patterns.
      </p>

      <Card>
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle>Raw Visits Data</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Path Visited</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Device</th>
                  <th className="px-4 py-3">Visitor Hash (ID)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rawVisits.map((visit) => {
                  // Format time to Spanish local time
                  const timeString = new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "Europe/Madrid",
                  }).format(new Date(visit.visitedAt));

                  return (
                    <tr key={visit.id} className="hover:bg-muted/20">
                      <td className="px-4 py-3 font-mono text-xs">
                        {timeString}
                      </td>
                      <td className="px-4 py-3 text-primary">{visit.path}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            visit.source === "instagram"
                              ? "bg-pink-100 text-pink-700"
                              : visit.source === "google"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {visit.source}
                        </span>
                      </td>
                      <td className="px-4 py-3">{visit.device}</td>
                      <td className="px-4 py-3 font-mono text-[10px] text-muted-foreground truncate max-w-[150px]">
                        {visit.visitorHash}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
