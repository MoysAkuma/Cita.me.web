import react from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.tsx';
import Filters from '../Components/Search/Filters.tsx';
import ResultTable from '../Components/ResultTable.tsx';
import { Button, Typography, Container, Box } from '@mui/material';

export default function Search(): React.JSX.Element {
  return (
    <>
        <Container maxWidth="md" style={{ textAlign: 'center', marginTop: '10%' }}>
            <Typography variant="h4" gutterBottom>Descubre Servicios cerca de ti</Typography>
            <Filters />
            <Box mt={4}>
                <ResultTable providers={[]} />
            </Box>
        </Container>
    </>);
}