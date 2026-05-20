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

  const handleAddRequirement = () => {
    if (newRequirement.trim() && requirements.length < 10) {
      const requirementText = newRequirement.trim();

      if (requirementText.length < 5) {
        setLocalValidationErrors({ newRequirement: "Minimum 5 characters required" });
        return;
      }

      updateFormData({ requirements: [...requirements, requirementText] });
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

      {/* Input Card */}
      <Card sx={{ 
        mb: 4, 
        bgcolor: theme.cardBg, 
        border: `1px solid ${theme.lightBorder}`,
        borderRadius: 3,
        overflow: 'visible'
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ color: theme.mediumGrayTitle, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <AssignmentTurnedIn sx={{ fontSize: 18, color: theme.primaryOrange }} />
            Nayi Requirement Add Karein (Min: 5 chars, Max: 2000 chars)
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              value={newRequirement}
              onChange={(e) => {
                setNewRequirement(e.target.value);
                if (localValidationErrors.newRequirement) setLocalValidationErrors({});
              }}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Please send your brand logo and color preferences..."
              error={!!allErrors.newRequirement || !!allErrors.requirements}
              helperText={allErrors.newRequirement || allErrors.requirements || "Minimum 5 characters"}
              sx={textFieldStyle}
            />
            <Button
              variant="contained"
              onClick={handleAddRequirement}
              disabled={!newRequirement.trim() || requirements.length >= 10}
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
            <Typography
              variant="caption"
              sx={{ 
                display: "block", 
                mt: 1, 
                color: newRequirement.length >= 5 ? "#4caf50" : theme.primaryOrange 
              }}
            >
              {newRequirement.length}/2000 characters {newRequirement.length >= 5 ? "✓" : "(Min. 5 needed)"}
            </Typography>
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
              Added Requirements ({requirements.length}/10) — Max: 10 requirements
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