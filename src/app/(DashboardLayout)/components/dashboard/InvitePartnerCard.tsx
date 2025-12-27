import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
  Grid,
} from "@mui/material";
import { useState } from "react";

type Permissions = {
  incomes: boolean;
  real_estate: boolean;
};

type Props = {
  loading?: boolean;
  onSubmit: (email: string, permissions: Permissions) => void;
};

export function InvitePartnerCard({ loading, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    incomes: true,
    real_estate: true,
  });

  const togglePermission = (key: keyof Permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, permissions);
    setEmail("");
    setPermissions({ incomes: true, real_estate: true });
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 600, mx: "auto", mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <CardHeader
          title="Invite a Partner"
          subheader="Send an invitation to link financial data"
        />

        <CardContent>
          <TextField
            label="Partner Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            sx={{ mb: 3 }}
          />

          <Typography variant="subtitle1" mb={1}>
            Permissions
          </Typography>

          <Grid container spacing={1}>
            {Object.keys(permissions).map((key) => (
              <Grid size={{ xs: 12, sm: 6 }} key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions[key as keyof Permissions]}
                      onChange={() =>
                        togglePermission(key as keyof Permissions)
                      }
                    />
                  }
                  label={key.replace("_", " ").toUpperCase()}
                />
              </Grid>
            ))}
          </Grid>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invite"}
          </Button>
        </CardActions>
      </form>
    </Card>
  );
}
