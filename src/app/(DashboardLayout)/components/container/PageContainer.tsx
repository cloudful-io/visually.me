import { Typography, Divider } from '@mui/material';

type Props = {
  description?: string;
  children: React.ReactNode;
  title?: string;
  showTitle?: boolean;
};

const PageContainer = ({ title, description, children, showTitle = false }: Props) => (
  <div>
    <title>{title}</title>
    <meta name="description" content={description} />
    {showTitle && title && (
      <>
        <Typography variant="h2" sx={{mb:1}}>
          {title}
        </Typography>
        <Divider sx={{ my: 2 }} />
      </>
    )}
    {children}
  </div>
);

export default PageContainer;
