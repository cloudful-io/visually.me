"use client";
import React from "react";
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
  IconCalendar,
  IconCoin,
  IconUser,
  IconBuildingBank,
  IconMilitaryRank,
  IconMapPin,
  IconUserPlus,
  IconList,
  IconHome,
  IconHeart,
} from "@tabler/icons-react";
import DashboardCard from "../shared/DashboardCard";

export type TimelineItemType =
  | "income"
  | "retirement-savings"
  | "fers-pension"
  | "social-security"
  | "military-pension"
  | "real-estate"
  | "mortgage-end"
  | "current"
  | "retirement"
  | "life-expectancy"
  | "summary";

export type IncomeSourceTimelineItem = {
  id?: string;
  label: string;
  firstYear: number | null;
  type: TimelineItemType;
};

export type RealEstateTimelineItem = {
  id?: string;
  label: string;
  startYear: number | null;
  mortgageEndYear?: number | null;
};

type TimelineEvent = {
  label: string;
  type: TimelineItemType;
};

type TimelineYear = {
  year: number;
  events: TimelineEvent[];
};

type Props = {
  incomeSources?: any[] | null;
  realEstateProperties?: any[] | null;
  currentYear: number;
  retirementAge?: number;
  birthYear?: number;
  lifeExpectancyAge?: number;
};

export function FinancialTimeline({
  incomeSources,
  realEstateProperties,
  currentYear,
  retirementAge,
  birthYear,
  lifeExpectancyAge,
}: Props) {
  const yearMap = new Map<number, TimelineEvent[]>();

  // Add current year
  yearMap.set(currentYear, [{ label: "Today", type: "current" }]);

  // Add retirement year if birthYear and retirementAge provided
  if (birthYear != null && retirementAge != null) {
    const retirementYear = birthYear + retirementAge;
    yearMap.set(retirementYear, [{ label: "Target Retirement Age", type: "retirement" }]);
  }

  // Add life expectancy age if it is provided
  if (birthYear != null && lifeExpectancyAge != null) {
    const lifeExpectancyYear = birthYear + lifeExpectancyAge;
    yearMap.set(lifeExpectancyYear, [{ label: "Life Expectancy Age", type: "life-expectancy" }]);
  }

  // Add income sources
  (incomeSources ?? [])
    .filter((s) => s.firstYear != null)
    .forEach((s) => {
      const events = yearMap.get(s.firstYear!) ?? [];
      events.push({ label: s.label, type: s.type as TimelineItemType });
      yearMap.set(s.firstYear!, events);
    });
  // Add real estate properties
  (realEstateProperties ?? []).forEach((p) => {
    if (p.mergedFields.mortgageEndYear != null) {
      const events = yearMap.get(p.mergedFields.mortgageEndYear) ?? [];
      events.push({ label: `${p.label} Mortgage Payoff`, type: "mortgage-end" });
      yearMap.set(p.mergedFields.mortgageEndYear, events);
    }
  });

  // Sort years
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

  // Icon mapping
  const iconByType: Record<TimelineItemType, React.ElementType> = {
    "retirement-savings": IconCoin,
    "fers-pension": IconUser,
    "social-security": IconBuildingBank,
    "military-pension": IconMilitaryRank,
    "current": IconMapPin,
    "retirement": IconUserPlus,
    "summary": IconList,
    "real-estate": IconHome,
    "mortgage-end": IconHome,
    "life-expectancy": IconHeart,
    "income": IconCoin,
  };

  const getTimelineDotIcon = (events: TimelineEvent[]) => {
    if (events.length === 1) {
      const Icon = iconByType[events[0].type] ?? IconCoin;
      return <Icon size={20} />;
    }

    // Prioritize current > retirement > mortgage-end > summary
    const priority: TimelineItemType[] = ["current", "retirement", "mortgage-end", "summary"];
    for (const type of priority) {
      const e = events.find((ev) => ev.type === type);
      if (e) return React.createElement(iconByType[type], { size: 20 });
    }

    return <IconList size={20} />;
  };

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
            <TimelineItem key={item.year} sx={{ minHeight: height }}>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    item.events.some((e) => ["retirement"].includes(e.type))
                      ? "info"
                      : item.events.some((e) => ["life-expectancy"].includes(e.type))
                      ? "error"
                      : item.events.some((e) => ["mortgage-end"].includes(e.type)) ? "success" : 
                      "grey"
                  }
                >
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
                      {item.events.length > 1 ? "• " : ""}
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
