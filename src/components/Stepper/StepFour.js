import { Add, Delete, PriorityHigh } from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    IconButton,
    TextField,
    Typography
} from "@mui/material";
import { useCallback } from "react";

const RequirementItem = ({ requirement, index, onUpdate, onRemove, isLast, onAddNew }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
        <PriorityHigh color="action" />
      </Box>
      <TextField
        fullWidth
        multiline
        minRows={2}
        value={requirement}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder="What information do you need from the buyer to get started? (e.g., 'Please provide your brand colors')"
        variant="outlined"
      />
      <IconButton 
        onClick={() => onRemove(index)} 
        color="error"
        sx={{ mt: 1 }}
        disabled={index === 0}
      >
        <Delete />
      </IconButton>
    </Box>
  );
};

const StepFour = ({
  requirements,
  setRequirements,
  isError,
  errorMessage
}) => {
  const handleAddRequirement = useCallback(() => {
    setRequirements(prev => [...prev, ""]);
  }, [setRequirements]);

  const handleRemoveRequirement = useCallback((index) => {
    setRequirements(prev => prev.filter((_, i) => i !== index));
  }, [setRequirements]);

  const handleUpdateRequirement = useCallback((index, value) => {
    setRequirements(prev => prev.map((req, i) => i === index ? value : req));
  }, [setRequirements]);

  const hasEmptyRequirements = requirements.some(req => !req.trim());

  return (
    <Box className="step-four">
      <Typography variant="h5" gutterBottom>
        Requirements from Buyers
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Specify what information you need from buyers to start working on their order.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Add Requirements ({requirements.length} added)
              </Typography>
              
              {requirements.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" color="textSecondary" gutterBottom>
                    No requirements added yet
                  </Typography>
                  <Typography variant="body2" color="textSecondary" paragraph>
                    Add questions or information you need from buyers to start working.
                  </Typography>
                  <Button startIcon={<Add />} onClick={handleAddRequirement} variant="contained">
                    Add Your First Requirement
                  </Button>
                </Box>
              ) : (
                <Box>
                  {requirements.map((requirement, index) => (
                    <RequirementItem
                      key={index}
                      requirement={requirement}
                      index={index}
                      onUpdate={handleUpdateRequirement}
                      onRemove={handleRemoveRequirement}
                      isLast={index === requirements.length - 1}
                      onAddNew={handleAddRequirement}
                    />
                  ))}
                  
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Button 
                      startIcon={<Add />} 
                      onClick={handleAddRequirement}
                      variant="outlined"
                      disabled={requirements.length >= 10}
                    >
                      Add Another Requirement ({requirements.length}/10)
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {hasEmptyRequirements && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Some requirements are empty. Please fill in all requirement fields or remove them.
            </Alert>
          )}
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                💡 Requirement Examples
              </Typography>
              <Typography variant="body2" component="div">
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li>What is your target audience?</li>
                  <li>Please share your brand guidelines</li>
                  <li>What is your preferred color scheme?</li>
                  <li>Do you have any reference examples?</li>
                  <li>What is your deadline?</li>
                  <li>What is your budget range?</li>
                </ul>
              </Typography>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Best Practices
              </Typography>
              <Typography variant="body2">
                • Be clear and specific about what you need<br/>
                • Ask for relevant information only<br/>
                • Keep requirements concise<br/>
                • Consider making some requirements optional<br/>
                • Update requirements based on past projects
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepFour;