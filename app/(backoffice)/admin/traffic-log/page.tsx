import { db } from "@/db";
import { visits } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function TrafficLogPage() {
  const rawVisits = await db
    .select()
    .from(visits)
    .orderBy(desc(visits.visitedAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Traffic Audit Log</h1>
      <p className="text-muted-foreground">
        Showing raw database entries with session hashes, referrers, and browser
        signatures.
      </p>

      <Card>
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle>Detailed Visits Audit</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="px-4 py-3">Date & Time</th>
                  <th className="px-4 py-3">Path</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Visitor ID (Hash)</th>
                  <th className="px-4 py-3">Raw Referer</th>
                  <th className="px-4 py-3">User-Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rawVisits.map((visit) => {
                  const timeString = new Intl.DateTimeFormat("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "Europe/Madrid",
                  }).format(new Date(visit.visitedAt));

                  // Git-Style Short Hash (e.g. "8e19cc9a") for instant visual matching
                  const shortHash = visit.visitorHash
                    ? visit.visitorHash.slice(0, 8)
                    : "N/A";

                  return (
                    <tr key={visit.id} className="hover:bg-muted/20">
                      {/* Date */}
                      <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">
                        {timeString}
                      </td>

                      {/* Path */}
                      <td className="px-4 py-3 font-semibold text-primary">
                        {visit.path}
                      </td>

                      {/* Source & Device */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                            visit.source === "instagram"
                              ? "bg-pink-100 text-pink-700"
                              : visit.source === "google"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {visit.source} ({visit.device})
                        </span>
                      </td>

                      {/* Visitor Hash (Shortened for easy reading, full hash on hover) */}
                      <td
                        className="px-4 py-3 font-mono text-xs font-bold text-foreground whitespace-nowrap"
                        title={visit.visitorHash}
                      >
                        <span className="px-1.5 py-0.5 bg-muted rounded border border-border">
                          {shortHash}
                        </span>
                      </td>

                      {/* Raw Referer */}
                      <td
                        className="px-4 py-3 font-mono text-xs text-muted-foreground truncate max-w-[150px]"
                        title={visit.referer || ""}
                      >
                        {visit.referer || "direct"}
                      </td>

                      {/* User-Agent */}
                      <td
                        className="px-4 py-3 font-mono text-[11px] text-muted-foreground truncate max-w-[200px]"
                        title={visit.userAgent || ""}
                      >
                        {visit.userAgent || "Unknown"}
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
