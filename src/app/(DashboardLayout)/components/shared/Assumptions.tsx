'use client';
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheveronRightIcon from "@mui/icons-material/ChevronRight";

type AssumptionsProps = {
  title?: string;
  items: (string | React.ReactNode)[];
};

const Assumptions = ({ title = "Assumptions", items }: AssumptionsProps) => (
  <Accordion>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="assumptions-content"
      id="assumptions-header"
    >
      <Typography component="span" variant="h6">{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <List>
        {items.map((item, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemIcon>
              <CheveronRightIcon />
            </ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </AccordionDetails>
  </Accordion>
);

export default Assumptions;
