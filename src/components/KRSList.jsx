import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { getData } from '../services/apiServices';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const columns = [
  { field: 'nim', headerName: 'NIM', flex: 1 },
  { field: 'nama_mhs', headerName: 'Nama Mahasiswa', flex: 1.5 },
  { field: 'nama_mk', headerName: 'Mata Kuliah', flex: 2 },
  { field: 'sks', headerName: 'SKS', flex: 0.7 },
  { field: 'tahun', headerName: 'Tahun', flex: 1 },
  { field: 'semester', headerName: 'Semester', flex: 1 },
  { field: 'nilai', headerName: 'Nilai', flex: 0.7 },
];

export default function KrsListTable() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [semester, setSemester] = useState('');
  const [paginationModel, setPaginationModel] = useState({
    pageSize: 25,
    page: 0,
  });
  const [totalRows, setTotalRows] = useState(0);

  const fetchData = async (limit) => {
    try {
      setLoading(true);
      const { data, total } = await getData('krs', { limit });
      const formattedData = data.map((item, index) => ({
        id: index + 1,
        nim: item.nim,
        nama_mhs: item.MH.nama_mhs,
        nama_mk: item.MK.nama_mk,
        sks: item.MK.sks,
        tahun: String(item.tahun),
        semester: String(item.semester),
        nilai: item.nilai,
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

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const filteredRows = semester
    ? rows.filter((row) => row.semester === semester)
    : rows;

  return (
    <Box sx={{ height: '80vh', width: '100%', padding: '0 16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <FormControl sx={{ minWidth: 220, marginRight: 2 }}>
          <InputLabel id="semester-select-label">Semester</InputLabel>
          <Select
            labelId="semester-select-label"
            id="semester-select"
            value={semester}
            label="Semester"
            onChange={handleSemesterChange}
          >
            <MenuItem value="">Semua</MenuItem>
            <MenuItem value="1">Semester 1 - Tahun 2021/2022</MenuItem>
            <MenuItem value="2">Semester 2 - Tahun 2021/2022</MenuItem>
            <MenuItem value="3">Semester 3 - Tahun 2022/2023</MenuItem>
            <MenuItem value="4">Semester 4 - Tahun 2022/2023</MenuItem>
            <MenuItem value="5">Semester 5 - Tahun 2023/2024</MenuItem>
            <MenuItem value="6">Semester 6 - Tahun 2023/2024</MenuItem>
            <MenuItem value="7">Semester 7 - Tahun 2024/2025</MenuItem>
            <MenuItem value="8">Semester 8 - Tahun 2024/2025</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <DataGrid
        sx={{ padding: '0 5px' }}
        rows={filteredRows}
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