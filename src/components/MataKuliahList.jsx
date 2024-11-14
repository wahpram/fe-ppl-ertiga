import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getData } from '../services/apiServices';

// Define columns for DataGrid
const columns = [
  { field: 'id_mk', headerName: 'ID Mata Kuliah', width: 250 },
  { field: 'nama_mk', headerName: 'Nama Mata Kuliah', width: 300 },
  { field: 'sks', headerName: 'SKS', width: 150 },
];

export default function MataKuliahListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getData('mk');
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

  return (
    <Box sx={{ height: '80vh', width: '100%', padding: '0 16px' }}>
      <DataGrid sx={{ padding: '0 5px'}}
        rows={rows}
        columns={columns}
        pageSize={5}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
      />
    </Box>
  );
}
