// Table.jsx
import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { getData } from '../services/apiServices';

const columns = (handleDetailClick) => [
  { field: 'nim', headerName: 'NIM', width: 250 },
  { field: 'nama_mhs', headerName: 'Nama Mahasiswa', width: 300 },
  { field: 'ips', headerName: 'IPS', width: 200 },
  { field: 'ipk', headerName: 'IPK', width: 200 },
  {
    field: 'action',
    headerName: 'Action',
    flex: 1,
    renderCell: (params) => (
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => handleDetailClick(params.row.nim)}
      >
        Lihat Detail
      </Button>
    ),
    sortable: false,
    filterable: false,
  },
];


export default function MahasiswaListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getData('mhs');
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          ...item,
        }));
        setRows(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = (nim) => {
    // Navigate to the route with NIM parameter
    navigate(`/mahasiswa/${nim}`);
  };

  return (
    <Box sx={{ height: '80vh', width: '100%', padding: '0 16px' }}>
      <DataGrid sx={{ padding: '0 5px'}}
        rows={rows}
        columns={columns(handleDetailClick)} // Pass function to handle click
        pageSize={5}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 }, 
          },
        }}
        
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
      />
    </Box>
  );
}