import { Add, Delete, AssignmentTurnedIn, InfoOutlined } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  TextField,
  Typography,
  Fade
} from "@mui/material";
import React, { useEffect, useState } from "react";

// Constants for validation
const REQUIREMENT_MIN_CHARS = 5;
const REQUIREMENT_MAX_CHARS = 2000;
const MAX_REQUIREMENTS = 10;

const Requirements = ({
  formData = {},
  updateFormData,
  validationErrors: parentValidationErrors = {},
  isEditMode = false,
}) => {
  const [newRequirement, setNewRequirement] = useState("");
  const [localValidationErrors, setLocalValidationErrors] = useState({});

  // Theme Schema Colors
  const theme = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    cardBgActive: "rgba(255, 255, 255, 0.04)",
    primaryOrange: "#f0591f",
    pureWhite: "#ffffff",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    lightBorder: "rgba(255, 255, 255, 0.06)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)"
  };

  const requirements = formData.requirements || [];

  // Clean requirement text - handle newlines and special characters
  const cleanRequirementText = (text) => {
    return text
      .trim()
      .replace(/\r\n/g, '\n') // Normalize Windows newlines
      .replace(/\r/g, '\n') // Normalize old Mac newlines
      .replace(/\n{3,}/g, '\n\n') // Max 2 consecutive newlines
      .replace(/[^\S\n]+/g, ' ') // Replace multiple spaces (not newlines) with single space
      .substring(0, REQUIREMENT_MAX_CHARS); // Enforce max length
  };

  const handleAddRequirement = () => {
    const cleanedText = cleanRequirementText(newRequirement);
    
    if (cleanedText && requirements.length < MAX_REQUIREMENTS) {
      if (cleanedText.length < REQUIREMENT_MIN_CHARS) {
        setLocalValidationErrors({ 
          newRequirement: `Minimum ${REQUIREMENT_MIN_CHARS} characters required` 
        });
        return;
      }

      // Check for duplicate requirements
      const isDuplicate = requirements.some(
        req => req.toLowerCase() === cleanedText.toLowerCase()
      );
      
      if (isDuplicate) {
        setLocalValidationErrors({ 
          newRequirement: "This requirement already exists" 
        });
        return;
      }

      updateFormData({ requirements: [...requirements, cleanedText] });
      setNewRequirement("");
      setLocalValidationErrors({});
    }
  };

  const handleRemoveRequirement = (index) => {
    updateFormData({ requirements: requirements.filter((_, i) => i !== index) });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddRequirement();
    }
  };

  // Handle input change with max length enforcement
  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow typing but show warning when approaching limit
    setNewRequirement(value);
    if (localValidationErrors.newRequirement) {
      setLocalValidationErrors({});
    }
  };

  // Get character count color
  const getCharCountColor = () => {
    const len = newRequirement.trim().length;
    if (len === 0) return theme.bodyGrayText;
    if (len < REQUIREMENT_MIN_CHARS) return theme.primaryOrange;
    if (len > REQUIREMENT_MAX_CHARS) return "#ef4444";
    return "#4caf50";
  };

  // Reusable TextField Style for Dark Theme
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      color: theme.pureWhite,
      bgcolor: 'rgba(255, 255, 255, 0.01)',
      '& fieldset': { borderColor: theme.lightBorder },
      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.15)' },
      '&.Mui-focused fieldset': { borderColor: theme.primaryOrange },
    },
    '& .MuiInputLabel-root': { color: theme.bodyGrayText },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.primaryOrange },
    '& .MuiFormHelperText-root': { color: theme.bodyGrayText }
  };

  const allErrors = { ...parentValidationErrors, ...localValidationErrors };

  return (
    <Box sx={{ bgcolor: theme.mainBg, p: 1 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: theme.pureWhite }}>
          Buyer <span style={{ color: theme.primaryOrange }}>Requirements</span>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.bodyGrayText }}>
          Kaam shuru karne ke liye aapko buyer se kya malomat chahiye?
          {isEditMode && (
            <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: theme.primaryOrange }}>
              • {requirements.length} Active Requirement{requirements.length !== 1 ? "s" : ""}
            </Typography>
          )}
        </Typography>
      </Box>

      {allErrors.requirements && (
        <Alert severity="error" variant="outlined" sx={{ 
          mb: 3, 
          color: '#ff5252', 
          borderColor: '#ff5252', 
          bgcolor: 'rgba(255, 82, 82, 0.05)',
          animation: 'shake 0.5s ease-in-out',
          '@keyframes shake': {
            '0%, 100%': { transform: 'translateX(0)' },
            '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
            '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
          }
        }}>
          <strong>⚠️ Required:</strong> {allErrors.requirements}
        </Alert>
      )}

      {/* Input Card */}
      <Card sx={{ 
        mb: 4, 
        bgcolor: theme.cardBg, 
        border: allErrors.requirements 
          ? '2px solid #ef4444' 
          : `1px solid ${theme.lightBorder}`,
        borderRadius: 3,
        overflow: 'visible',
        animation: allErrors.requirements ? 'shake 0.5s ease-in-out' : 'none',
        '@keyframes shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        transition: 'border-color 0.3s ease',
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ color: theme.mediumGrayTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentTurnedIn sx={{ fontSize: 18, color: allErrors.requirements ? '#ef4444' : theme.primaryOrange }} />
            Nayi Requirement Add Karein (Min: {REQUIREMENT_MIN_CHARS} chars, Max: {REQUIREMENT_MAX_CHARS} chars)
            {allErrors.requirements && (
              <span style={{ color: '#ef4444', fontSize: '12px', marginLeft: '8px' }}>* Required</span>
            )}
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newRequirement}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Please send your brand logo and color preferences..."
              error={!!allErrors.newRequirement || !!allErrors.requirements}
              helperText={allErrors.newRequirement || allErrors.requirements || `Minimum ${REQUIREMENT_MIN_CHARS} characters required`}
              inputProps={{
                maxLength: REQUIREMENT_MAX_CHARS + 50, // Allow slight overflow for better UX
              }}
              sx={{
                ...textFieldStyle,
                '& .MuiOutlinedInput-root': {
                  color: theme.pureWhite,
                  bgcolor: 'rgba(255, 255, 255, 0.01)',
                  '& fieldset': { 
                    borderColor: allErrors.requirements ? '#ef4444' : theme.lightBorder,
                    borderWidth: allErrors.requirements ? '2px' : '1px',
                  },
                  '&:hover fieldset': { borderColor: allErrors.requirements ? '#ef4444' : 'rgba(255, 255, 255, 0.15)' },
                  '&.Mui-focused fieldset': { borderColor: allErrors.requirements ? '#ef4444' : theme.primaryOrange },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim() || newRequirement.trim().length < REQUIREMENT_MIN_CHARS || requirements.length >= MAX_REQUIREMENTS}
              startIcon={<Add />}
              sx={{ 
                height: '56px',
                minWidth: "120px", 
                bgcolor: theme.primaryOrange,
                '&:hover': { bgcolor: '#d44a19' },
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2
              }}
            >
              Add
            </Button>
          </Box>

          {newRequirement && (
            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{ 
                  color: getCharCountColor(),
                  fontWeight: 600
                }}
              >
                {newRequirement.trim().length}/{REQUIREMENT_MAX_CHARS} characters
                {newRequirement.trim().length < REQUIREMENT_MIN_CHARS && ` (Need ${REQUIREMENT_MIN_CHARS - newRequirement.trim().length} more)`}
                {newRequirement.trim().length >= REQUIREMENT_MIN_CHARS && newRequirement.trim().length <= REQUIREMENT_MAX_CHARS && " ✓"}
                {newRequirement.trim().length > REQUIREMENT_MAX_CHARS && " ⚠️ Too long!"}
              </Typography>
              {requirements.length >= MAX_REQUIREMENTS && (
                <Typography variant="caption" sx={{ color: "#ef4444" }}>
                  Maximum {MAX_REQUIREMENTS} requirements reached
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Requirements List */}
      {requirements.length > 0 ? (
        <Card sx={{ 
          bgcolor: 'transparent', 
          border: `1px solid ${theme.lightBorder}`,
          borderRadius: 3 
        }}>
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.lightBorder}`, bgcolor: 'rgba(255,255,255,0.01)' }}>
            <Typography variant="subtitle1" sx={{ color: theme.pureWhite, fontWeight: 'bold' }}>
              Added Requirements ({requirements.length}/{MAX_REQUIREMENTS}) — Max: {MAX_REQUIREMENTS} requirements
            </Typography>
          </Box>
          <List sx={{ p: 0 }}>
            {requirements.map((req, index) => (
              <Fade in key={index}>
                <Box>
                  <ListItem sx={{ 
                    py: 2, 
                    '&:hover': { bgcolor: theme.cardBgActive }
                  }}>
                    <ListItemText
                      primary={
                        <Typography sx={{ color: theme.pureWhite, fontSize: '0.95rem' }}>
                          <span style={{ color: theme.primaryOrange, marginRight: '8px', fontWeight: 'bold' }}>{index + 1}.</span>
                          {req}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: theme.bodyGrayText, mt: 0.5, display: 'block' }}>
                          {req.length} characters
                        </Typography>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => handleRemoveRequirement(index)}
                        sx={{ 
                          color: '#ff5252', 
                          bgcolor: 'rgba(255, 82, 82, 0.05)',
                          '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.1)' }
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < requirements.length - 1 && <Divider sx={{ borderColor: theme.lightBorder }} />}
                </Box>
              </Fade>
            ))}
          </List>
        </Card>
      ) : (
        <Alert 
          severity="info" 
          variant="outlined"
          sx={{ 
            color: theme.mediumGrayTitle, 
            borderColor: theme.lightBorder,
            bgcolor: 'rgba(255,255,255,0.01)',
            '& .MuiAlert-icon': { color: theme.primaryOrange }
          }}
        >
          No requirements added. Aapko kaam shuru karne ke liye jo bhi zaruri hai (maslan Logo, Guidelines, Samples) wo yahan add karein.
        </Alert>
      )}

      {/* Pro Tip Section */}
      <Box sx={{ 
        mt: 4, 
        p: 2.5, 
        bgcolor: theme.secondaryBlueBlur, 
        borderRadius: 3, 
        border: `1px solid ${theme.lightBorder}`,
        display: 'flex',
        gap: 2
      }}>
        <InfoOutlined sx={{ color: theme.primaryOrange }} />
        <Box>
          <Typography variant="subtitle2" sx={{ color: theme.pureWhite, fontWeight: 'bold', mb: 0.5 }}>
            Pro Tip:
          </Typography>
          <Typography variant="body2" sx={{ color: theme.bodyGrayText, lineHeight: 1.6 }}>
            Wazeh requirements likhne se <b style={{color: theme.pureWhite}}>revisions</b> kam hoti hain aur kaam jaldi khatam hota hai. Maslan: "Please provide high-resolution images" ya "Share your brand color hex codes".
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Requirements;