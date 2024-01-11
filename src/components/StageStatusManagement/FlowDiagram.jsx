import React, { useState,useEffect } from 'react';
import {Graph} from 'react-d3-graph';
import { Box } from "@mui/material";


const FlowDiagram = ({ data, handleIconClick,customLabel,onPositionChange, navigateToRuleMapping, handleRemoveIconClick }) => {
  
  console.log(customLabel, 'testcustomLabel')
  
  const [myConfig, setMyConfig] = useState({
    automaticRearrangeAfterDropNode:false,
    nodeHighlightBehavior: true,
    linkHighlightBehavior:true,
    highlightDegree:2,
    staticGraphWithDragAndDrop: true,
		directed: true,
    focusZoom: 1,
    maxZoom: 8,
    minZoom: 0.1,
    width:800,    
		node: {
      size:{
        width:3000,
        height: 380,
      },
      renderLabel:false,
      viewGenerator:customLabel,
		},
    link:{
      highlightColor:'#f45e29',
      highlightFontWeight:'bold',
      semanticStrokeWidth:true,
      strokeWidth:3,
      markerHeight:60,
      labelProperty:'label',
      renderLabel: true
    }
	});

  return (
    <Box sx={{ height: "500px" }}>
      {data && data.nodes && data.nodes.length > 0 && 
        <Graph
          id="flow-diagram"
          data={data}
          config={myConfig}
          //onClickLink={navigateToRuleMapping}
          //onClickNode={onAddNode}
          onNodePositionChange={onPositionChange}
        />
      }      
    </Box>
  )
}

export default FlowDiagram