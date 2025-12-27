import { 
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar, 
  Typography, 
  Button } from "@mui/material";

export function IncomingInviteCard({
  inviter,
  onAccept,
  onDeny,
}: {
  inviter?: { display_name: string; avatar_url: string | null };
  onAccept: () => void;
  onDeny: () => void;
}) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 600, my: 2, mx: "auto" }} >
      <CardHeader
        avatar={
          <Avatar
            src={inviter?.avatar_url || undefined}
            alt={inviter?.display_name}
            sx={{ width: 56, height: 56 }}
            />
        }
        title={
          <Typography variant="h5" fontWeight={600}>
            {inviter?.display_name}
          </Typography>
        }
      />
      <CardContent>
        <Typography variant="body1" mt={1} display="block" component="div">
          You have been invited to link accounts on Visually.Me.  By accepting, you will be able to share a combined view of:
          <ul>
            <li>Retirement income and pensions</li>
            <li>Investment accounts</li>
            <li>Real estate properties</li>
          </ul>
          You can revoke this connection at any time.
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="contained" onClick={onAccept}>
          Accept Invitation
        </Button>
        <Button variant="outlined" color="error" onClick={onDeny}>
          Decline
        </Button>
      </CardActions>
    </Card>
  );
}