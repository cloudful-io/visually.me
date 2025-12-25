import { Avatar, Stack, Divider, Box, Typography, Button } from "@mui/material";

export function IncomingInviteCard({
  link,
  inviter,
  onAccept,
  onDeny,
}: {
  link: any;
  inviter?: { display_name: string; avatar_url: string | null };
  onAccept: () => void;
  onDeny: () => void;
}) {
  return (
    <Box mb={3} p={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar
          src={inviter?.avatar_url || undefined}
          alt={inviter?.display_name}
          sx={{ width: 56, height: 56 }}
        />
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {inviter?.display_name || "Someone"} invited you to link accounts on Visually.Me.
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="body2" sx={{ mb: 2 }}>
        By accepting, you will be able to share a combined view of:
        <ul>
          <li>Retirement income and pensions</li>
          <li>Investment accounts</li>
          <li>Real estate properties</li>
        </ul>
        You can revoke this connection at any time.
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={onAccept}>
          Accept Invitation
        </Button>
        <Button variant="outlined" color="secondary" onClick={onDeny}>
          Decline
        </Button>
      </Stack>
    </Box>
  );
}