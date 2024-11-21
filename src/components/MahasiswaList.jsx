import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { getData } from '../services/apiServices';

const columns = (handleDetailClick) => [
  { field: 'nim', headerName: 'NIM', flex: 1 },
  { field: 'nama_mhs', headerName: 'Nama Mahasiswa', flex: 2 },
  { field: 'ips', headerName: 'IPS', flex: 1 },
  { field: 'ipk', headerName: 'IPK', flex: 1 },
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
        Detail
      </Button>
    ),
    sortable: false,
    filterable: false,
  },
];

export default function MahasiswaListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);
  const navigate = useNavigate();

  const fetchData = async (limit) => {
    try {
      setLoading(true);
      const { data, total } = await getData('mhsc', { limit });
      
      const formattedData = data.map((item, index) => ({
        id: index + 1,
        nim: item.nim,
        nama_mhs: item.nama_mhs,
        ips: parseFloat(item.ips || 0).toFixed(2),
        ipk: parseFloat(item.ipk || 0).toFixed(2),
        semester: item.semester,
        tahun: item.tahun,
      }));
      
      setRows(formattedData);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
      setTotalRows(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(paginationModel.pageSize);
  }, []);

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
    const limit = newModel.pageSize === -1 ? undefined : newModel.pageSize;
    fetchData(limit);
  };

  const handleDetailClick = (nim) => {
    navigate(`/mhsc/${nim}`);
  };

  return (
    <Box
      sx={{
        height: '80vh',
        width: '100%',
        padding: '0 16px',
        '@media (max-width: 600px)': {
          '& .MuiDataGrid-root': {
            fontSize: '0.75rem',
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '0.75rem',
            },
            '& .MuiButton-root': {
              fontSize: '0.7rem',
            },
          },
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns(handleDetailClick)}
        loading={loading}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
            quickFilterProps: { debounceMs: 500 },
          },
        }}
        paginationMode="client"
        paginationModel={paginationModel}
        onPaginationModelChange={handlePaginationModelChange}
        pageSizeOptions={[25, 50, 100, { value: -1, label: 'All' }]}
        rowCount={totalRows}
        disableColumnSelector
        disableDensitySelector
        disableColumnFilter
      />
    </Box>
  );
}