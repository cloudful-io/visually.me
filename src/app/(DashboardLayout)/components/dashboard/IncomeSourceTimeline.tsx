"use client";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
} from "@mui/lab";
import { Typography, Box, Chip } from "@mui/material";
import {
 IconCalendar, IconCoin, IconUser, IconBuildingBank, IconMilitaryRank, IconMapPin, IconUserPlus, IconList
} from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";

export type IncomeSourceTimelineItem = {
  id?: string;
  label: string;
  firstYear: number | null;
  type:
    | "retirement-savings"
    | "fers-pension"
    | "social-security"
    | "military-pension"
    | string;
};

type Props = {
  sources?: IncomeSourceTimelineItem[] | null;
  currentYear: number;
  retirementAge: number;   // age, not year
  birthYear: number;
};

type TimelineEvent = {
  label: string;
  type: string;
};

type TimelineYear = {
  year: number;
  events: TimelineEvent[];
};

export function IncomeSourceTimeline({
  sources,
  currentYear,
  retirementAge,
  birthYear,
}: Props) {
  const safeSources = sources ?? [];

  const retirementYear = birthYear + retirementAge;

  // Mapping type to icon
  const iconByType: Record<string, React.ElementType> = {
    "retirement-savings": IconCoin,
    "fers-pension": IconUser,
    "social-security": IconBuildingBank,
    "military-pension": IconMilitaryRank,
    "current": IconMapPin,
    "retirement": IconUserPlus,
    "summary": IconList,
  };
  
  const getTimelineDotIcon = (events: TimelineEvent[]) => {
    if (events.length === 1) {
        // Only one event → use its icon
        const Icon = iconByType[events[0].type] ?? IconCoin;
        return <Icon size={20} />;
    }

    // Multiple events → prioritize current first, then retirement, then summary
    const hasCurrent = events.find((e) => e.type === "current");
    if (hasCurrent) {
        const Icon = iconByType["current"];
        return <Icon size={20} />;
    }

    const hasRetirement = events.find((e) => e.type === "retirement");
    if (hasRetirement) {
        const Icon = iconByType["retirement"];
        return <Icon size={20} />;
    }

    // Otherwise, generic summary icon
    const Icon = iconByType["summary"];
    return <Icon size={20} />;
    };


  /* ------------------------------
     Build timeline grouped by year
  -------------------------------*/
  const yearMap = new Map<number, TimelineEvent[]>();

  // Today
  yearMap.set(currentYear, [{ label: "Today", type: "current" }]);

  // Retirement
  yearMap.set(retirementYear, [
    { label: "Target Retirement Age", type: "retirement" },
  ]);

  // Income sources
  safeSources
    .filter((s) => s.firstYear != null)
    .forEach((s) => {
      const year = s.firstYear!;
      const events = yearMap.get(year) ?? [];
      events.push({ label: s.label, type: s.type });
      yearMap.set(year, events);
    });

  const timelineYears: TimelineYear[] = Array.from(yearMap.entries())
    .map(([year, events]) => ({ year, events }))
    .sort((a, b) => a.year - b.year);

  if (timelineYears.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No timeline data available.
      </Typography>
    );
  }

  return (
    <DashboardCard
      title={
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <IconCalendar />
            Financial Timeline
        </Box>
      }
    >
  <Timeline position="alternate-reverse">
  {timelineYears.map((item, index) => {
    const nextYear = timelineYears[index + 1]?.year ?? item.year;
    const deltaYears = nextYear - item.year;

    const height = Math.max(20, deltaYears * 20);

    return (
      <TimelineItem
        key={item.year}
        sx={{ minHeight: height }}
      >
        <TimelineSeparator>
          <TimelineDot color="info">
            {getTimelineDotIcon(item.events)}
          </TimelineDot>
          {index < timelineYears.length - 1 && <TimelineConnector />}
        </TimelineSeparator>

        <TimelineContent>
          <Box>
            <Chip
              size="small"
              label={String(item.year)}
              variant="filled"
              color="secondary"
              sx={{ mb: 0.75 }}
            />

            {item.events.map((event, i) => (
              <Typography key={i} variant="body2">
                {item.events.length > 1 ? `• ` : ""}
                {event.label}
              </Typography>
            ))}
          </Box>
        </TimelineContent>
      </TimelineItem>
    );
  })}
</Timeline>
</DashboardCard>
);
}
