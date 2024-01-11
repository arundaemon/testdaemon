import * as React from 'react';
import "../Crm.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BasicTable from '../components/menuManagement/BasicTable';

export default function SimpleAccordion() {
  let accordionsList = [
    { id: 1, title: "Interest shown", content: <BasicTable /> },
    { id: 2, title: "Related to", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget." },
    { id: 3, title: "Product Purchased", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget." }
  ]



  return (
    <div>
      {accordionsList?.map((data, i) => (
        <Accordion className='cm_collapsable'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className='table-header'
          >
            <Typography style={{fontSize:14 , fontWeight:600}}  >{data?.title}</Typography>
          </AccordionSummary>
          <AccordionDetails className='listing-accordion-details' >
            <Typography>
              {data?.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
