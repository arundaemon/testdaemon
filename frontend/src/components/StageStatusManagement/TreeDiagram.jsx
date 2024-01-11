import React from 'react';
import Tree from 'react-d3-tree';
import { Box } from "@mui/material";
import PlusIcon from '../../assets/image/plusIcon.svg'
import MinusIcon from '../../assets/image/minusIcon.svg'

const FlowDiagram = ({ data, handleIconClick, navigateToRuleMapping, handleRemoveIconClick }) => {
  // console.log("data inside flowdigram",data)
  const handleOnRuleClick = () => {

  }

  const customElement = ({
    nodeDatum,
    toggleNode }) => {
    // console.log("nodeDatum", nodeDatum)
    return <g x="-50" >
      <rect
        width="250"
        height="38"
        y="-27"
        x="0"
        style={{ fill: "#fff" }}
        stroke="#000"
        strokeWidth={1}
        strokeOpacity={1}
      >
      </rect>
      <foreignObject x="0" y="-20" width="250" height="100">
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 20px' }}>
          <p style={{ fontSize: 14 }}>{nodeDatum.name}</p>
          <div style={{ display: 'flex' }}>
            <img onClick={() => handleRemoveIconClick(nodeDatum.id)} style={{ marginRight: 10 }} src={MinusIcon} alt="Minus Icon" />
            <img onClick={() => handleIconClick(nodeDatum.id)} src={PlusIcon} alt="Plus Icon" />
          </div>
        </div>
        {/* <img className='add-new-rule-plus' onClick={() => navigateToRuleMapping(nodeDatum.id)} style={{ position: 'absolute', top: 55, left: 110 }} src={PlusIcon} alt="" /> */}
      </foreignObject>

      <svg
        onClick={() => navigateToRuleMapping(nodeDatum.id)}
        y="-46" x="111" className='add-new-rule-plus'
        xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19">
        <g id="Group_164689" data-name="Group 164689" transform="translate(-636.5 -880)">
          <rect id="Rectangle_18301" data-name="Rectangle 18301" width="19" height="19" rx="2" transform="translate(636.5 880)" fill="#f45e29" />
          <path id="Path_82389" data-name="Path 82389" d="M13.524,10.246H10.246v3.279a.656.656,0,0,1-1.311,0V10.246H5.656a.656.656,0,0,1,0-1.311H8.934V5.656a.656.656,0,0,1,1.311,0V8.934h3.279a.656.656,0,1,1,0,1.311Z" transform="translate(636.5 880)" fill="#fff" />
        </g>
      </svg>



      {/* <svg
        className='add-new-rule-plus'
        xmlns="http://www.w3.org/2000/svg"
        width="15"
        height="15"
        y="-40"
        x="111"
        fill='#F45E29'
        viewBox="0 0 24 24"
        onClick={() => navigateToRuleMapping(nodeDatum.id)}
      >
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
      </svg> */}

      {/* <svg
        className='add-new-node-plus'
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        y="5"
        x="100"
        fill='#F45E29'
        viewBox="0 0 24 24"
        onClick={() => handleIconClick(nodeDatum.id)}
      >
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
      </svg> */}

      {/* <svg xmlns="http://www.w3.org/2000/svg"
        className='remove-new-node-plus'
        width="40"
        height="20"
        y="11"
        x="120"
        fill='#ff00000'
        viewBox="0 0 24 24"
        onClick={() => handleRemoveIconClick(nodeDatum.id)}
      >
        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
        <g>

          <line
            x1="0"
            y1="0"
            x2="150"
            y2="0"
            fill='#ff0000'
            strokeWidth={20}></line>
        </g>
      </svg> */}

    </g>
  }

  return (
    <Box sx={{ height: "500px" }}>
      <Tree
        data={data}
        // collapsible={true}
        orientation="vertical"
        pathFunc="step"
        pathClassFunc={() => 'react-3d-tree-custom-link'}
        renderCustomNodeElement={customElement}
        zoomable={true}
        rootNodeClassName="node__root"
        branchNodeClassName="node__branch"
        leafNodeClassName="node__leaf"
        onLinkClick={(e) => console.log("clicked", e)}
        nodeSize={{ x: 300, y: 150 }}
        // enableLegacyTransitions={true}
        translate={{
          x: 420,
          y: 100
        }}
      />
    </Box>
  )
}

export default FlowDiagram