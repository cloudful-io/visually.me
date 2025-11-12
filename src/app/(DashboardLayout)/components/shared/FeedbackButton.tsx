"use client";
import { useState } from "react";
import {
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Typography,
  Link,
  FormControl,
  FormHelperText,
  CircularProgress,
  Snackbar,
  Alert
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const [rating, setRating] = useState<number | null>(0);
  const [comments, setComments] = useState("");

  const executeRecaptcha = async () => {
    return new Promise<string>((resolve, reject) => {
      if (!(window as any).grecaptcha) return reject("reCAPTCHA not loaded");

      (window as any).grecaptcha?.ready(() => {
        (window as any).grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: "submit_feedback" })
          .then(resolve)
          .catch(reject);
      });
    });
  };

  const handleSubmit = async () => {
    try {
      const token = await executeRecaptcha();

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comments,
          pageUrl: window.location.href,
          token,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSnackbarMessage("Thank you submitting for your feedback!");
        setSnackbarSeverity("success");
        setOpen(false);
        setRating(0);
        setComments("");
      } else {
        setSnackbarMessage("Something went wrong. Please try again.");
        setSnackbarSeverity("error");
      }
    } catch {
      setSnackbarMessage("Network error. Please try again.");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <>
    {/* Hide CAPTCHA Terms of Use */}
    <style jsx global>{`
      .grecaptcha-badge {
        visibility: hidden !important;
      }
    `}</style>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="feedback"
        onClick={() => setOpen(true)}
        style={{ position: "fixed", bottom: 20, right: 20, zIndex: 9999 }}
      >
        <CommentIcon />
      </Fab>

      {/* Feedback Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>We Welcome Your Feedback!</DialogTitle>
        <DialogContent>
          {/* Rating */}
          <FormControl component="fieldset" margin="normal">
            <Rating
              name="feedback-rating"
              value={rating}
              onChange={(_, newValue) => setRating(newValue || 0)}
            />
            <FormHelperText>How is your experience so far (1 to 5 stars)?</FormHelperText>
          </FormControl>

          {/* Comments */}
          <TextField
            label="Comments"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            helperText="What do you like most about this website?"
          />
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ mt: 2, display: "block" }}
        >
            This site is protected by reCAPTCHA and the Google{" "}
            <Link href="https://policies.google.com/privacy" target="_blank" rel="noopener">
            Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="https://policies.google.com/terms" target="_blank" rel="noopener">
            Terms of Service
            </Link>{" "}
            apply.
        </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} color="primary">
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
