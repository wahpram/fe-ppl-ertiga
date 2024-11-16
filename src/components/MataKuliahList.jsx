import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getData } from '../services/apiServices';

const columns = [
  { field: 'id_mk', headerName: 'ID Mata Kuliah', flex: 1 },
  { field: 'nama_mk', headerName: 'Nama Mata Kuliah', flex: 2 },
  { field: 'sks', headerName: 'SKS', flex: 1 },
];

export default function MataKuliahListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (limit) => {
    try {
      setLoading(true);
      const { data, total } = await getData('mk', { limit });
      const formattedData = data.map((item, index) => ({
        id: index + 1,
        ...item,
      }));
      setRows(formattedData);
      setTotalRows(total);
    } catch (error) {
      console.error("Error fetching data:", error);
      setRows([]);
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
        rowCount={totalRows}
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