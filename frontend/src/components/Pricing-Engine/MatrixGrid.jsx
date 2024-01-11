// import React from 'react'
// import { HeatMapGrid } from 'react-grid-heatmap'

// const xLabels = new Array(5).fill(0).map((_, i) => `${i + 1}`)
// const yLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']

// const data = [
//   [
//     [ 'Recorded as Live', '21000', '19000' ],
//     [ 'Hybrid', '25000', '13000' ]
//   ],
//   [
//     [ 'Recorded as Live', '12000', '11000' ],
//     [ 'Hybrid', '23000', '21000' ]
//   ]
// ]


// const MatrixChart = () => {
//   return (
//     <div
//       style={{
//         width: '100%'
//       }}
//     >
//       <HeatMapGrid
//         data={data}
//         xLabels={xLabels}
//         yLabels={yLabels}
//         // Reder cell with tooltip
//         cellRender={(x, y, value) => (
//           <div title={`Pos(${x}, ${y}) = ${value}`}>
//             <span>X: {xLabels[x]}</span> {/* Show X value */}
//             <br />
//             <span>Y: {yLabels[y]}</span> {/* Show Y value */}
//             <br />
//             {value}
//           </div>
//         )}
//         xLabelsStyle={(index) => ({
//           color: index % 2 ? 'transparent' : '#777',
//           fontSize: '.8rem'
//         })}
//         yLabelsStyle={() => ({
//           fontSize: '.7rem',
//           textTransform: 'uppercase',
//           color: '#777'
//         })}
//         cellStyle={(_x, _y, ratio) => ({
//           background: `rgb(12, 160, 44, ${ratio})`,
//           fontSize: '.8rem',
//           color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`
//         })}
//         cellHeight='2rem'
//         xLabelsPos='bottom'
//         onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
//         yLabelsPos='left'
//         square
//       />
//     </div>
//   )
// }

// export default MatrixChart;
