"use client";

import {
  LineChart as RechartsLineChart,
  Line,
  BarChart as RechartsBarChart,
  Bar,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: Record<string, unknown>[];
  title?: string;
  subtitle?: string;
  source?: string;
  notes?: string;
  xKey: string;
  yKeys: { key: string; label: string; color?: string }[];
  height?: number;
}

const defaultColors = [
  "#2563eb",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

function ChartWrapper({
  title,
  subtitle,
  source,
  notes,
  children,
}: {
  title?: string;
  subtitle?: string;
  source?: string;
  notes?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
              {title}
            </h4>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {children}

      {(source || notes) && (
        <div className="mt-3 space-y-1">
          {source && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500">
              Source: {source}
            </p>
          )}
          {notes && (
            <p className="text-[10px] text-gray-400 dark:text-gray-500 italic">
              {notes}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const tooltipStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.97)",
  border: "1px solid #e5e5e5",
  borderRadius: "6px",
  fontSize: "12px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

export function LineChartComponent({
  data,
  title,
  subtitle,
  source,
  notes,
  xKey,
  yKeys,
  height = 300,
}: ChartProps) {
  return (
    <ChartWrapper title={title} subtitle={subtitle} source={source} notes={notes}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e5e5" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          {yKeys.map((y, i) => (
            <Line
              key={y.key}
              type="monotone"
              dataKey={y.key}
              name={y.label}
              stroke={y.color || defaultColors[i % defaultColors.length]}
              strokeWidth={2}
              dot={{ r: 3, strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function BarChartComponent({
  data,
  title,
  subtitle,
  source,
  notes,
  xKey,
  yKeys,
  height = 300,
}: ChartProps) {
  return (
    <ChartWrapper title={title} subtitle={subtitle} source={source} notes={notes}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e5e5" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          {yKeys.map((y, i) => (
            <Bar
              key={y.key}
              dataKey={y.key}
              name={y.label}
              fill={y.color || defaultColors[i % defaultColors.length]}
              radius={[2, 2, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export function AreaChartComponent({
  data,
  title,
  subtitle,
  source,
  notes,
  xKey,
  yKeys,
  height = 300,
}: ChartProps) {
  return (
    <ChartWrapper title={title} subtitle={subtitle} source={source} notes={notes}>
      <ResponsiveContainer width="100%" height={height}>
        <RechartsAreaChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
          <XAxis
            dataKey={xKey}
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={{ stroke: "#e5e5e5" }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#737373" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          />
          {yKeys.map((y, i) => (
            <Area
              key={y.key}
              type="monotone"
              dataKey={y.key}
              name={y.label}
              stroke={y.color || defaultColors[i % defaultColors.length]}
              fill={y.color || defaultColors[i % defaultColors.length]}
              fillOpacity={0.1}
              strokeWidth={2}
            />
          ))}
        </RechartsAreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeDirection?: "up" | "down" | "neutral";
  description?: string;
}

export function StatCard({
  label,
  value,
  change,
  changeDirection = "neutral",
  description,
}: StatCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-5">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-serif font-light text-gray-900 dark:text-gray-50 tabular-nums">
          {value}
        </p>
        {change && (
          <span
            className={`text-xs font-medium ${
              changeDirection === "up"
                ? "text-green-600 dark:text-green-400"
                : changeDirection === "down"
                ? "text-red-600 dark:text-red-400"
                : "text-gray-400"
            }`}
          >
            {changeDirection === "up" && "↑"}
            {changeDirection === "down" && "↓"}
            {change}
          </span>
        )}
      </div>
      {description && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
}

interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: "completed" | "active" | "upcoming";
}

interface TimelineProps {
  items: TimelineItem[];
}

export function TimelineChart({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800" />

      <div className="space-y-6">
        {items.map((item, i) => (
          <div key={i} className="relative flex items-start gap-4 pl-9">
            {/* Dot */}
            <div
              className={`absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 ${
                item.status === "active"
                  ? "border-blue-600 bg-blue-600"
                  : item.status === "upcoming"
                  ? "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
                  : "border-gray-400 dark:border-gray-500 bg-gray-400 dark:bg-gray-500"
              }`}
            />

            <div className="min-w-0 flex-1 pb-2">
              <p className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
                {item.date}
              </p>
              <p
                className={`text-sm font-medium mt-0.5 ${
                  item.status === "active"
                    ? "text-gray-900 dark:text-gray-50"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {item.title}
              </p>
              {item.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {item.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
