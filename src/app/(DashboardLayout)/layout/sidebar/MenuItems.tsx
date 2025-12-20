import {
  IconHome,
  IconLayoutDashboard,
  IconCash,
} from "@tabler/icons-react";
import { uniqueId } from "lodash";
import { calculatorRegistry } from "@/lib/calculators/registry";

const calculatorMenuItems = Object.values(calculatorRegistry).map((entry) => ({
  id: uniqueId(),
  title: entry.config.shortTitle,
  icon: entry.config.icon,
  href: entry.config.calculatorRoute,
  authRequired: false,
}));

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
    id: uniqueId(),
    title: "Income and Investment",
    icon: IconCash,
    href: "/income",
    authRequired: true,
  },
  {
    id: uniqueId(),
    title: "Real Estate Properties",
    icon: IconHome,
    href: "/real-estate",
    authRequired: true,
  },
  {
    navlabel: true,
    subheader: "CALCULATORS",
    authRequired: false,
  },
  ...calculatorMenuItems,
];

export default Menuitems;