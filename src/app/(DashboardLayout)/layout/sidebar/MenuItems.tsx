import {
  IconHome,
  IconLayoutDashboard,
  IconUser,
  IconBuildingBank,
  IconSchool,
  IconCoin,
  IconCalculator
} from "@tabler/icons-react";
import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "HOME",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },

  {
    navlabel: true,
    subheader: "CALCULATORS",
  },
  {
    id: uniqueId(),
    title: "All Calculators",
    icon: IconCalculator,
    href: "/calculators",
  },
  {
    id: uniqueId(),
    title: "College Tuition",
    icon: IconSchool,
    href: "/calculators/college-tuition",
  },
  {
    id: uniqueId(),
    title: "FERS Pension",
    icon: IconUser,
    href: "/calculators/fers-pension",
  },
  {
    id: uniqueId(),
    title: "Mortgage Amortization",
    icon: IconHome,
    href: "/calculators/mortgage",
  },
  {
    id: uniqueId(),
    title: "Retirement Savings",
    icon: IconCoin,
    href: "/calculators/retirement-savings",
  },
  {
    id: uniqueId(),
    title: "Social Security Benefits",
    icon: IconBuildingBank,
    href: "/calculators/social-security",
  },
];

export default Menuitems;
