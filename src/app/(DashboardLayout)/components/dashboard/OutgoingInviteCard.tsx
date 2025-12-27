import { 
  Card,
  CardHeader,
  CardContent,
  CardActions, 
  Avatar, 
  Typography, 
  Button } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

export function OutgoingInviteCard({
  partnerEmail,
  onRevoke,
}: {
  partnerEmail: string;
  onRevoke: () => void;
}) {
  return (
    <Card variant="outlined" sx={{ maxWidth: 600, my: 2, mx: "auto" }} >
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: "grey.300", color: "grey.700" }}>
            <MailOutlineIcon />
          </Avatar>
        }
        title={
          <>
            <Typography variant="subtitle1" fontWeight={600}>
              Invitation sent
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Waiting for {partnerEmail} to accept
            </Typography>
          </>
        }
      />
      <CardContent>
        <Typography variant="body1" mt={1} display="block" component="div">
          We have sent an invitation to <strong>{partnerEmail}</strong>.
          Once they accept, you will both be able to view shared retirement income,
          investments, and real estate in one place.
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="outlined" color="error" onClick={onRevoke}>
          Cancel Invitation
        </Button>
      </CardActions>
    </Card>

  );
}
