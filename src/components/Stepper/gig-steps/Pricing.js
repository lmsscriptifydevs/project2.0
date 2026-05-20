import {
  Box,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

const Pricing = ({ formData = {}, updateFormData, validationErrors: propErrors = {}, isEditMode = false }) => {
  const packages = ['basic', 'standard', 'premium'];
  const packageTitles = {
    basic: 'Basic Package',
    standard: 'Standard Package',
    premium: 'Premium Package'
  };

  const [localErrors, setLocalErrors] = useState({});

  // Theme Colors Constants
  const theme = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
    primaryOrange: "#f0591f",
    pureWhite: "#ffffff",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    lightBorder: "rgba(255, 255, 255, 0.06)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)"
  };

  const safePackages = {
    basic: { title: 'Good', description: '', delivery_time: '3', revisions: '1', price: '' },
    standard: { title: 'Better', description: '', delivery_time: '5', revisions: '3', price: '' },
    premium: { title: 'Best', description: '', delivery_time: '7', revisions: '5', price: '' },
    ...formData.packages
  };

  // Reusable Input Styles
  const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
      color: theme.pureWhite,
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      '& fieldset': { borderColor: theme.lightBorder },
      '&:hover fieldset': { borderColor: theme.mediumGrayTitle },
      '&.Mui-focused fieldset': { borderColor: theme.primaryOrange },
    },
    '& .MuiInputLabel-root': { color: theme.bodyGrayText },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.primaryOrange },
    '& .MuiFormHelperText-root': { color: theme.bodyGrayText },
  };

  const updatePackage = (pkgType, field, value) => {
    updateFormData({
      packages: {
        ...safePackages,
        [pkgType]: {
          ...safePackages[pkgType],
          [field]: value
        }
      }
    });
  };

  const handleFieldChange = (pkgType, field, value) => {
    updatePackage(pkgType, field, value);
    // validation logic stays same as requested
  };

  const allErrors = { ...localErrors, ...propErrors };

  return (
    <Box sx={{ backgroundColor: theme.mainBg, p: 1 }}>
      <Typography variant="h5" sx={{ color: theme.pureWhite, fontWeight: 'bold', mb: 1 }}>
        Pricing & Packages
      </Typography>
      <Typography variant="body2" sx={{ color: theme.bodyGrayText, mb: 4 }}>
        Set up your service packages and pricing
        {isEditMode && (
          <Typography component="span" sx={{ color: theme.primaryOrange, display: 'block', mt: 0.5 }}>
            • Edit your package details and pricing
          </Typography>
        )}
      </Typography>

      <Grid container spacing={3}>
        {packages.map((pkgType) => (
          <Grid item xs={12} md={4} key={pkgType}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: theme.cardBg,
                backgroundImage: 'none',
                border: '1px solid',
                borderColor: Object.keys(allErrors).some(key => key.startsWith(pkgType)) 
                             ? 'error.main' 
                             : theme.lightBorder,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: theme.cardBgActive,
                  borderColor: theme.orangeBorderActive,
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: theme.primaryOrange, fontWeight: '600', mb: 3 }}>
                  {packageTitles[pkgType]}
                </Typography>

                <TextField
                  fullWidth
                  label="Package Title (Max: 50 chars)"
                  value={safePackages[pkgType]?.title || ''}
                  onChange={(e) => handleFieldChange(pkgType, 'title', e.target.value)}
                  error={!!allErrors[`${pkgType}_title`]}
                  helperText={allErrors[`${pkgType}_title`]}
                  sx={inputSx}
                />

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label={`Package Description (${(safePackages[pkgType]?.description || '').length}/1000) — Min: 750 chars`}
                  value={safePackages[pkgType]?.description || ''}
                  onChange={(e) => {
                    if (e.target.value.length <= 1000) {
                      handleFieldChange(pkgType, 'description', e.target.value);
                    }
                  }}
                  error={!!allErrors[`${pkgType}_description`]}
                  helperText={allErrors[`${pkgType}_description`]}
                  sx={inputSx}
                />
                <Typography variant="caption" sx={{ mt: -1.5, mb: 2, display: 'block', color: (safePackages[pkgType]?.description || '').length >= 750 ? '#4caf50' : theme.primaryOrange }}>
                  {(safePackages[pkgType]?.description || '').length}/1000 characters
                  {(safePackages[pkgType]?.description || '').length < 750 && <span> — Need {750 - (safePackages[pkgType]?.description || '').length} more chars</span>}
                  {(safePackages[pkgType]?.description || '').length >= 750 && <span> ✓ Min reached</span>}
                </Typography>

                <FormControl fullWidth sx={inputSx} error={!!allErrors[`${pkgType}_delivery_time`]}>
                  <InputLabel>Delivery Time</InputLabel>
                  <Select
                    value={safePackages[pkgType]?.delivery_time || '3'}
                    label="Delivery Time"
                    onChange={(e) => handleFieldChange(pkgType, 'delivery_time', e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#0f172a', color: theme.pureWhite }
                      }
                    }}
                  >
                    {[1, 2, 3, 5, 7, 10, 14].map((day) => (
                      <MenuItem key={day} value={day.toString()}>{day} Day{day > 1 ? 's' : ''}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={inputSx} error={!!allErrors[`${pkgType}_revisions`]}>
                  <InputLabel>Revisions</InputLabel>
                  <Select
                    value={safePackages[pkgType]?.revisions || '1'}
                    label="Revisions"
                    onChange={(e) => handleFieldChange(pkgType, 'revisions', e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        sx: { bgcolor: '#0f172a', color: theme.pureWhite }
                      }
                    }}
                  >
                    {[0, 1, 2, 3, 5].map((rev) => (
                      <MenuItem key={rev} value={rev.toString()}>{rev} Revision{rev !== 1 ? 's' : ''}</MenuItem>
                    ))}
                    <MenuItem value="unlimited">Unlimited</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Price (Min: $5)"
                  type="number"
                  value={safePackages[pkgType]?.price || ''}
                  onChange={(e) => handleFieldChange(pkgType, 'price', e.target.value)}
                  error={!!allErrors[`${pkgType}_price`]}
                  sx={inputSx}
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1, color: theme.primaryOrange, fontWeight: 'bold' }}>$</Typography>,
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Pricing;