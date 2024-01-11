import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'Name', headerName: 'Name', width: 130 },
  { field: 'Owner', headerName: 'Owner', width: 130 },
  { field: 'Source', headerName: 'Source', width: 150 },
  { field: 'SubSource', headerName: 'Sub Source', width: 190 },
  {
    field: 'LeadSource',
    headerName: 'Lead Source',
    width: 150,
    type: 'number',
    align: 'center',
  },
  {
    field: 'Engagement',
    headerName: 'Engagement',
    width: 150,
    type: 'number',
    align: 'center'
  },
  {
    field: 'CreatedAt',
    headerName: 'CreatedAt',
    width: 150,
  },
];

const rows = [
  {
    id: 1,
    Name: 'Gagan Chanra',
    Owner: 'Raju',
    Source: 'Direct Traffic',
    SubSource: 'Customer refernce',
    LeadSource: 35,
    Engagement: 35,
    CreatedAt: '27-07-2022',
  },
  {
    id: 2,
    Name: 'Cersei',
    Owner: 'Raju',
    Source: 'Direct Traffic',
    SubSource: 'Customer refernce',
    LeadSource: 42,
    Engagement: 35,
    CreatedAt: '27-07-2022',
  },
  {
    id: 3,
    Name: 'Jaime',
    Owner: 'Raju',
    Source: 'Direct Traffic',
    SubSource: 'Customer refernce',
    LeadSource: 45,
    Engagement: 35,
    CreatedAt: '27-07-2022',
  },
  {
    id: 4,
    Name: 'Arya',
    Owner: 'Raju',
    Source: 'Direct Traffic',
    SubSource: 'Customer refernce',
    LeadSource: 16,
    Engagement: 35,
    CreatedAt: '27-07-2022',
  },
  {
    id: 5,
    Name: 'Daenerys',
    Owner: 'Raju',
    Source: 'Direct Traffic',
    SubSource: 'Customer refernce',
    LeadSource: 29,
    Engagement: 35,
    CreatedAt: '27-07-2022',
  },
];

export default function DataTable() {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </div>
  );
}
