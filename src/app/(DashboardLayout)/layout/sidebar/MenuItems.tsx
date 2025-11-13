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
    authRequired: true,
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
    authRequired: true,
  },

  {
    navlabel: true,
    subheader: "CALCULATORS",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "All Calculators",
    icon: IconCalculator,
    href: "/calculators",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "College Tuition",
    icon: IconSchool,
    href: "/calculators/college-tuition",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "FERS Pension",
    icon: IconUser,
    href: "/calculators/fers-pension",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "Mortgage Amortization",
    icon: IconHome,
    href: "/calculators/mortgage",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "Retirement Savings",
    icon: IconCoin,
    href: "/calculators/retirement-savings",
    authRequired: false,
  },
  {
    id: uniqueId(),
    title: "Social Security Benefits",
    icon: IconBuildingBank,
    href: "/calculators/social-security",
    authRequired: false,
  },
];

export default Menuitems;
