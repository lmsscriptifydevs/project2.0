import { Add, Close } from "@mui/icons-material";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategory, getSubCategory } from "../../redux/slices/gigsSlice";

const StepOne = ({
  gigTitle,
  handleInputChange,
  category,
  setCategory,
  subCategory,
  setSubCategory,
  tags,
  setTags,
  searchKeywords,
  setSearchKeywords,
  isError,
  errorMessage,
}) => {
  const [tagInput, setTagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  const dispatch = useDispatch();

  const { userCategory, userSubCategory, loading } = useSelector(
    (state) => state.gig
  );

  // Normalize arrays
  const safeTags = Array.isArray(tags) ? tags : [];
  const safeSearchKeywords = Array.isArray(searchKeywords)
    ? searchKeywords
    : [];

  useEffect(() => {
    if (!userCategory?.length) dispatch(getCategory());
    if (!userSubCategory?.length) dispatch(getSubCategory());
  }, [dispatch, userCategory, userSubCategory]);

  const filteredSubCategories = useMemo(() => {
    if (!category) return [];
    return userSubCategory.filter(
      (sub) => parseInt(sub.category_id) === parseInt(category)
    );
  }, [userSubCategory, category]);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubCategory("");
  };

  const handleAddTag = () => {
    if (tagInput.trim() && safeTags.length < 5) {
      setTags([...safeTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = useCallback(
    (index) => {
      setTags((prev) => prev.filter((_, i) => i !== index));
    },
    [setTags]
  );

  const handleAddKeyword = () => {
    if (keywordInput.trim() && safeSearchKeywords.length < 10) {
      setSearchKeywords([...safeSearchKeywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const handleRemoveKeyword = useCallback(
    (index) => {
      setSearchKeywords((prev) => prev.filter((_, i) => i !== index));
    },
    [setSearchKeywords]
  );

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleKeywordInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const characterCount = gigTitle.length;
  const maxCharacters = 80;

  if (loading) {
    return (
      <Box className="d-flex justify-content-center align-items-center py-5">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box component="form" className="step-one">
      <Typography variant="h5" gutterBottom>
        Gig Overview
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Start with a catchy title and choose the right category for your gig.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Gig Title */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Gig Title"
            value={gigTitle}
            onChange={handleInputChange}
            placeholder="I will design a professional logo for your business"
            helperText={`${characterCount}/${maxCharacters} characters • Start with "I will"`}
            error={characterCount < 10 || characterCount > maxCharacters}
            inputProps={{ maxLength: maxCharacters }}
          />
        </Grid>

        {/* Category */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={isError && !category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              id="category"
              value={category}
              onChange={handleCategoryChange}
              label="Category"
            >
              {userCategory.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Subcategory */}
        <Grid item xs={12} md={6}>
          <FormControl
            fullWidth
            disabled={!category}
            error={isError && !subCategory}
          >
            <InputLabel id="subcategory-label">Subcategory</InputLabel>
            <Select
              labelId="subcategory-label"
              id="subcategory"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              label="Subcategory"
            >
              {filteredSubCategories.map((subCat) => (
                <MenuItem key={subCat.id} value={subCat.id}>
                  {subCat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Tags */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Tags ({safeTags.length}/5)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add tags (e.g., logo, design, brand)"
              fullWidth
              size="small"
              onKeyDown={handleTagInputKeyDown}
            />
            <IconButton
              onClick={handleAddTag}
              disabled={!tagInput.trim() || safeTags.length >= 5}
              color="primary"
            >
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: "32px" }}>
            {safeTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                onDelete={() => handleRemoveTag(index)}
                deleteIcon={<Close />}
                variant="outlined"
              />
            ))}
            {safeTags.length === 0 && (
              <Typography variant="caption" color="textSecondary">
                No tags added yet
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="textSecondary">
            Add relevant tags to help buyers find your gig
          </Typography>
        </Grid>

        {/* Search Keywords */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Search Keywords ({safeSearchKeywords.length}/10)
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
            <TextField
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              placeholder="Add search keywords"
              fullWidth
              size="small"
              onKeyDown={handleKeywordInputKeyDown}
            />
            <IconButton
              onClick={handleAddKeyword}
              disabled={
                !keywordInput.trim() || safeSearchKeywords.length >= 10
              }
              color="primary"
            >
              <Add />
            </IconButton>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: "32px" }}>
            {safeSearchKeywords.map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                onDelete={() => handleRemoveKeyword(index)}
                deleteIcon={<Close />}
                variant="outlined"
                color="primary"
              />
            ))}
            {safeSearchKeywords.length === 0 && (
              <Typography variant="caption" color="textSecondary">
                No keywords added yet
              </Typography>
            )}
          </Box>
          <Typography variant="caption" color="textSecondary">
            Keywords that buyers might use to search for your service
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepOne;
