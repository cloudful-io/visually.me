'use client';
import { useRouter } from "next/navigation";
import { FormControlLabel, Switch } from "@mui/material";
import { usePathname } from "next/navigation";

type ScenarioModeToggleProps = {
  calculatorRoute: string;
  scenarioRoute: string;
};

const ScenarioModeToggle = ({ calculatorRoute, scenarioRoute }: ScenarioModeToggleProps) => {
  const router = useRouter();
  const pathname = usePathname().toLowerCase();
  
  return (
    <FormControlLabel
      control={
        <Switch
          aria-label="Switch to Scenario Mode"
          checked={pathname === scenarioRoute}
          onChange={(e) => {
            if (e.target.checked) {
              router.push(scenarioRoute);
            }
            else {
              router.push(calculatorRoute)
            }
          }}
        />
      }
      label="Scenario Mode"
      sx={{ ml: 2, whiteSpace: "nowrap" }}
    />
  );
};

export default ScenarioModeToggle;
