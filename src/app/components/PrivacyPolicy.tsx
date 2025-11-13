import { Typography, Stack, List, ListItem } from "@mui/material";

export default function PrivacyPolicy() {
  return (
    <Stack spacing={2}>
      <Typography variant="body1">
        This Privacy Policy explains how{" "}
        <Typography component="span" fontWeight="bold">
          Visually.Me
        </Typography>{" "}
        (“we”, “our”, or “us”) collects, uses, and protects your personal
        information when you use our financial education and planning
        application (the “App”).
      </Typography>

      <Typography variant="h6">1. Information We Collect</Typography>
      <List dense>
        <ListItem>
          <Typography variant="body1">
            <Typography component="span" fontWeight="bold">
              Account Information:
            </Typography>{" "}
            Name, email address, and optional demographic details such as birth
            year, income range, or retirement age preferences.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            <Typography component="span" fontWeight="bold">
              Financial Profile Data:
            </Typography>{" "}
            Information you enter into calculators or simulations, such as
            savings, investment balances, contributions, or financial goals. We
            do not request or store sensitive financial account numbers or
            banking credentials.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            <Typography component="span" fontWeight="bold">
              Usage Data:
            </Typography>{" "}
            App navigation activity, calculator usage patterns, and general
            engagement metrics used to improve the educational experience.
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            <Typography component="span" fontWeight="bold">
              Device Information:
            </Typography>{" "}
            IP address, browser type, and operating system (collected
            automatically for analytics and security purposes).
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6">2. How We Use Your Information</Typography>
      <Typography variant="body1">We use the information collected to:</Typography>
      <List dense>
        <ListItem>
          <Typography variant="body1">
            Provide personalized financial education, projections, and insights;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Improve the accuracy and usability of calculators, tools, and visual
            dashboards;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Offer tailored content and user experiences based on your financial
            goals or input data;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Communicate important updates, new features, or policy changes;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Ensure compliance with applicable laws and regulations.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6">3. Children’s Privacy</Typography>
      <Typography variant="body1">
        Visually.Me is designed for adult users seeking financial education and
        planning insights. We do not knowingly collect personal information from
        individuals under 16. If you believe a minor has provided us information
        without consent, please contact us, and we will delete such data.
      </Typography>

      <Typography variant="h6">4. Data Sharing</Typography>
      <Typography variant="body1">
        We do not sell or rent your personal information. We may share data only
        in the following cases:
      </Typography>
      <List dense>
        <ListItem>
          <Typography variant="body1">
            With trusted service providers who support our operations (e.g.,
            hosting, analytics, email communications);
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            If required by law, regulation, or legal process;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            To protect the security, rights, or integrity of our users or the
            App.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6">5. Data Security</Typography>
      <Typography variant="body1">
        We use industry-standard technical and organizational measures to
        protect your information against unauthorized access, alteration,
        disclosure, or destruction. However, no online system can be guaranteed
        completely secure, and we cannot warrant absolute protection.
      </Typography>

      <Typography variant="h6">6. Data Retention</Typography>
      <Typography variant="body1">
        We retain personal data for as long as necessary to provide our services
        and comply with legal obligations. You may request deletion of your
        account and associated information by contacting us.
      </Typography>

      <Typography variant="h6">7. Your Rights</Typography>
      <Typography variant="body1">
        Depending on your jurisdiction, you may have rights such as:
      </Typography>
      <List dense>
        <ListItem>
          <Typography variant="body1">
            Accessing the personal data we hold about you;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Requesting corrections or updates to inaccurate information;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Requesting deletion of your account and associated data;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Restricting or objecting to certain types of data processing;
          </Typography>
        </ListItem>
        <ListItem>
          <Typography variant="body1">
            Requesting a copy of your personal data in a portable format.
          </Typography>
        </ListItem>
      </List>

      <Typography variant="h6">8. International Users</Typography>
      <Typography variant="body1">
        If you access the App from outside the United States, please note that
        your information may be processed and stored in the United States, where
        data protection laws may differ from those in your country.
      </Typography>

      <Typography variant="h6">9. Changes to This Policy</Typography>
      <Typography variant="body1">
        We may update this Privacy Policy periodically to reflect operational,
        legal, or regulatory changes. If we make significant updates, we will
        notify users via the App or by email. Continued use of the App after
        updates constitutes acceptance of the revised policy.
      </Typography>
    </Stack>
  );
}
