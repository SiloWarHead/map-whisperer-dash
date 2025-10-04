import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
    label: string;
  };
}

export const MetricCard = ({
  title,
  subtitle,
  value,
  unit,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
}: MetricCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.direction === "up") return "↑";
    if (trend.direction === "down") return "↓";
    return "→";
  };

  return (
    <div className="metric-card">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`w-6 h-6 ${iconColor}`} />
          </div>
        </div>
        
        <div>
          <p className="text-4xl font-bold text-card-foreground">
            {value} <span className="text-lg font-normal text-muted-foreground">{unit}</span>
          </p>
          
          {trend && (
            <div className="flex items-center mt-3">
              <span className={`flex items-center text-sm font-medium ${
                trend.direction === "up" ? "text-secondary" : 
                trend.direction === "down" ? "text-destructive" : 
                "text-muted-foreground"
              }`}>
                {getTrendIcon()} {trend.value}
              </span>
              <span className="text-sm text-muted-foreground ml-2">{trend.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
