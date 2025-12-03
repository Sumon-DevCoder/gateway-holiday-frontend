import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: "up" | "down";
  trendValue?: number;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
}: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {trend && trendValue && (
          <p
            className={`text-xs ${
              trend === "up" ? "text-green-600" : "text-red-600"
            } mt-1`}
          >
            {trend === "up" ? "+" : "-"}
            {trendValue}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
