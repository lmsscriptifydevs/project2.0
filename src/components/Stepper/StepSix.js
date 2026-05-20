import {
  CheckCircle,
  Error,
  Publish,
  Visibility,
  Warning
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

const ValidationCheck = ({ valid, message }) => (
  <ListItem>
    <ListItemIcon>
      {valid ? (
        <CheckCircle color="success" />
      ) : (
        <Error color="error" />
      )}
    </ListItemIcon>
    <ListItemText 
      primary={message}
      sx={{ color: valid ? 'success.main' : 'error.main' }}
    />
  </ListItem>
);

const StepSix = ({ gigData, isLoading, onPublish }) => {
  const [validation, setValidation] = useState({
    overview: false,
    pricing: false,
    description: false,
    requirements: false,
    gallery: false
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Validate all steps
  useEffect(() => {
    const newValidation = {
      overview: Boolean(
        gigData.gigTitle?.length >= 10 &&
        gigData.category &&
        gigData.subCategory &&
        gigData.tags?.length > 0
      ),
      pricing: Boolean(
        gigData.basicPackage &&
        gigData.standerdPackage &&
        gigData.premiumPackage &&
        gigData.totalBasic !== "$" &&
        gigData.totalStand !== "$" &&
        gigData.totalPremium !== "$"
      ),
      description: Boolean(
        gigData.description?.replace(/<[^>]*>/g, '').length >= 120
      ),
      requirements: Boolean(
        gigData.requirements?.length > 0 &&
        gigData.requirements.every(req => req.trim())
      ),
      gallery: Boolean(gigData.uploadedImages?.length >= 1)
    };

    setValidation(newValidation);

    // Calculate completion percentage
    const validCount = Object.values(newValidation).filter(Boolean).length;
    const percentage = (validCount / Object.keys(newValidation).length) * 100;
    setCompletionPercentage(percentage);
  }, [gigData]);

  const isReadyToPublish = Object.values(validation).every(Boolean);

  const handlePreview = useCallback(() => {
    // Open gig preview in new tab
    console.log('Preview gig:', gigData);
    // Implement preview functionality
  }, [gigData]);

  const handleSaveAsDraft = useCallback(() => {
    // Save as draft functionality
    console.log('Save as draft:', gigData);
    // Implement draft saving
  }, [gigData]);

  return (
    <Box className="step-six">
      <Typography variant="h4" gutterBottom align="center">
        {gigData.isDraft ? "Publish Your Gig" : "Review Your Gig"}
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" paragraph>
        Review all information before publishing your gig
      </Typography>

      <Grid container spacing={4}>
        {/* Validation Summary */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ready to Publish?
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Completion</Typography>
                  <Typography variant="body2">{Math.round(completionPercentage)}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completionPercentage}
                  color={isReadyToPublish ? "success" : "primary"}
                />
              </Box>

              <List dense>
                <ValidationCheck 
                  valid={validation.overview}
                  message="Gig overview completed"
                />
                <ValidationCheck 
                  valid={validation.pricing}
                  message="Pricing packages set"
                />
                <ValidationCheck 
                  valid={validation.description}
                  message="Description meets requirements"
                />
                <ValidationCheck 
                  valid={validation.requirements}
                  message="Buyer requirements added"
                />
                <ValidationCheck 
                  valid={validation.gallery}
                  message="Gallery images uploaded"
                />
              </List>

              <Divider sx={{ my: 2 }} />

              {isReadyToPublish ? (
                <Alert severity="success" icon={<CheckCircle />}>
                  Your gig is ready to publish!
                </Alert>
              ) : (
                <Alert severity="warning" icon={<Warning />}>
                  Complete all sections to publish your gig
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Gig Summary */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Gig Summary
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Title</Typography>
                  <Typography variant="body1">{gigData.gigTitle}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                  <Typography variant="body1">
                    {gigData.category} • {gigData.subCategory}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Packages</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Chip 
                      label={`Basic: ${gigData.totalBasic}`} 
                      variant="outlined"
                      color={gigData.basicPackage ? "primary" : "default"}
                    />
                    <Chip 
                      label={`Standard: ${gigData.totalStand}`} 
                      variant="outlined"
                      color={gigData.standerdPackage ? "primary" : "default"}
                    />
                    <Chip 
                      label={`Premium: ${gigData.totalPremium}`} 
                      variant="outlined"
                      color={gigData.premiumPackage ? "primary" : "default"}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Tags</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                    {gigData.tags?.map((tag, index) => (
                      <Chip key={index} label={tag} size="small" />
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary">Media</Typography>
                  <Typography variant="body2">
                    {gigData.uploadedImages?.length || 0} images, 
                    {gigData.uploadedVideos?.length || 0} videos, 
                    {gigData.uploadedPDFs?.length || 0} PDFs
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary">Description Preview</Typography>
                  <Typography variant="body2" sx={{ 
                    mt: 1,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {gigData.description?.replace(/<[^>]*>/g, '').substring(0, 200)}...
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
            <Button
              startIcon={<Visibility />}
              onClick={handlePreview}
              variant="outlined"
              size="large"
            >
              Preview Gig
            </Button>
            
            <Box sx={{ flex: 1 }} />
            
            {gigData.isDraft && (
              <Button
                onClick={handleSaveAsDraft}
                variant="outlined"
                size="large"
                disabled={isLoading}
              >
                Save as Draft
              </Button>
            )}
            
            <Button
              startIcon={<Publish />}
              onClick={onPublish}
              variant="contained"
              size="large"
              disabled={!isReadyToPublish || isLoading}
              sx={{ minWidth: 200 }}
            >
              {isLoading ? "Publishing..." : "Publish Gig"}
            </Button>
          </Box>

          {/* Publishing Tips */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2">
              <strong>After publishing:</strong><br/>
              • Your gig will be reviewed within 24-48 hours<br/>
              • You can track performance in your seller dashboard<br/>
              • Promote your gig on social media for better visibility<br/>
              • Respond quickly to buyer inquiries for better ratings
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepSix;