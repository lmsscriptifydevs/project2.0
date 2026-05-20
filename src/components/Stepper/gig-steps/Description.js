import React, { useState, useRef } from 'react';
import { 
  Box, 
  FormControl, 
  FormHelperText, 
  FormLabel, 
  Typography, 
  Paper,
  IconButton,
  Popover,
  Stack,
  Chip
} from '@mui/material';
import ReactQuill from 'react-quill';
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';

// Quill styles
import 'react-quill/dist/quill.snow.css';

const Description = ({ formData = {}, updateFormData, validationErrors = {}, isEditMode = false }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const quillRef = useRef(null);
  
  const description = formData.description || '';
  const plainText = description.replace(/<[^>]*>/g, '').trim();
  const charCount = plainText.length;

  // GrapeTask Dark Theme Schema
  const theme = {
    mainBg: "#020617",
    cardBg: "rgba(255, 255, 255, 0.02)",
    primaryOrange: "#f0591f",
    pureWhite: "#ffffff",
    mediumGrayTitle: "#a1a1aa",
    bodyGrayText: "#71717a",
    lightBorder: "rgba(255, 255, 255, 0.06)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)"
  };

  // --- Quality Status Logic ---
  const getQualityInfo = () => {
    if (charCount === 0) return { label: 'Empty', color: theme.bodyGrayText, percent: 0 };
    if (charCount < 750) return { label: 'Needs More Work', color: theme.primaryOrange, percent: (charCount / 750) * 33 };
    if (charCount < 1000) return { label: 'Good', color: '#ffb300', percent: 50 };
    if (charCount < 1500) return { label: 'Better', color: '#8bc34a', percent: 75 };
    return { label: 'Best / Professional', color: '#4caf50', percent: 100 };
  };

  const quality = getQualityInfo();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean'],
    ],
  };

  const handleDescriptionChange = (content) => {
    updateFormData({ description: content });
  };

  const handleEmojiClick = (emojiData) => {
    const quill = quillRef.current.getEditor();
    const range = quill.getSelection(true);
    quill.insertText(range.index, emojiData.emoji);
    quill.setSelection(range.index + emojiData.emoji.length);
    setAnchorEl(null);
  };

  const openEmoji = (event) => setAnchorEl(event.currentTarget);
  const closeEmoji = () => setAnchorEl(null);
  const isEmojiOpen = Boolean(anchorEl);

  return (
    <Box sx={{ maxWidth: '850px', margin: 'auto', bgcolor: theme.mainBg, p: { xs: 2, md: 4 }, borderRadius: 3 }}>
      
      {/* Header Section with Quality Badge */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: theme.pureWhite, mb: 0.5 }}>
            Gig <span style={{ color: theme.primaryOrange }}>Description</span>
          </Typography>
          <Typography variant="body2" sx={{ color: theme.bodyGrayText }}>
            Apni service ki mukammal detail likhein.
          </Typography>
        </Box>
        
        <Chip 
          icon={<ShutterSpeedIcon style={{ color: quality.color }} />}
          label={quality.label}
          variant="outlined"
          sx={{ 
            borderColor: quality.color, 
            color: quality.color, 
            fontWeight: 'bold',
            bgcolor: `${quality.color}11` // Adding 11 for very light transparency
          }}
        />
      </Stack>

      <FormControl fullWidth error={!!validationErrors.description}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
          <FormLabel sx={{ 
            fontWeight: '600', 
            color: theme.mediumGrayTitle,
            fontSize: '0.85rem',
            letterSpacing: '0.5px',
            '&.Mui-focused': { color: theme.primaryOrange }
          }}>
            CONTENT ({charCount}/3000) — Min: 1500 chars
          </FormLabel>
          
          <IconButton 
            onClick={openEmoji}
            sx={{ 
              color: theme.primaryOrange, 
              bgcolor: theme.cardBg,
              border: `1px solid ${theme.lightBorder}`,
              borderRadius: '8px',
              '&:hover': { bgcolor: theme.secondaryBlueBlur, borderColor: theme.primaryOrange }
            }}
          >
            <AddReactionOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Editor Wrapper */}
        <Paper 
          variant="outlined" 
          sx={{ 
            bgcolor: theme.cardBg,
            borderColor: !!validationErrors.description ? '#ef4444' : theme.lightBorder,
            borderRadius: '12px',
            overflow: 'hidden',
            '&:focus-within': { borderColor: theme.orangeBorderActive },
            '& .ql-toolbar': {
              border: 'none',
              borderBottom: `1px solid ${theme.lightBorder}`,
              bgcolor: 'rgba(255,255,255,0.03)',
            },
            '& .ql-toolbar .ql-stroke': { stroke: theme.mediumGrayTitle },
            '& .ql-toolbar .ql-fill': { fill: theme.mediumGrayTitle },
            '& .ql-toolbar .ql-picker': { color: theme.mediumGrayTitle },
            '& .ql-container': {
              border: 'none',
              minHeight: '320px',
              fontSize: '16px',
              color: theme.pureWhite,
            },
            '& .ql-editor': { minHeight: '320px' },
            '& .ql-editor.ql-blank::before': { color: theme.bodyGrayText, fontStyle: 'normal' }
          }}
        >
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={description} 
            onChange={handleDescriptionChange}
            modules={modules}
            placeholder="I will provide professional services for..."
          />
        </Paper>

        <Popover
          open={isEmojiOpen} anchorEl={anchorEl} onClose={closeEmoji}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { border: 'none', mt: 1, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' } }}
        >
          <EmojiPicker onEmojiClick={handleEmojiClick} theme={EmojiTheme.DARK} width={300} height={400} />
        </Popover>

        {/* --- Dynamic Good/Better/Best Progress Bar --- */}
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.mediumGrayTitle, fontWeight: 'bold' }}>
              Quality Meter:
            </Typography>
            <Typography variant="caption" sx={{ color: quality.color, fontWeight: 'bold' }}>
              {charCount < 750 ? `${750 - charCount} chars for 'Good'` : quality.label}
            </Typography>
          </Stack>
          
          <Box sx={{ 
            height: '10px', 
            bgcolor: 'rgba(255,255,255,0.05)', 
            borderRadius: 5, 
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${theme.lightBorder}`
          }}>
            <Box sx={{ 
              width: `${quality.percent}%`, 
              height: '100%', 
              bgcolor: quality.color, 
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 10px ${quality.color}66`
            }} />
          </Box>
          
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 0.5 }}>
            <Typography variant="caption" sx={{ color: theme.bodyGrayText, fontSize: '0.65rem' }}>START</Typography>
            <Typography variant="caption" sx={{ color: charCount >= 750 ? '#ffb300' : theme.bodyGrayText, fontSize: '0.65rem' }}>GOOD (750)</Typography>
            <Typography variant="caption" sx={{ color: charCount >= 1000 ? '#8bc34a' : theme.bodyGrayText, fontSize: '0.65rem' }}>BETTER (1000)</Typography>
            <Typography variant="caption" sx={{ color: charCount >= 1500 ? '#4caf50' : theme.bodyGrayText, fontSize: '0.65rem' }}>BEST (1500+)</Typography>
          </Stack>
        </Box>

        <FormHelperText sx={{ color: !!validationErrors.description ? '#ef4444' : theme.bodyGrayText, mt: 2 }}>
          {validationErrors.description || "Detailed descriptions increase your chances of getting hired by 80%."}
        </FormHelperText>
      </FormControl>

      
    </Box>
  );
};

export default Description;