import { Alert } from '@mui/material';

export default function Footer() {
  return (
    <footer className="sticky bottom-0 border-t text-center text-sm py-4">
        <Alert severity='warning'>
            <strong>Disclaimer:</strong> The financial calculators and content on this website are for informational and educational purposes only. They are not intended as financial, tax, or investment advice. All results are estimates based on the data you provide and assumptions made by the model. Actual outcomes may vary significantly. Please consult a licensed financial advisor before making any financial decisions.
        </Alert>
    </footer>
  )
}