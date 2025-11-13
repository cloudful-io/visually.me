import { Typography, Stack, List, ListItem } from "@mui/material";

export default function TermsOfUse() {
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        Welcome to <strong>Visually.Me</strong> (“we,” “our,” “us”). These Terms
        of Use (“Terms”) govern your access to and use of our financial
        calculator application and related services (“App”). By creating an
        account or using the App, you agree to these Terms. If you do not agree,
        please do not use the App.
      </Typography>

      <Typography variant="h6">1. Eligibility</Typography>
      <Typography variant="body1">
        You must be at least 18 years old to use Visually.Me. By using the App,
        you represent that you have the legal capacity to enter into this
        agreement. The App is intended for personal financial planning and
        educational purposes — it does not provide professional financial,
        investment, or tax advice.
      </Typography>

      <Typography variant="h6">2. Accounts</Typography>
      <Typography variant="body1">
        To use certain features, you may need to create an account and provide
        accurate information. You are responsible for maintaining the security
        of your credentials and for all activities that occur under your
        account. If you suspect unauthorized access, notify us immediately.
      </Typography>

      <Typography variant="h6">3. Acceptable Use</Typography>
      <Typography variant="body1">
        When using Visually.Me, you agree not to:
      </Typography>
      <List dense>
        <ListItem>
          <Typography variant="body1">
            Use the App for unlawful, fraudulent, or misleading purposes;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Attempt to disrupt, hack, or reverse-engineer any part of the App;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Share false or malicious data that could affect App functionality;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Misuse personal or financial data belonging to others;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Circumvent or attempt to bypass security or access controls.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6">4. Data Privacy</Typography>
      <Typography variant="body1">
        We value your privacy. Financial and personal information entered into
        Visually.Me is used solely to generate your calculations and improve
        your user experience. We do not sell or share your personal or financial
        data with third parties for advertising purposes.
      </Typography>
      <Typography variant="body1">
        You are responsible for the accuracy of the data you enter. Our results
        are based entirely on your inputs and assumptions.
      </Typography>

      <Typography variant="h6">5. Content and Intellectual Property</Typography>
      <Typography variant="body1">
        All software, design elements, and financial calculators provided within
        Visually.Me are owned by us or our licensors. You may use the App’s
        tools for personal or internal business analysis but may not copy,
        modify, resell, redistribute, or sublicense them without our written
        consent.
      </Typography>

      <Typography variant="h6">6. Service Availability</Typography>
      <Typography variant="body1">
        We strive to keep Visually.Me reliable and accessible, but we do not
        guarantee uninterrupted service. We may update, suspend, or discontinue
        parts of the App at any time without prior notice. We are not liable for
        any loss resulting from downtime or technical issues.
      </Typography>

      <Typography variant="h6">7. Disclaimer of Warranties</Typography>
      <Typography variant="body1">
        The App is provided{" "}
        <Typography component="span" fontWeight="bold">
          “as is”
        </Typography>{" "}
        and{" "}
        <Typography component="span" fontWeight="bold">
          “as available”
        </Typography>
        , without warranties of any kind. We make no representations that the
        App’s calculations or projections are accurate, reliable, or suitable
        for making real-world financial decisions. Always consult a qualified
        financial advisor before making major financial choices.
      </Typography>

      <Typography variant="h6">8. Limitation of Liability</Typography>
      <Typography variant="body1">
        To the fullest extent permitted by law, we are not liable for indirect,
        incidental, special, or consequential damages arising from your use of
        Visually.Me. Our total liability will not exceed the greater of (a) the
        amount you paid for premium services (if any) in the past 12 months or
        (b) $100 if you used the App for free.
      </Typography>

      <Typography variant="h6">9. Termination</Typography>
      <Typography variant="body1">
        We may suspend or terminate your account if you violate these Terms or
        misuse the App. You may stop using Visually.Me at any time. Upon
        termination, all rights granted to you will immediately cease.
      </Typography>

      <Typography variant="h6">10. Changes to These Terms</Typography>
      <Typography variant="body1">
        We may modify these Terms from time to time. If we make material
        changes, we will notify you through the App or via email. Continued use
        after such updates constitutes your acceptance of the new Terms.
      </Typography>

      <Typography variant="h6">11. Governing Law</Typography>
      <Typography variant="body1">
        These Terms are governed by the laws of{" "}
        <Typography component="span" fontWeight="bold">
          Fairfax, VA
        </Typography>
        . Any disputes will be handled in the courts of{" "}
        <Typography component="span" fontWeight="bold">
          Fairfax, VA
        </Typography>
        , unless otherwise required by law.
      </Typography>
    </Stack>
  );
}
