import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getData } from '../services/apiServices';

// Define columns for DataGrid
const columns = [
  { field: 'nim', headerName: 'NIM', width: 150 },
  { field: 'nama_mhs', headerName: 'Nama Mahasiswa', width: 200 },
  { field: 'semester', headerName: 'Semester', width: 150 },
  { field: 'tahun', headerName: 'Tahun', width: 150 },
  { field: 'ips', headerName: 'IPS', width: 100 },
  { field: 'ipk', headerName: 'IPK', width: 100 },
];

export default function IpkListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getData('ipk');  // Menggunakan fungsi getData untuk mengambil data IPK
        const formattedData = data.map((item, index) => ({
          id: index + 1,
          nim: item.nim,
          nama_mhs: item.MH?.nama_mhs,  // Mengambil nama mahasiswa
          semester: item.semester,
          tahun: item.tahun,
          ips: item.ips,
          ipk: item.ipk,
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
