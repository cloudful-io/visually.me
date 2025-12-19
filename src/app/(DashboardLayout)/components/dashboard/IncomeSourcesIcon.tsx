import { fersPensionConfig } from "@/configs/fersPension";
import { militaryPensionConfig } from "@/configs/militaryPension";
import { retirementSavingsConfig } from "@/configs/retirementSavings";
import { socialSecurityConfig } from "@/configs/socialSecurityBenefits";

const IconFersPension = fersPensionConfig.icon;
const IconMilitaryPension = militaryPensionConfig.icon;
const IconRetirementSavings = retirementSavingsConfig.icon;
const IconSocialSecurity = socialSecurityConfig.icon;

export const IncomeSourcesIcon: Record<string, React.ReactNode> = {
  "retirement-savings": <IconRetirementSavings size={20}/>,
  "social-security": <IconSocialSecurity size={20} />,
  "fers-pension": <IconFersPension size={20} />,
  "military-pension": <IconMilitaryPension size={20}/>
};