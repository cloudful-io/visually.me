import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
} from "@mui/material";

type LinkedPartnerCardProps = {
  partner: { display_name: string; avatar_url: string | null };
  onRevoke: () => void;
};

export function LinkedPartnerCard({
  partner,
  onRevoke,
}: LinkedPartnerCardProps) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 600, my: 2, mx: "auto" }} >
      <CardHeader
        avatar={
          <Avatar
            src={partner.avatar_url || undefined}
            alt={partner.display_name}
            sx={{ width: 56, height: 56 }}
            />
        }
        title={
          <Typography variant="h5" fontWeight={600}>
            {partner.display_name}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body1" mt={1} display="block" component="div">
          You currently have a linked account with <strong>{partner.display_name}</strong> on Visually.Me.  You are sharing a combined view of:
          <ul>
            <li>Retirement income and pensions</li>
            <li>Investment accounts</li>
            <li>Real estate properties</li>
          </ul>
          You can revoke this connection at any time.
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button
          color="error"
          variant="outlined"
          onClick={onRevoke}
          size="small"
        >
          Revoke Access
        </Button>
      </CardActions>
    </Card>
  );
}
