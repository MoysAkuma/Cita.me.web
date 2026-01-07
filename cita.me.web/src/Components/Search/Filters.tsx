import { useState } from 'react';
import { Delete, FilterList } from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { 
    TextField, 
    Typography, 
    InputAdornment,
    IconButton, 
    Button,
    Box,
    Grid,
    Divider
} from "@mui/material";

interface FilterValues {
    search: string;
    country: string;
    state: string;
    city: string;
    availabilityDate: string;
}

export default function Filters(): React.JSX.Element {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        country: '',
        state: '',
        city: '',
        availabilityDate: ''
    });

    const handleFilterChange = (field: keyof FilterValues, value: string) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            country: '',
            state: '',
            city: '',
            availabilityDate: ''
        });
    };

    const handleApplyFilters = () => {
        // Add your filter logic here
        console.log('Applying filters:', filters);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Filtros</Typography>
                <IconButton 
                    onClick={() => setShowFilters(!showFilters)}
                    color="primary"
                >
                    <FilterList />
                </IconButton>
            </Box>

            {showFilters && (
                <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2, backgroundColor: '#fafafa' }}>
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            Búsqueda General
                        </Typography>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            placeholder="Buscar servicios, profesionales, especialidades..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Location Section */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Ubicación
                            </Typography>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="País"
                                    placeholder="Ingrese país"
                                    value={filters.country}
                                    onChange={(e) => handleFilterChange('country', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Estado/Provincia"
                                    placeholder="Ingrese estado/provincia"
                                    value={filters.state}
                                    onChange={(e) => handleFilterChange('state', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                    label="Ciudad"
                                    placeholder="Ingrese ciudad"
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Date of Availability */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarTodayIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Fecha de Disponibilidad
                            </Typography>
                        </Box>
                        <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            type="date"
                            value={filters.availabilityDate}
                            onChange={(e) => handleFilterChange('availabilityDate', e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </Box>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            fullWidth
                            onClick={handleApplyFilters}
                        >
                            Aplicar Filtros
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary"
                            startIcon={<Delete />}
                            onClick={handleClearFilters}
                        >
                            Limpiar
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
}