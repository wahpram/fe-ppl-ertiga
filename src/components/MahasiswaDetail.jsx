import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const krsColumns = [
  { field: 'nama_mk', headerName: 'Mata Kuliah', width: 300 , flex: 2},
  { field: 'sks', headerName: 'SKS', width: 100, flex: 1},
  { field: 'nilai', headerName: 'Nilai', width: 100, flex: 1 },
  { field: 'tahun', headerName: 'Tahun', width: 100, flex: 1 },
  { field: 'semester', headerName: 'Semester', width: 100, flex: 1 },
];

const ipkColumns = [
  { field: 'semester', headerName: 'Semester', width: 100, flex: 1 },
  { field: 'tahun', headerName: 'Tahun', width: 100, flex: 1 },
  { field: 'ips', headerName: 'IPS', width: 100, flex: 1 },
  { field: 'ipk', headerName: 'IPK', width: 100, flex: 1 },
];

function MahasiswaDetail() {
  const { nim } = useParams();
  const [view, setView] = useState('krs');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mahasiswa, setMahasiswa] = useState(null);
  const [semester, setSemester] = useState('');
  const [displayType, setDisplayType] = useState('table');

  useEffect(() => {
    axios.get(`https://be.bitloka.top/mhsc/${nim}`)
    .then((response) => {
      setMahasiswa(response.data);
    })
    .catch((error) => console.error("Error fetching mahasiswa:", error));
}, [nim]);

useEffect(() => {
  setLoading(true);
  const endpoint =
    view === 'krs'
      ? `https://be.bitloka.top/krs?nim=${nim}`
      : `https://be.bitloka.top/ipkc/${nim}`;
  
  axios.get(endpoint)
    .then((response) => {
      let fetchedData;
      if (view === 'krs') {
        fetchedData = response.data.filter(item => item.nim === nim && (!semester || item.semester === parseInt(semester)));
        fetchedData = fetchedData.map((item, index) => ({
          id: index + 1,
          ...item,
          nama_mk: item.MK?.nama_mk,
          sks: item.MK?.sks,
        }));
      } else {
        fetchedData = response.data.ipList.map((item, index) => ({
          id: index + 1,
          semester: item.semester,
          tahun: item.tahun,
          ips: parseFloat(item.ips).toFixed(2),
          ipk: parseFloat(item.ipk).toFixed(2),
        }));
      }

      setData(fetchedData);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    })
    .finally(() => {
      setLoading(false);
    });
}, [nim, view, semester]);

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
  };

  const handleDisplayTypeChange = (event) => {
    setDisplayType(event.target.value);
  };

  return (
    <Box sx={{ padding: '16px' }}>
      {mahasiswa && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5">{mahasiswa.nim} - {mahasiswa.nama_mhs}</Typography>
          <Typography variant="body1">IPK: {mahasiswa.ipk}</Typography>
          <Typography variant="body1">IPS: {mahasiswa.ips}</Typography>
        </Box>
      )}
      
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Button
          variant={view === 'krs' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setView('krs')}
        >
          Lihat KRS
        </Button>
        <Button
          variant={view === 'ipk' ? 'contained' : 'outlined'}
          color="primary"
          onClick={() => setView('ipk')}
        >
          Lihat IPK
        </Button>

        {/* Dropdown untuk semester pada KRS */}
        {view === 'krs' && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="semester-select-label">Semester</InputLabel>
            <Select
              labelId="semester-select-label"
              id="semester-select"
              value={semester}
              label="Semester"
              onChange={handleSemesterChange}
            >
              <MenuItem value="">Semua</MenuItem>
              <MenuItem value="1">Semester 1 - 2021/2022</MenuItem>
              <MenuItem value="2">Semester 2 - 2021/2022</MenuItem>
              <MenuItem value="3">Semester 3 - 2022/2023</MenuItem>
              <MenuItem value="4">Semester 4 - 2022/2023</MenuItem>
              <MenuItem value="5">Semester 5 - 2023/2024</MenuItem>
              <MenuItem value="6">Semester 6 - 2023/2024</MenuItem>
              <MenuItem value="7">Semester 7 - 2024/2025</MenuItem>
              <MenuItem value="8">Semester 8 - 2024/2025</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Dropdown untuk memilih tampilan Tabel atau Grafik pada IPK */}
        {view === 'ipk' && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="display-select-label">Tampilan</InputLabel>
            <Select
              labelId="display-select-label"
              id="display-select"
              value={displayType}
              label="Tampilan"
              onChange={handleDisplayTypeChange}
            >
              <MenuItem value="table">Tabel</MenuItem>
              <MenuItem value="chart">Grafik</MenuItem>
            </Select>
          </FormControl>
        )}
      </Box>

      {/* Tampilkan tabel atau grafik berdasarkan pilihan pengguna */}
      <Box sx={{ height: 400, width: 700 }}> {/* Tentukan lebar tetap */}
        {view === 'krs' ? (
          <DataGrid
            rows={data}
            columns={krsColumns}
            pageSize={5}
            loading={loading}
            disableColumnSelector
            disableDensitySelector
            paginationMode="client"
          />
        ) : (
          displayType === 'table' ? (
            <DataGrid
              rows={data}
              columns={ipkColumns}
              pageSize={5}
              loading={loading}
              disableColumnSelector
            />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" label={{ value: 'Semester', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'IPK', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ipk" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="ips" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          )
        )}
      </Box>
    </Box>
  );
}

export default MahasiswaDetail;
