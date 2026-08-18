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

  // FIXED: Now strictly accepts 'string | null'
  const getSourceBadgeStyle = (source: string | null) => {
    switch (source) {
      case "google":
        return "bg-success-background text-success border-success-border";
      case "instagram":
        return "bg-highlight-background text-highlight border-highlight-border";
      case "facebook":
        return "bg-info-background text-info border-info-border";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Traffic Audit Log</h1>
      <p className="text-muted-foreground">
        Showing raw database entries with session hashes, referrers, and browser
        signatures.
      </p>

      <Card>
        <CardHeader className="bg-muted/30 border-b border-border">
          <CardTitle className="text-foreground">
            Detailed Visits Audit
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border">
                <tr>
                  <th className="px-3 py-3 whitespace-nowrap">Date & Time</th>
                  <th className="px-3 py-3 whitespace-nowrap">Path</th>
                  <th className="px-3 py-3 whitespace-nowrap">Source</th>
                  <th className="px-3 py-3 whitespace-nowrap">Visitor ID</th>
                  <th className="px-3 py-3 w-1/2">Raw Referer / URL</th>
                  <th className="px-3 py-3 w-1/3">User-Agent Signature</th>
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

                  const shortHash = visit.visitorHash
                    ? visit.visitorHash.slice(0, 8)
                    : "N/A";

                  return (
                    <tr key={visit.id} className="hover:bg-muted/20">
                      {/* Date */}
                      <td className="px-3 py-3 font-mono text-xs text-foreground whitespace-nowrap">
                        {timeString}
                      </td>

                      {/* Path */}
                      <td className="px-3 py-3 font-semibold text-primary whitespace-nowrap">
                        {visit.path}
                      </td>

                      {/* Source - Safely handles string | null */}
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getSourceBadgeStyle(
                            visit.source,
                          )}`}
                        >
                          {visit.source || "direct"} (
                          {visit.device || "desktop"})
                        </span>
                      </td>

                      {/* Hash - Uses Brand Secondary Token */}
                      <td
                        className="px-3 py-3 font-mono text-xs whitespace-nowrap"
                        title={visit.visitorHash}
                      >
                        <span className="px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded border border-border font-bold">
                          {shortHash}
                        </span>
                      </td>

                      {/* Raw Referer */}
                      <td
                        className="px-3 py-3 font-mono text-xs text-muted-foreground truncate max-w-[450px]"
                        title={visit.referer || ""}
                      >
                        {visit.referer || "direct"}
                      </td>

                      {/* User-Agent */}
                      <td
                        className="px-3 py-3 font-mono text-[11px] text-muted-foreground truncate max-w-[280px]"
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
