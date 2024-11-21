import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getData } from '../services/apiServices';

const columns = [
  { field: 'nim', headerName: 'NIM', flex: 1 },
  { field: 'nama_mhs', headerName: 'Nama Mahasiswa', flex: 1.5 },
  { field: 'semester', headerName: 'Semester', flex: 1 },
  { field: 'tahun', headerName: 'Tahun', flex: 1 },
  { field: 'ips', headerName: 'IPS', flex: 0.7 },
  { field: 'ipk', headerName: 'IPK', flex: 0.7 },
];

export default function IpkListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });

  const fetchData = async (limit) => {
    try {
      setLoading(true);
      const { data } = await getData('ipkc', { limit, page: paginationModel.page + 1 });
      
      const formattedData = [];
      data.forEach((mahasiswa) => {
        mahasiswa.ipList.forEach((ip) => {
          formattedData.push({
            id: `${mahasiswa.nim}-${ip.semester}-${ip.tahun}`,
            nim: mahasiswa.nim,
            nama_mhs: mahasiswa.nama_mhs,
            semester: ip.semester,
            tahun: ip.tahun,
            ips: parseFloat(ip.ips || 0).toFixed(2),
            ipk: parseFloat(ip.ipk || 0).toFixed(2),
          });
        });
      });

      setRows(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(paginationModel.pageSize);
  }, [paginationModel.page, paginationModel.pageSize]);

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  return (
    <Box sx={{ height: '80vh', width: '100%', padding: '0 16px' }}>
      <DataGrid
        sx={{ padding: '0 5px' }}
        rows={rows}
        columns={columns}
        loading={loading}
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[25, 50, 100, { value: -1, label: 'All' }]}
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
      />
    </Box>
  );
}
