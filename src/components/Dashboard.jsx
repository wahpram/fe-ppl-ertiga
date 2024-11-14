import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom'; 
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MatkulIcon from '@mui/icons-material/School'
import PersonIcon from '@mui/icons-material/Person'
import KrsIcon from '@mui/icons-material/AssignmentTurnedIn';
import IpkIcon from '@mui/icons-material/Insights';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import MahasiswaListTable from './MahasiswaList';
import MataKuliahList from './MataKuliahList';
import KrsListTable from './KRSList';
import IpkListTable from './IPKList';
import MahasiswaDetail from './MahasiswaDetail';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'Dashboard',
    title: <Link to="/">Dashboard</Link>,
    icon: <DashboardIcon />,
  },
  {
    segment: 'Mahasiswa',
    title: <Link to="/mahasiswa">Mahasiswa</Link>,
    icon: <PersonIcon />,
  },
  {
    segment: 'matakuliah',
    title: <Link to="/matakuliah">Mata Kuliah</Link>,
    icon: <MatkulIcon />,
  },
  {
    segment: 'krs',
    title: <Link to="/krs">Kartu Rencana Studi</Link>,
    icon: <KrsIcon />,
  },
  {
    segment: 'ipk',
    title: <Link to="/ipk">IPK</Link>,
    icon: <IpkIcon />,
  },
  {
    kind: 'divider',
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent() {
  const location = useLocation();
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Routes>
        <Route path="/" element={<Typography variant="h4">Selamat Datang di ERTIGA Management</Typography>} />
        <Route path="/mahasiswa" element={<MahasiswaListTable />} />
        <Route path="/matakuliah" element={<MataKuliahList />} />
        <Route path="/krs" element={<KrsListTable />} />
        <Route path="/ipk" element={<IpkListTable />} />
				<Route path="/mahasiswa/:nim" element={<MahasiswaDetail />} />
      </Routes>
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBasic(props) {
  const { window } = props;

  const router = useDemoRouter('/dashboard');

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
			branding={{
        logo: <img src="/ertiga-vector-logo.svg" alt="ERTIGA" />,
        title: 'ERTIGA',
      }}
    >
      <DashboardLayout>
        <DemoPageContent />
      </DashboardLayout>
    </AppProvider>
  );
}

export default DashboardLayoutBasic;