import { Add, Delete, HelpOutline, Quiz } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
  Fade
} from '@mui/material';
import { useEffect, useState } from 'react';

const FAQ = ({ formData = {}, updateFormData, validationErrors = {}, isEditMode = false }) => {
  const { faqs = [] } = formData;
  
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
    mediumBorder: "rgba(255, 255, 255, 0.07)",
    orangeBorderActive: "rgba(240, 89, 31, 0.4)",
    secondaryBlueBlur: "rgba(59, 130, 246, 0.05)"
  };

  const [newFaq, setNewFaq] = useState({
    question: '',
    answer: ''
  });

  const handleAddFaq = () => {
    if (newFaq.question.trim() && newFaq.answer.trim()) {
      const updatedFaqs = [...faqs, { 
        ...newFaq, 
        id: Date.now(),
        question: newFaq.question.trim(),
        answer: newFaq.answer.trim()
      }];
      updateFormData({ faqs: updatedFaqs });
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleRemoveFaq = (index) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    updateFormData({ faqs: updatedFaqs });
  };

  const handleUpdateFaq = (index, field, value) => {
    const updatedFaqs = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    updateFormData({ faqs: updatedFaqs });
  };

  // Reusable TextField Style
  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      color: theme.pureWhite,
      bgcolor: 'rgba(255,255,255,0.01)',
      '& fieldset': { borderColor: theme.lightBorder },
      '&:hover fieldset': { borderColor: theme.mediumBorder },
      '&.Mui-focused fieldset': { borderColor: theme.primaryOrange },
    },
    '& .MuiInputLabel-root': { color: theme.bodyGrayText },
    '& .MuiInputLabel-root.Mui-focused': { color: theme.primaryOrange },
    '& .MuiFormHelperText-root': { color: theme.bodyGrayText }
  };

  // Character count helpers
  const qChars = newFaq.question.length;
  const aChars = newFaq.answer.length;
  const FAQ_QUESTION_MAX = 500;
  const FAQ_ANSWER_MAX = 2000;
  const FAQ_MIN_CHARS = 10;
  const FAQ_MAX_COUNT = 10;

  return (
    <Box sx={{ bgcolor: theme.mainBg, minHeight: '100%', borderRadius: 2 }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ color: theme.pureWhite }}>
          Frequently Asked <span style={{ color: theme.primaryOrange }}>Questions</span>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.bodyGrayText }}>
          Common sawalat add karein taake buyers aapki service ko behter samajh sakein.
          {isEditMode && (
            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: theme.primaryOrange }}>
              • {faqs.length} existing FAQ{faqs.length !== 1 ? 's' : ''} active
            </Typography>
          )}
        </Typography>
      </Box>

      {validationErrors.faqs && (
        <Alert severity="error" variant="outlined" sx={{ mb: 3, color: '#ff5252', borderColor: '#ff5252', bgcolor: 'rgba(255, 82, 82, 0.05)' }}>
          {validationErrors.faqs}
        </Alert>
      )}

      {/* Add New FAQ Card */}
      <Card sx={{ 
        mb: 4, 
        bgcolor: theme.cardBg, 
        border: `1px solid ${theme.lightBorder}`,
        backdropFilter: 'blur(10px)',
        borderRadius: 3
      }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ color: theme.pureWhite, display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <HelpOutline sx={{ color: theme.primaryOrange }} />
            Naya Sawal Add Karein (Min: {FAQ_MIN_CHARS} chars each, Max: {FAQ_MAX_COUNT} FAQs)
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={`Sawal (Question) (${qChars}/${FAQ_QUESTION_MAX}) — Min: ${FAQ_MIN_CHARS} chars`}
                value={newFaq.question}
                onChange={(e) => {
                  if (e.target.value.length <= FAQ_QUESTION_MAX) {
                    setNewFaq({ ...newFaq, question: e.target.value });
                  }
                }}
                placeholder="e.g., Kya aap fast delivery provide karte hain?"
                sx={textFieldStyle}
              />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: qChars >= FAQ_MIN_CHARS ? '#4caf50' : theme.primaryOrange }}>
                {qChars}/{FAQ_QUESTION_MAX} characters
                {qChars < FAQ_MIN_CHARS && <span> — Need {FAQ_MIN_CHARS - qChars} more chars</span>}
                {qChars >= FAQ_MIN_CHARS && <span> ✓ Min reached</span>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={`Jawab (Answer) (${aChars}/${FAQ_ANSWER_MAX}) — Min: ${FAQ_MIN_CHARS} chars`}
                value={newFaq.answer}
                onChange={(e) => {
                  if (e.target.value.length <= FAQ_ANSWER_MAX) {
                    setNewFaq({ ...newFaq, answer: e.target.value });
                  }
                }}
                placeholder="Apna wazeh jawab yahan likhein..."
                sx={textFieldStyle}
              />
              <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: aChars >= FAQ_MIN_CHARS ? '#4caf50' : theme.primaryOrange }}>
                {aChars}/{FAQ_ANSWER_MAX} characters
                {aChars < FAQ_MIN_CHARS && <span> — Need {FAQ_MIN_CHARS - aChars} more chars</span>}
                {aChars >= FAQ_MIN_CHARS && <span> ✓ Min reached</span>}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleAddFaq}
                disabled={!newFaq.question.trim() || !newFaq.answer.trim() || qChars < FAQ_MIN_CHARS || aChars < FAQ_MIN_CHARS || faqs.length >= FAQ_MAX_COUNT}
                startIcon={<Add />}
                sx={{ 
                  bgcolor: theme.primaryOrange, 
                  '&:hover': { bgcolor: '#d44a19' },
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  px: 4
                }}
              >
                Add to List
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Existing FAQs List */}
      <Typography variant="h6" sx={{ color: theme.mediumGrayTitle, mb: 2, px: 1 }}>
        Saved FAQs ({faqs.length}/{FAQ_MAX_COUNT}) — Min: 1 FAQ, Max: {FAQ_MAX_COUNT} FAQs
      </Typography>

      {faqs.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {faqs.map((faq, index) => (
            <Fade in key={faq.id || index}>
              <Card sx={{ 
                bgcolor: theme.cardBgActive, 
                border: `1px solid ${theme.lightBorder}`,
                borderRadius: 2,
                position: 'relative',
                '&:hover': { borderColor: theme.orangeBorderActive }
              }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        label={`Question ${index + 1} (${(faq.question || '').length}/${FAQ_QUESTION_MAX})`}
                        value={faq.question || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= FAQ_QUESTION_MAX) {
                            handleUpdateFaq(index, 'question', e.target.value);
                          }
                        }}
                        sx={{ ...textFieldStyle, mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        multiline
                        size="small"
                        rows={2}
                        label={`Answer ${index + 1} (${(faq.answer || '').length}/${FAQ_ANSWER_MAX})`}
                        value={faq.answer || ''}
                        onChange={(e) => {
                          if (e.target.value.length <= FAQ_ANSWER_MAX) {
                            handleUpdateFaq(index, 'answer', e.target.value);
                          }
                        }}
                        sx={textFieldStyle}
                      />
                    </Box>
                    <IconButton
                      onClick={() => handleRemoveFaq(index)}
                      sx={{ 
                        color: '#ff5252', 
                        bgcolor: 'rgba(255, 82, 82, 0.05)',
                        '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.1)' },
                        height: '40px'
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      ) : (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'rgba(255,255,255,0.01)', 
          border: `1px dashed ${theme.lightBorder}`,
          borderRadius: 3 
        }}>
          <Quiz sx={{ fontSize: 40, color: theme.bodyGrayText, mb: 1 }} />
          <Typography sx={{ color: theme.bodyGrayText }}>
            Abhi tak koi FAQ add nahi kiya gaya.
          </Typography>
        </Box>
      )}

      {/* Pro Tips Section */}
      <Box sx={{ 
        mt: 5, 
        p: 3, 
        bgcolor: theme.secondaryBlueBlur, 
        borderRadius: 3,
        border: `1px solid ${theme.lightBorder}`
      }}>
        <Typography variant="subtitle2" gutterBottom sx={{ color: theme.pureWhite, display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ color: theme.primaryOrange }}>💡</span> Pro Tips for Best Results:
        </Typography>
        <Typography variant="body2" component="div" sx={{ color: theme.mediumGrayTitle }}>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8 }}>
            <li>Common <b style={{color: theme.pureWhite}}>Customer Concerns</b> ko address karein.</li>
            <li>Delivery time aur revision policy wazeh karein.</li>
            <li>Jawab ko <b style={{color: theme.pureWhite}}>Short aur Informative</b> rakhein.</li>
            <li>Har sawal ko professionally handle karein.</li>
          </ul>
        </Typography>
      </Box>
    </Box>
  );
};

export default FAQ;
