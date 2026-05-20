import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategory, getSubCategory } from '../../../redux/slices/gigsSlice';

const Overview = ({ formData = {}, updateFormData, validationErrors: propErrors = {}, isEditMode = false }) => {
  const dispatch = useDispatch();
  const { userCategory = [], userSubCategory = [] } = useSelector(state => state.gig);

  const [tagInput, setTagInput] = useState('');
  const [localErrors, setLocalErrors] = useState({});

  // Theme Constants based on your GrapeTask Schema
  const theme = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    primaryOrange: "#f0591f",
    pureWhite: "#ffffff",
    mediumGray: "#a1a1aa",
    bodyGray: "#71717a",
    border: "rgba(255, 255, 255, 0.06)",
    activeBorder: "rgba(240, 89, 31, 0.4)"
  };

  const { 
    gigTitle = 'I will ', 
    category_id = '', 
    subcategory_id = '', 
    tags = [] 
  } = formData;

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  // ======== VALIDATIONS ========
  const validateTitle = (value) => {
    if (!value || value.length < 60) return "Title must be at least 60 characters";
    if (value.length > 90) return "Title cannot exceed 90 characters";
    return "";
  };

  // ======== HANDLERS ========
  const handleTitleChange = (e) => {
    let value = e.target.value;
    
    // Strict Prefix Logic: "I will " ko hamesha start mein rakhta hai
    if (!value.startsWith('I will ')) {
      value = 'I will ' + value.replace(/^I will\s*/, '');
    }

    updateFormData({ gigTitle: value });
    setLocalErrors(prev => ({ ...prev, gigTitle: validateTitle(value) }));
  };

  const handleCategoryChange = (categoryId) => {
    updateFormData({ category_id: categoryId, subcategory_id: '' });
    setLocalErrors(prev => ({ ...prev, category_id: "", subcategory_id: "" }));
    if (categoryId) dispatch(getSubCategory());
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim();
      if (newTag.length >= 2 && !tags.includes(newTag) && tags.length < 10) {
        const updatedTags = [...tags, newTag];
        updateFormData({ tags: updatedTags });
        setTagInput('');
      }
    }
  };

  const allErrors = { ...localErrors, ...propErrors };

  // Common Input Styles for re-use
  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      color: theme.pureWhite,
      backgroundColor: theme.cardBg,
      '& fieldset': { borderColor: theme.border },
      '&:hover fieldset': { borderColor: theme.mediumGray },
      '&.Mui-focused fieldset': { borderColor: theme.primaryOrange },
    },
    '& .MuiInputLabel-root': { color: theme.bodyGray },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.primaryOrange },
  };

  return (
    <Box sx={{ p: 1, backgroundColor: theme.mainBg, minHeight: '100%' }}>
      <Typography variant="h5" sx={{ color: theme.pureWhite, fontWeight: 'bold', mb: 1 }}>
        Gig Overview
      </Typography>
      <Typography variant="body2" sx={{ color: theme.bodyGray, mb: 4 }}>
        Let's start with the basic details of your service
        {isEditMode && (
          <Typography component="span" sx={{ color: theme.primaryOrange, display: 'block', mt: 1 }}>
            • Currently Editing Mode
          </Typography>
        )}
      </Typography>

      <Grid container spacing={4}>
        {/* Gig Title */}
        <Grid item xs={12}>
            <TextField
              fullWidth
              label="Gig Title (Min: 60 chars, Max: 90 chars)"
              value={gigTitle}
              onChange={handleTitleChange}
              error={!!allErrors.gigTitle}
              helperText={allErrors.gigTitle}
              sx={inputStyles}
            />
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: theme.bodyGray }}>
              Character Count: <span style={{ color: gigTitle.length >= 60 && gigTitle.length <= 90 ? '#4caf50' : theme.primaryOrange }}>{gigTitle.length}/90</span>
              {gigTitle.length < 60 && <span style={{ color: theme.primaryOrange }}> — Need {60 - gigTitle.length} more chars</span>}
            </Typography>
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={inputStyles} error={!!allErrors.category_id}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category_id}
              label="Category"
              onChange={(e) => handleCategoryChange(e.target.value)}
              MenuProps={{ PaperProps: { sx: { bgcolor: '#0f172a', color: 'white' } } }}
            >
              {userCategory.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Subcategory */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={inputStyles} error={!!allErrors.subcategory_id} disabled={!category_id}>
            <InputLabel>Subcategory</InputLabel>
            <Select
              value={subcategory_id}
              label="Subcategory"
              onChange={(e) => updateFormData({ subcategory_id: e.target.value })}
              MenuProps={{ PaperProps: { sx: { bgcolor: '#0f172a', color: 'white' } } }}
            >
              {userSubCategory
                .filter(sub => String(sub.category_id) === String(category_id))
                .map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>{sub.name}</MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tags Section */}
        <Grid item xs={12}>
          <Paper variant="outlined" sx={{ 
            p: 2, 
            bgcolor: 'transparent', 
            borderColor: theme.border, 
            borderStyle: 'dashed' 
          }}>
            <Typography variant="subtitle2" sx={{ color: theme.mediumGray, mb: 2 }}>
              Search Tags ({tags.length}/10) — Min: 1 tag, Max: 10 tags
            </Typography>
            <TextField
              fullWidth
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Press Enter to add tags"
              sx={inputStyles}
            />
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => updateFormData({ tags: tags.filter(t => t !== tag) })}
                  sx={{ 
                    color: theme.pureWhite, 
                    borderColor: theme.primaryOrange,
                    bgcolor: 'rgba(240, 89, 31, 0.1)',
                    '& .MuiChip-deleteIcon': { color: theme.primaryOrange }
                  }}
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;