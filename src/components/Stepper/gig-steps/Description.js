import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
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
  Chip,
  Snackbar,
  Alert
} from '@mui/material';
import ReactQuill from 'react-quill';
import EmojiPicker, { Theme as EmojiTheme } from 'emoji-picker-react';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import ShutterSpeedIcon from '@mui/icons-material/ShutterSpeed';

// Quill styles
import 'react-quill/dist/quill.snow.css';

const MIN_CHARS = 1500;
const MAX_CHARS = 3000;

const Description = forwardRef(({ formData = {}, updateFormData, validationErrors = {}, isEditMode = false }, ref) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShaking, setIsShaking] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const quillRef = useRef(null);

  const description = formData.description || '';
  const plainText = description.replace(/<[^>]*>/g, '').trim();
  const charCount = plainText.length;

  // Expose shake trigger to parent
  useImperativeHandle(ref, () => ({
    triggerShake: () => {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
    },
    showErrorToast: () => {
      setShowErrorToast(true);
    },
    getCharCount: () => charCount
  }));

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
    if (charCount < 750) return { label: 'Needs More Work', color: '#ef4444', percent: (charCount / MIN_CHARS) * 100 };
    if (charCount < 1000) return { label: 'Good', color: '#f59e0b', percent: (charCount / MIN_CHARS) * 100 };
    if (charCount < MIN_CHARS) return { label: 'Better', color: '#8bc34a', percent: (charCount / MIN_CHARS) * 100 };
    if (charCount <= MAX_CHARS) return { label: 'Perfect! You can now proceed.', color: '#22c55e', percent: 100 };
    return { label: 'Too Long', color: '#ef4444', percent: 100 };
  };

  const quality = getQualityInfo();

  // --- Remaining characters calculation ---
  const getRemainingMessage = () => {
    if (charCount === 0) return `Need ${MIN_CHARS} more characters to continue.`;
    if (charCount < MIN_CHARS) {
      const remaining = MIN_CHARS - charCount;
      return `Need ${remaining} more character${remaining === 1 ? '' : 's'} to continue.`;
    }
    if (charCount > MAX_CHARS) {
      const over = charCount - MAX_CHARS;
      return `${over} character${over === 1 ? '' : 's'} over the limit. Please reduce.`;
    }
    return 'Perfect! You can now proceed.';
  };

  // --- Progress bar color based on zones ---
  const getProgressColor = () => {
    if (charCount < MIN_CHARS * 0.5) return '#ef4444'; // Red: 0% - 50%
    if (charCount < MIN_CHARS) return '#f59e0b'; // Orange/Yellow: 50% - 99%
    if (charCount <= MAX_CHARS) return '#22c55e'; // Green: 100%+
    return '#ef4444'; // Red if over limit
  };

  const getProgressPercent = () => {
    const pct = (charCount / MIN_CHARS) * 100;
    return Math.min(pct, 100);
  };

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

  const handleCloseToast = () => setShowErrorToast(false);

  return (
    <Box sx={{ maxWidth: '850px', margin: 'auto', bgcolor: theme.mainBg, p: { xs: 2, md: 4 }, borderRadius: 3 }}>

      {/* Shake animation keyframes */}
      <style>{`
        @keyframes quill-shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .shake-animation {
          animation: quill-shake 0.6s ease-in-out;
        }
      `}</style>

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
            bgcolor: `${quality.color}11`
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
            CONTENT ({charCount}/{MAX_CHARS}) — Min: {MIN_CHARS} chars
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
          className={isShaking ? 'shake-animation' : ''}
          sx={{
            bgcolor: theme.cardBg,
            borderColor: !!validationErrors.description ? '#ef4444' : isShaking ? '#ef4444' : theme.lightBorder,
            borderRadius: '12px',
            overflow: 'hidden',
            transition: 'border-color 0.3s ease',
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

        {/* --- Dynamic Remaining Characters Message --- */}
        <Box sx={{ mt: 2, mb: 1 }}>
          <Typography
            variant="body2"
            sx={{
              color: charCount >= MIN_CHARS && charCount <= MAX_CHARS ? '#22c55e' : charCount > MAX_CHARS ? '#ef4444' : '#f59e0b',
              fontWeight: '600',
              textAlign: 'center',
              fontSize: '0.9rem'
            }}
          >
            {getRemainingMessage()}
          </Typography>
        </Box>

        {/* --- Visual Progress Bar with Color Zones --- */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
            <Typography variant="caption" sx={{ color: theme.mediumGrayTitle, fontWeight: 'bold' }}>
              Quality Meter:
            </Typography>
            <Typography variant="caption" sx={{ color: getProgressColor(), fontWeight: 'bold' }}>
              {Math.round(getProgressPercent())}%
            </Typography>
          </Stack>

          <Box sx={{
            height: '12px',
            bgcolor: 'rgba(255,255,255,0.05)',
            borderRadius: 5,
            position: 'relative',
            overflow: 'hidden',
            border: `1px solid ${theme.lightBorder}`
          }}>
            {/* Background zone markers */}
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '50%',
              height: '100%',
              bgcolor: 'rgba(239, 68, 68, 0.08)',
              borderRight: '1px dashed rgba(239, 68, 68, 0.3)'
            }} />
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: '50%',
              width: '49%',
              height: '100%',
              bgcolor: 'rgba(245, 158, 11, 0.08)',
              borderRight: '1px dashed rgba(34, 197, 94, 0.5)'
            }} />

            {/* Active progress fill */}
            <Box sx={{
              width: `${getProgressPercent()}%`,
              height: '100%',
              bgcolor: getProgressColor(),
              transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 0 12px ${getProgressColor()}88`,
              borderRadius: 5,
              position: 'relative',
              zIndex: 1
            }} />
          </Box>

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5, px: 0.5 }}>
            <Typography variant="caption" sx={{ color: theme.bodyGrayText, fontSize: '0.65rem' }}>START</Typography>
            <Typography variant="caption" sx={{ color: charCount >= MIN_CHARS * 0.5 ? '#f59e0b' : theme.bodyGrayText, fontSize: '0.65rem' }}>50%</Typography>
            <Typography variant="caption" sx={{ color: charCount >= MIN_CHARS ? '#22c55e' : theme.bodyGrayText, fontSize: '0.65rem' }}>MIN ({MIN_CHARS})</Typography>
            <Typography variant="caption" sx={{ color: charCount > MAX_CHARS ? '#ef4444' : theme.bodyGrayText, fontSize: '0.65rem' }}>MAX ({MAX_CHARS})</Typography>
          </Stack>
        </Box>

        <FormHelperText sx={{ color: !!validationErrors.description ? '#ef4444' : theme.bodyGrayText, mt: 2 }}>
          {validationErrors.description || "Detailed descriptions increase your chances of getting hired by 80%."}
        </FormHelperText>
      </FormControl>

      {/* Error Toast for insufficient characters */}
      <Snackbar
        open={showErrorToast}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseToast}
          severity="error"
          sx={{
            width: '100%',
            bgcolor: 'rgba(239, 68, 68, 0.15)',
            color: '#ffffff',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            '& .MuiAlert-icon': { color: '#ef4444' }
          }}
        >
          Aapki gig description abhi choti hai. Barae meharbani {MIN_CHARS - charCount} mazeed characters likhein taake aap next step par ja sakein.
        </Alert>
      </Snackbar>
    </Box>
  );
});

Description.displayName = 'Description';

export default Description;