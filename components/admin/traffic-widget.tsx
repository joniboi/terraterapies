import { db } from "@/db";
import { visits } from "@/db/schema";
import { gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function TrafficWidget() {
  // 1. Fetch 60 days of data to compare "This Month" vs "Last Month"
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const rawVisits = await db
    .select()
    .from(visits)
    .where(gte(visits.visitedAt, sixtyDaysAgo));

  // --- TIME BOUNDARIES ---
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // --- 24 HOUR STATS ---
  const visits24h = rawVisits.filter((v) => v.visitedAt >= twentyFourHoursAgo);
  const totalViews = visits24h.length;
  const uniqueVisitors = new Set(visits24h.map((v) => v.visitorHash)).size;
  const mobileCount = visits24h.filter((v) => v.device === "mobile").length;
  const mobilePercent =
    totalViews > 0 ? Math.round((mobileCount / totalViews) * 100) : 0;

  // Helper function: Counts how many UNIQUE people came from a specific source
  const getUniqueCountBySource = (sourceName: string) => {
    const visitsFromSource = visits24h.filter((v) => v.source === sourceName);
    return new Set(visitsFromSource.map((v) => v.visitorHash)).size;
  };

  const instagramCount = getUniqueCountBySource("instagram");
  const facebookCount = getUniqueCountBySource("facebook");
  const googleCount = getUniqueCountBySource("google");

  // --- 30-DAY INSIGHTS ENGINE ---
  const visits30d = rawVisits.filter((v) => v.visitedAt >= thirtyDaysAgo);
  const visitsPriorMonth = rawVisits.filter((v) => v.visitedAt < thirtyDaysAgo);

  // Insight A: Busiest Day of the Week (based on last 30 days)
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayCounts = Array(7).fill(0);
  visits30d.forEach((v) => {
    const day = new Date(v.visitedAt).getDay();
    dayCounts[day]++;
  });
  const busiestDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
  const busiestDay = visits30d.length > 0 ? dayNames[busiestDayIndex] : "---";

  // Insight B: The Golden Hour (Peak traffic hour)
  const hourCounts = Array(24).fill(0);
  visits30d.forEach((v) => {
    // Force JavaScript to read the hour as if it were in Spain
    const spainHourString = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: "Europe/Madrid", // <-- Locks calculation to Spain Timezone
    }).format(new Date(v.visitedAt));

    // Normalize "24" to "0" (some systems return 24 for midnight)
    const hour = parseInt(spainHourString, 10) % 24;
    hourCounts[hour]++;
  });

  const peakHour = hourCounts.indexOf(Math.max(...hourCounts));
  const peakHourFormatted =
    visits30d.length > 0 ? `${peakHour}:00 - ${peakHour + 1}:00` : "---";

  // Insight C: Month-over-Month Momentum
  const thisMonthCount = visits30d.length;
  const lastMonthCount = visitsPriorMonth.length;
  let growthPercent = 0;
  if (lastMonthCount > 0) {
    growthPercent = Math.round(
      ((thisMonthCount - lastMonthCount) / lastMonthCount) * 100,
    );
  }

  return (
    <Card className="mb-8">
      {/* Header */}
      <CardHeader className="border-b border-border pb-4 bg-muted/30">
        <CardTitle className="text-foreground">Traffic & Insights</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        {/* Row 1: Quick Stats (Last 24 Hours) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Views (24h)
            </p>
            <p className="text-2xl font-black text-foreground mt-1">
              {totalViews}
            </p>
          </div>

          <div className="p-4 bg-muted/50 rounded-xl border border-border/50">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Unique (24h)
            </p>
            <p className="text-2xl font-black text-foreground mt-1">
              {uniqueVisitors}
            </p>
          </div>

          <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
            <p className="text-primary/80 text-xs font-semibold uppercase tracking-wider">
              From Mobile (24h)
            </p>
            <p className="text-2xl font-black text-primary mt-1">
              {mobilePercent}%
            </p>
          </div>

          <div className="p-4 bg-accent/50 rounded-xl border border-border/50">
            <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
              Sources (24h)
            </p>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                IG:{" "}
                <strong className="text-foreground">{instagramCount}</strong>
              </span>
              <span className="text-muted-foreground">
                FB: <strong className="text-foreground">{facebookCount}</strong>
              </span>
              <span className="text-muted-foreground">
                Google:{" "}
                <strong className="text-foreground">{googleCount}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border my-6"></div>

        {/* Row 2: Smart Conclusions (Last 30 Days) */}
        <div>
          <h3 className="font-heading text-sm font-bold text-foreground mb-4 uppercase tracking-wider">
            💡 Smart Insights (Last 30 days)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Conclusion 1: Busiest Day */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/30 flex items-start space-x-3">
              <span className="text-2xl">📅</span>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Peak Day of Week
                </p>
                <p className="text-base font-bold text-foreground mt-1">
                  {visits30d.length > 0 ? (
                    <span>
                      <span className="text-primary">{busiestDay}s</span> are
                      your peak traffic days.
                    </span>
                  ) : (
                    <span>No traffic recorded yet.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Conclusion 2: The Golden Hour */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/30 flex items-start space-x-3">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  The Golden Hour
                </p>
                <p className="text-base font-bold text-foreground mt-1">
                  Your traffic peaks at{" "}
                  <span className="text-primary">{peakHourFormatted}</span>.
                  Perfect time to post on social media!
                </p>
              </div>
            </div>

            {/* Conclusion 3: Monthly Growth */}
            <div className="p-4 bg-muted/30 rounded-xl border border-border/30 flex items-start space-x-3">
              <span className="text-2xl">📈</span>
              <div>
                <p className="text-xs text-muted-foreground font-semibold">
                  Monthly Momentum
                </p>
                <p className="text-base font-bold text-foreground mt-1">
                  {growthPercent >= 0 ? (
                    <span>
                      You have{" "}
                      <span className="text-success">
                        +{growthPercent}% more
                      </span>{" "}
                      visits this month than the last.
                    </span>
                  ) : (
                    <span>
                      You have{" "}
                      <span className="text-destructive">
                        {growthPercent}% fewer
                      </span>{" "}
                      visits this month than the last.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
