"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useGetMonthlyRevenueQuery } from "@/redux/api/features/dashboard/dashboardApi";
import { Loader2 } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  bookings: {
    label: "Bookings",
    color: "hsl(var(--chart-2))",
  },
  tours: {
    label: "Tours",
    color: "hsl(var(--chart-3))",
  },
  guests: {
    label: "Guests",
    color: "hsl(var(--chart-4))",
  },
};

export default function DashboardCharts() {
  // Fetch monthly revenue data from API
  const {
    data: revenueResponse,
    isLoading,
    error,
  } = useGetMonthlyRevenueQuery(6);

  // Loading state
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and booking trends</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-2 text-sm text-gray-600">Loading chart data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and booking trends</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">Failed to load chart data</p>
            <p className="mt-1 text-sm text-gray-600">
              Please try refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the data from response
  const revenueData = revenueResponse?.data || [];

  // Empty data state
  if (revenueData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Monthly revenue and booking trends</CardDescription>
        </CardHeader>
        <CardContent className="flex h-80 items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">No revenue data available</p>
            <p className="mt-1 text-sm text-gray-400">
              Data will appear once bookings are made
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Monthly revenue and booking trends (Last 6 months)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stackId="1"
                  stroke={chartConfig.revenue.color}
                  fill={chartConfig.revenue.color}
                  fillOpacity={0.6}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stackId="1"
                  stroke={chartConfig.bookings.color}
                  fill={chartConfig.bookings.color}
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
}
