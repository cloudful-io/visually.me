import {
 IconCoin, IconUser, IconBuildingBank
} from "@tabler/icons-react";

export const IncomeSourcesIcon: Record<string, React.ReactNode> = {
  "retirement-savings": <IconCoin size={20}/>,
  "social-security": <IconBuildingBank size={20} />,
  "fers-pension": <IconUser size={20} />,
};