"use client";

import { useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Ban,
  BarChart3,
  CalendarDays,
  Globe2,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Users,
  Zap,
} from "lucide-react";

type OverviewMetrics = {
  activeUsers: number;
  suspendedUsers: number;
  groups: number;
};

type Breakdown = { visitors: number; pageviews: number; percentage: number };
type TimelinePoint = { date: string; visitors: number; pageviews: number; label?: string };
type ChartPoint = TimelinePoint & { x: number; y: number };
type AnalyticsPayload = {
  totalVisitors: number;
  totalPageviews: number;
  totalCountries: number;
  timeline: { date: string; visitors: number; pageviews: number }[];
  countries: ({ country: string } & Breakdown)[];
  devices: ({ device: string } & Breakdown)[];
  browsers: ({ browser: string } & Breakdown)[];
  operatingSystems: ({ os: string } & Breakdown)[];
  topPages: { path: string; visitors: number; pageviews: number }[];
  syncStatus?: {
    reason?: string;
    queuedDays?: number;
    skippedDays?: number;
    syncedDays?: number;
    emptyDays?: number;
    lastError?: string;
    lastSyncedAt?: string;
  };
};

type RangeMode = "week" | "month" | "quarter" | "year" | "all";

const emptyAnalytics: AnalyticsPayload = {
  totalVisitors: 0,
  totalPageviews: 0,
  totalCountries: 0,
  timeline: [],
  countries: [],
  devices: [],
  browsers: [],
  operatingSystems: [],
  topPages: [],
};

const rangeLabels: Record<RangeMode, string> = {
  week: "Weekly",
  month: "Month",
  quarter: "3 Months",
  year: "Year",
  all: "All",
};

const rowColors = ["bg-emerald-400", "bg-blue-500", "bg-amber-400", "bg-red-400", "bg-violet-400", "bg-cyan-400"];
const donutColors = ["#22c55e", "#2563eb", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

function daysSince(value?: string) {
  if (!value) return "No sync yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No sync yet";
  const diff = Math.max(Date.now() - date.getTime(), 0);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "Last synced just now";
  if (hours < 24) return `Last synced ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `Last synced ${days}d ago`;
}

function formatMonth(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function formatAxisDate(value: string, mode: RangeMode) {
  if (/^\d{4}-\d{2}$/.test(value)) {
    return formatMonth(`${value}-01`);
  }
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  if (mode === "week" || mode === "month") {
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

function formatTooltipDate(value: string) {
  const normalized = /^\d{4}-\d{2}$/.test(value) ? `${value}-01` : value;
  const date = new Date(`${normalized}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  if (/^\d{4}-\d{2}$/.test(value)) {
    return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
  }
  return date.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function toMonthKey(dateKey: string) {
  return dateKey.slice(0, 7);
}

function filterTimeline(
  timeline: AnalyticsPayload["timeline"],
  mode: RangeMode,
  customDate: string
) {
  const sorted = [...timeline].sort((a, b) => a.date.localeCompare(b.date));
  if (customDate) return sorted.filter((item) => item.date === customDate);
  if (mode === "all") return sorted;

  const daysByMode: Record<Exclude<RangeMode, "all">, number> = {
    week: 7,
    month: 30,
    quarter: 90,
    year: 365,
  };
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - daysByMode[mode] + 1);
  return sorted.filter((item) => new Date(`${item.date}T00:00:00`) >= cutoff);
}

function buildChartTimeline(timeline: AnalyticsPayload["timeline"], mode: RangeMode, customDate: string): TimelinePoint[] {
  const filtered = filterTimeline(timeline, mode, customDate);
  const byDate = new Map(filtered.map((item) => [item.date, item]));

  if (customDate) {
    const item = byDate.get(customDate);
    return [{ date: customDate, visitors: item?.visitors || 0, pageviews: item?.pageviews || 0 }];
  }

  if (mode === "week" || mode === "month") {
    const days = mode === "week" ? 7 : 30;
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = addDays(end, -(days - 1));
    return Array.from({ length: days }, (_item, index) => {
      const key = toDateKey(addDays(start, index));
      const item = byDate.get(key);
      return { date: key, visitors: item?.visitors || 0, pageviews: item?.pageviews || 0 };
    });
  }

  const monthly = new Map<string, TimelinePoint>();
  filtered.forEach((item) => {
    const key = toMonthKey(item.date);
    const current = monthly.get(key) || { date: key, visitors: 0, pageviews: 0 };
    current.visitors += item.visitors || 0;
    current.pageviews += item.pageviews || 0;
    monthly.set(key, current);
  });
  return Array.from(monthly.values()).sort((a, b) => a.date.localeCompare(b.date));
}

function buildChartPath(points: TimelinePoint[], width: number, height: number) {
  if (!points.length) return { line: "", area: "", max: 1, points: [] };
  const max = Math.max(...points.map((item) => item.visitors), 1);
  const step = points.length > 1 ? width / (points.length - 1) : width;
  const coords = points.map((item, index) => {
    const x = points.length > 1 ? index * step : width / 2;
    const y = height - (item.visitors / max) * height;
    return { ...item, x, y };
  });
  const line = coords.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ");
  const area = `${line} L ${coords[coords.length - 1].x.toFixed(2)} ${height} L ${coords[0].x.toFixed(2)} ${height} Z`;
  return { line, area, max, points: coords };
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-[#080b15] dark:shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
      <div className="flex items-center gap-4">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase text-slate-500 dark:text-zinc-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

function BreakdownPanel({
  title,
  icon: Icon,
  rows,
}: {
  title: string;
  icon: LucideIcon;
  rows: { label: string; visitors: number; percentage: number }[];
}) {
  const max = rows[0]?.visitors || 1;
  return (
    <div className="min-h-64 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#080b15]">
      <h3 className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
        <Icon className="h-4 w-4 text-blue-400" />
        {title}
      </h3>
      <div className="mt-5 space-y-4">
        {rows.length === 0 ? <p className="text-sm text-slate-500 dark:text-zinc-500">No cached data yet.</p> : null}
        {rows.slice(0, 6).map((row, index) => (
          <div key={row.label}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-black text-slate-950 dark:text-white">{row.label}</span>
              <span className="shrink-0 text-slate-500 dark:text-zinc-300">
                {row.visitors} | {row.percentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className={`h-full rounded-full ${rowColors[index % rowColors.length]}`}
                style={{ width: `${Math.max((row.visitors / max) * 100, 7)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CountryEngagement({ rows }: { rows: AnalyticsPayload["countries"] }) {
  const visible = rows.slice(0, 6);
  const total = visible.reduce((sum, row) => sum + row.visitors, 0);
  const segments = visible.map((row, index) => {
    const start = visible.slice(0, index).reduce((sum, item) => sum + (total ? (item.visitors / total) * 100 : 0), 0);
    const end = start + (total ? (row.visitors / total) * 100 : 0);
    return `${donutColors[index % donutColors.length]} ${start}% ${end}%`;
  });
  const background = segments.length ? `conic-gradient(${segments.join(", ")})` : "conic-gradient(#1f2937 0% 100%)";
  const max = visible[0]?.visitors || 1;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#080b15]">
      <h3 className="flex items-center gap-2 text-base font-black text-slate-950 dark:text-white">
        <Zap className="h-4 w-4 text-blue-400" />
        Country Engagement
      </h3>
      <div className="mt-8 flex justify-center">
        <div className="relative h-32 w-32 rounded-full" style={{ background }}>
          <div className="absolute inset-6 rounded-full bg-white dark:bg-[#080b15]" />
        </div>
      </div>
      <div className="mt-8 space-y-4">
        {visible.length === 0 ? <p className="text-sm text-slate-500 dark:text-zinc-500">No cached data yet.</p> : null}
        {visible.map((row, index) => (
          <div key={row.country}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
              <span className="truncate font-black text-slate-950 dark:text-white">{row.country}</span>
              <span className="shrink-0 text-slate-500 dark:text-zinc-300">
                {row.visitors} | {row.percentage}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
              <div
                className={`h-full rounded-full ${rowColors[index % rowColors.length]}`}
                style={{ width: `${Math.max((row.visitors / max) * 100, 7)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="grid h-full grid-cols-[44px_1fr] grid-rows-[1fr_28px] gap-x-3 animate-pulse">
      <div className="flex h-[220px] flex-col justify-between">
        {[0, 1, 2, 3, 4].map((item) => (
          <span key={item} className="ml-auto h-2 w-6 rounded bg-slate-200 dark:bg-white/10" />
        ))}
      </div>
      <div className="relative h-[220px] overflow-hidden rounded-lg">
        <div className="absolute inset-0 flex flex-col justify-between">
          {[0, 1, 2, 3, 4].map((line) => (
            <span key={line} className="border-t border-dashed border-slate-200 dark:border-white/10" />
          ))}
        </div>
        <div className="absolute left-[8%] top-[22%] h-3 w-1/4 rounded bg-slate-200 dark:bg-white/10" />
        <div className="absolute left-[34%] top-[46%] h-3 w-1/5 rounded bg-slate-200 dark:bg-white/10" />
        <div className="absolute left-[66%] top-[31%] h-3 w-1/4 rounded bg-slate-200 dark:bg-white/10" />
      </div>
      <div />
      <div className="flex items-center justify-between">
        {[0, 1, 2, 3].map((item) => (
          <span key={item} className="h-2 w-16 rounded bg-slate-200 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPanel({ overview }: { overview: OverviewMetrics }) {
  const [analytics, setAnalytics] = useState<AnalyticsPayload>(emptyAnalytics);
  const [rangeMode, setRangeMode] = useState<RangeMode>("month");
  const [customDate, setCustomDate] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [activePoint, setActivePoint] = useState<ChartPoint | null>(null);

  async function loadAnalytics() {
    setError("");
    const response = await fetch("/api/admin/analytics", { cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Failed to load analytics.");
    setAnalytics({ ...emptyAnalytics, ...data });
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAnalytics()
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load analytics."))
      .finally(() => setLoading(false));
  }, []);

  async function syncAnalytics() {
    setSyncing(true);
    setError("");
    try {
      const response = await fetch("/api/admin/analytics", { method: "PUT", cache: "no-store" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.syncStatus?.lastError || data.error || "Failed to sync analytics.");
      }
      await loadAnalytics();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sync analytics.");
    } finally {
      setSyncing(false);
    }
  }

  const syncStatus = analytics.syncStatus;
  const missingEnv = syncStatus?.reason === "missing-vercel-env";
  const chartTimeline = useMemo(
    () => buildChartTimeline(analytics.timeline, rangeMode, customDate),
    [analytics.timeline, customDate, rangeMode]
  );
  const chart = useMemo(() => buildChartPath(chartTimeline, 560, 220), [chartTimeline]);
  const yLabels = [chart.max, Math.round(chart.max * 0.75), Math.round(chart.max * 0.5), Math.round(chart.max * 0.25), 0];
  const xLabels = useMemo(() => {
    if (chartTimeline.length <= 4) return chartTimeline.map((item) => item.date);
    return [
      chartTimeline[0]?.date,
      chartTimeline[Math.floor(chartTimeline.length / 3)]?.date,
      chartTimeline[Math.floor((chartTimeline.length * 2) / 3)]?.date,
      chartTimeline[chartTimeline.length - 1]?.date,
    ].filter(Boolean) as string[];
  }, [chartTimeline]);

  function updateRange(nextRange: RangeMode) {
    setIsFiltering(true);
    setActivePoint(null);
    setRangeMode(nextRange);
    setCustomDate("");
    window.setTimeout(() => setIsFiltering(false), 320);
  }

  function updateDate(nextDate: string) {
    setIsFiltering(true);
    setActivePoint(null);
    setCustomDate(nextDate);
    window.setTimeout(() => setIsFiltering(false), 320);
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <KpiCard label="Visitors" value={analytics.totalVisitors} icon={Users} color="bg-blue-500/10 text-blue-400" />
        <KpiCard label="Pageviews" value={analytics.totalPageviews} icon={MousePointerClick} color="bg-cyan-500/10 text-cyan-400" />
        <KpiCard label="Countries" value={analytics.totalCountries} icon={Globe2} color="bg-emerald-500/10 text-emerald-400" />
        <KpiCard label="Active Users" value={overview.activeUsers} icon={ShieldCheck} color="bg-amber-500/10 text-amber-400" />
        <KpiCard label="Suspended" value={overview.suspendedUsers} icon={Ban} color="bg-red-500/10 text-red-400" />
        <KpiCard label="Groups" value={overview.groups} icon={BarChart3} color="bg-violet-500/10 text-violet-400" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#080b15]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Chatly Engagement</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-zinc-500">
                {loading ? "Reading cached analytics..." : missingEnv ? "Vercel env values are missing." : "Views stored in Firestore date-wise."}
              </p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-600">{daysSince(syncStatus?.lastSyncedAt)}</p>
              <p className="mt-1 text-xs text-slate-500 dark:text-zinc-600">
                {syncStatus?.syncedDays || 0} days synced, {syncStatus?.skippedDays || 0} cached
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={syncAnalytics}
                disabled={syncing || missingEnv}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-black text-slate-900 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing" : "Sync Data"}
              </button>
              <div className="flex rounded-lg bg-slate-100 p-1 dark:bg-white/10">
                {(Object.keys(rangeLabels) as RangeMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => updateRange(mode)}
                    className={`h-8 rounded-md px-3 text-[11px] font-bold transition-colors ${
                      rangeMode === mode && !customDate ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" : "text-slate-500 hover:text-slate-950 dark:text-zinc-400 dark:hover:text-white"
                    }`}
                  >
                    {rangeLabels[mode]}
                  </button>
                ))}
              </div>
              <label className="flex h-9 items-center gap-2 rounded-lg bg-slate-100 px-3 text-[11px] font-black text-slate-900 dark:bg-white/10 dark:text-white">
                <CalendarDays className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="date"
                  value={customDate}
                  onChange={(event) => updateDate(event.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-900 outline-none dark:text-white"
                />
              </label>
            </div>
          </div>

          {error || syncStatus?.lastError ? (
            <p className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300">
              {error || syncStatus?.lastError}
            </p>
          ) : null}

          <div className="mt-8 h-[290px] overflow-hidden rounded-xl bg-slate-50 px-4 pb-4 pt-6 dark:bg-[#050814]">
            {loading || isFiltering ? (
              <ChartSkeleton />
            ) : chartTimeline.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-zinc-600">No analytics cached for this range.</div>
            ) : (
              <div className="grid h-full grid-cols-[44px_1fr] grid-rows-[1fr_28px] gap-x-3">
                <div className="flex h-[220px] flex-col justify-between text-right text-[10px] text-slate-400 dark:text-zinc-600">
                  {yLabels.map((label, index) => (
                    <span key={`${label}-${index}`}>{label}</span>
                  ))}
                </div>
                <div className="relative h-[220px]" onMouseLeave={() => setActivePoint(null)}>
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <span key={line} className="border-t border-dashed border-slate-200 dark:border-white/10" />
                    ))}
                  </div>
                  <svg viewBox="0 0 560 220" preserveAspectRatio="none" className="relative h-full w-full">
                    <defs>
                      <linearGradient id="analyticsArea" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#34d399" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
                      </linearGradient>
                    </defs>
                    <path d={chart.area} fill="url(#analyticsArea)" />
                    <path d={chart.line} fill="none" stroke="#34d399" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                    {chart.points.map((point) => (
                      <g key={point.date}>
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="14"
                          fill="transparent"
                          className="cursor-pointer"
                          onMouseEnter={() => setActivePoint(point)}
                          onFocus={() => setActivePoint(point)}
                          tabIndex={0}
                        />
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r={activePoint?.date === point.date ? "5" : "3"}
                          fill="#34d399"
                          stroke="rgba(255,255,255,0.85)"
                          strokeWidth="2"
                          className="pointer-events-none transition-all duration-200"
                          opacity={activePoint?.date === point.date ? 1 : 0.72}
                        />
                      </g>
                    ))}
                  </svg>
                  {activePoint ? (
                    <div
                      className={`pointer-events-none absolute z-20 min-w-40 rounded-xl border border-emerald-300/50 bg-white px-3 py-2 text-xs shadow-2xl shadow-emerald-950/10 ring-4 ring-emerald-400/10 dark:border-emerald-400/30 dark:bg-[#07111a] dark:shadow-black/40 ${
                        activePoint.x < 92
                          ? "translate-x-0"
                          : activePoint.x > 468
                            ? "-translate-x-full"
                            : "-translate-x-1/2"
                      } ${activePoint.y < 64 ? "translate-y-4" : "-translate-y-[calc(100%+14px)]"}`}
                      style={{
                        left: `${(activePoint.x / 560) * 100}%`,
                        top: `${(activePoint.y / 220) * 100}%`,
                      }}
                    >
                      <span
                        className={`absolute h-2.5 w-2.5 rotate-45 border-emerald-300/50 bg-white dark:border-emerald-400/30 dark:bg-[#07111a] ${
                          activePoint.y < 64
                            ? "bottom-full border-l border-t"
                            : "top-full border-b border-r"
                        } ${
                          activePoint.x < 92
                            ? "left-4"
                            : activePoint.x > 468
                              ? "right-4"
                              : "left-1/2 -translate-x-1/2"
                        } ${activePoint.y < 64 ? "translate-y-1/2" : "-translate-y-1/2"}`}
                      />
                      <p className="font-black text-slate-950 dark:text-white">{formatTooltipDate(activePoint.date)}</p>
                      <p className="mt-1 font-bold text-emerald-600 dark:text-emerald-300">Views: {activePoint.visitors.toLocaleString()}</p>
                      <p className="mt-0.5 text-slate-500 dark:text-zinc-400">Pageviews: {(activePoint.pageviews || 0).toLocaleString()}</p>
                    </div>
                  ) : null}
                </div>
                <div />
                <div className="flex items-center justify-between gap-3 text-[10px] text-slate-400 dark:text-zinc-600">
                  {xLabels.map((label) => (
                    <span key={label} className="truncate">
                      {formatAxisDate(label, rangeMode)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <CountryEngagement rows={analytics.countries} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <BreakdownPanel title="Devices" icon={Smartphone} rows={analytics.devices.map((item) => ({ label: item.device, visitors: item.visitors, percentage: item.percentage }))} />
        <BreakdownPanel title="Browsers" icon={Zap} rows={analytics.browsers.map((item) => ({ label: item.browser, visitors: item.visitors, percentage: item.percentage }))} />
        <BreakdownPanel title="Operating Systems" icon={MonitorSmartphone} rows={analytics.operatingSystems.map((item) => ({ label: item.os, visitors: item.visitors, percentage: item.percentage }))} />
      </div>
    </section>
  );
}
