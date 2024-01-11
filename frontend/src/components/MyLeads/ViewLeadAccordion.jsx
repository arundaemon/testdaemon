import * as React from 'react';
import "../../Crm.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

//pages
import InterestShown from './Accordion/InterestShown';
import RelatedTo from './Accordion/RelatedTo';
import ViewProductPurchased from './Accordion/ViewPurchased';

export default function ViewLeadAccordion(props) {
  let accordionsList = [
    { id: 1, title: "Interest shown", content: <InterestShown {...props}/> },
    { id: 2, title: "Related to", content: <RelatedTo {...props}/>},
    { id: 3, title: "Product Purchased", content: <ViewProductPurchased {...props}/>}
  ]



  return (
    <div>
      {accordionsList?.map((data, index) => (
        <Accordion key={index} className='cm_collapsable'>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            className='table-header'
          >
            <Typography style={{fontSize:14 , fontWeight:600}}  >{data?.title}</Typography>
          </AccordionSummary>
          <AccordionDetails className='listing-accordion-details' >
            {data?.content}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
}
