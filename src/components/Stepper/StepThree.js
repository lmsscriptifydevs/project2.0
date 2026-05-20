import {
  Box,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Alert
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useCallback } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const FAQItem = ({ faq, index, onUpdate, onRemove, isLast, onAddNew }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6">FAQ {index + 1}</Typography>
          <IconButton onClick={() => onRemove(index)} color="error">
            <Delete />
          </IconButton>
        </Box>
        
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Question"
              value={faq.question}
              onChange={(e) => onUpdate(index, 'question', e.target.value)}
              placeholder="What information do you need to get started?"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Answer"
              value={faq.answer}
              onChange={(e) => onUpdate(index, 'answer', e.target.value)}
              placeholder="I'll need your brand guidelines, preferred colors, and any reference materials."
            />
          </Grid>
        </Grid>
        
        {isLast && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Button startIcon={<Add />} onClick={onAddNew} variant="outlined">
              Add Another FAQ
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const StepThree = ({
  description,
  setDescription,
  faqs,
  setFaqs,
  isError,
  errorMessage
}) => {
  // Remove unused activeFAQ state

  const handleAddFAQ = useCallback(() => {
    setFaqs(prev => [...prev, { question: "", answer: "" }]);
  }, [setFaqs]);

  const handleRemoveFAQ = useCallback((index) => {
    setFaqs(prev => prev.filter((_, i) => i !== index));
  }, [setFaqs]);

  const handleUpdateFAQ = useCallback((index, field, value) => {
    setFaqs(prev =>
      prev.map((faq, i) =>
        i === index ? { ...faq, [field]: value } : faq
      )
    );
  }, [setFaqs]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image'
  ];

  const characterCount = description.replace(/<[^>]*>/g, '').length;

  return (
    <Box className="step-three">
      <Typography variant="h5" gutterBottom>
        Description & FAQ
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Describe your service in detail and add frequently asked questions.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Description Editor */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Gig Description
          </Typography>
          <Typography variant="body2" color="textSecondary" paragraph>
            Describe what you offer, your process, and what makes you unique. ({characterCount}/2000 characters)
          </Typography>
          
          <Box sx={{ mb: 2 }}>
            <ReactQuill
              value={description}
              onChange={setDescription}
              modules={modules}
              formats={formats}
              theme="snow"
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mt: 6,
            p: 1,
            backgroundColor: characterCount < 120 ? '#ffebee' : characterCount > 2000 ? '#fff3e0' : '#e8f5e8',
            borderRadius: 1
          }}>
            <Typography variant="caption">
              {characterCount < 120 
                ? `Minimum 120 characters required (${120 - characterCount} more needed)`
                : characterCount > 2000
                ? `Maximum 2000 characters exceeded (${characterCount - 2000} over)`
                : `${characterCount}/2000 characters - Good length`
              }
            </Typography>
            <Typography variant="caption">
              {characterCount} characters
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Frequently Asked Questions
            </Typography>
            <Button 
              startIcon={<Add />} 
              onClick={handleAddFAQ}
              variant="contained"
              disabled={faqs.length >= 10}
            >
              Add FAQ ({faqs.length}/10)
            </Button>
          </Box>

          {faqs.length === 0 ? (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button startIcon={<Add />} onClick={handleAddFAQ} variant="outlined">
                Add Your First FAQ
              </Button>
            </Box>
          ) : (
            <Box>
              {faqs.map((faq, index) => (
                <FAQItem
                  key={index}
                  faq={faq}
                  index={index}
                  onUpdate={handleUpdateFAQ}
                  onRemove={handleRemoveFAQ}
                  isLast={index === faqs.length - 1}
                  onAddNew={handleAddFAQ}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Description Tips */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Description Tips
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li>Start with a compelling introduction</li>
                  <li>Clearly state what you offer</li>
                  <li>Describe your process step by step</li>
                  <li>Highlight your unique selling points</li>
                  <li>Include what makes you different from others</li>
                  <li>End with a clear call to action</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepThree;