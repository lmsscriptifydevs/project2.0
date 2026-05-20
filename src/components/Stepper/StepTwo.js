import { Add, Remove } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from "@mui/material";
import { useCallback } from "react";

const PackageCard = ({ 
  title, 
  packageDescription,
  onDescriptionChange,
  price,
  onPriceChange,
  deliveryTime,
  onDeliveryChange,
  revisions,
  onRevisionsChange,
  includesSource,
  onSourceChange,
  includesHighRes,
  onHighResChange,
  isError
}) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      <Typography variant="h6" gutterBottom color="primary">
        {title}
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Package Description"
            value={packageDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder={`What's included in ${title.toLowerCase()} package`}
            error={isError && !packageDescription}
            helperText={isError && !packageDescription ? "Required" : ""}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Price"
            value={price}
            onChange={(e) => onPriceChange(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>
            }}
            error={isError && (!price || price === "$")}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Delivery Time</InputLabel>
            <Select
              value={deliveryTime}
              onChange={onDeliveryChange}
              label="Delivery Time"
              error={isError && !deliveryTime}
            >
              <MenuItem value="1">1 day</MenuItem>
              <MenuItem value="2">2 days</MenuItem>
              <MenuItem value="3">3 days</MenuItem>
              <MenuItem value="5">5 days</MenuItem>
              <MenuItem value="7">7 days</MenuItem>
              <MenuItem value="10">10 days</MenuItem>
              <MenuItem value="14">14 days</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Number of Revisions</InputLabel>
            <Select
              value={revisions}
              onChange={onRevisionsChange}
              label="Number of Revisions"
            >
              <MenuItem value="0">0 revisions</MenuItem>
              <MenuItem value="1">1 revision</MenuItem>
              <MenuItem value="2">2 revisions</MenuItem>
              <MenuItem value="3">3 revisions</MenuItem>
              <MenuItem value="5">5 revisions</MenuItem>
              <MenuItem value="unlimited">Unlimited</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={includesSource}
                onChange={(e) => onSourceChange(e.target.checked ? "yes" : "no")}
                color="primary"
              />
            }
            label="Include source files"
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Switch
                checked={includesHighRes}
                onChange={(e) => onHighResChange(e.target.checked ? "yes" : "no")}
                color="primary"
              />
            }
            label="High resolution files"
          />
        </Grid>
      </Grid>
    </CardContent>
  </Card>
);

const StepTwo = (props) => {
  const {
    // Package descriptions
    basicPackage = "",
    setBasicPackage = () => {},
    standerdPackage = "",
    setStanderdPackage = () => {},
    premiumPackage = "",
    setPremiumPackage = () => {},

    // Prices
    totalBasic = "$",
    setTotalBasic = () => {},
    totalStand = "$",
    setTotalStand = () => {},
    totalPremium = "$",
    setTotalPremium = () => {},

    // Delivery times
    deliveryBasic = "",
    setDeliveryBasic = () => {},
    deliveryStadard = "",
    setDeliveryStadard = () => {},
    deliveryPremium = "",
    setDeliveryPremium = () => {},

    // Revisions
    ravisionBasic = "",
    setRavisionBasic = () => {},
    ravisionStadard = "",
    setRavisionStadard = () => {},
    ravisionPremium = "",
    setRavisionPremium = () => {},

    // Source files
    sourceFileBasice = "no",
    setSourceFileBasice = () => {},
    sourceFileStandard = "no",
    setSourceFileStandard = () => {},
    sourceFilePremium = "no",
    setSourceFilePremium = () => {},

    // Resolution files
    resolutionFileBasice = "no",
    setResolutionFileBasice = () => {},
    resolutionFileStandard = "no",
    setResolutionFileStandard = () => {},
    resolutionFilePremium = "no",
    setResolutionFilePremium = () => {},

    // Professional details
    experienceLevel = "intermediate",
    setExperienceLevel = () => {},
    languages = [],
    setLanguages = () => {},
    skills = [],
    setSkills = () => {},
    availability = "within_3_days",
    setAvailability = () => {},
    responseTime = "within_1_hour",
    setResponseTime = () => {},
    supportedFormats = [],
    setSupportedFormats = () => {},
    usageRights = "personal_use",
    setUsageRights = () => {},
    revisionsIncluded = true,
    setRevisionsIncluded = () => {},
    supportIncluded = true,
    setSupportIncluded = () => {},
    setPartialState = () => {},

    // Error handling
    isError = false,
    errorMessage = ""
  } = props;

  // Ensure these are always arrays
  const safeLanguages = Array.isArray(languages) ? languages : [];
  const safeSkills = Array.isArray(skills) ? skills : [];
  const safeSupportedFormats = Array.isArray(supportedFormats) ? supportedFormats : [];


// Languages
const handleAddLanguage = useCallback(() => {
  const currentLanguages = Array.isArray(languages) ? languages : [];
  setPartialState('languages', [...currentLanguages, { language: "", proficiency: "Fluent" }]);
}, [languages, setPartialState]);

const handleRemoveLanguage = useCallback((index) => {
  const currentLanguages = Array.isArray(languages) ? languages : [];
  setPartialState('languages', currentLanguages.filter((_, i) => i !== index));
}, [languages, setPartialState]);

const handleLanguageChange = useCallback((index, field, value) => {
  const currentLanguages = Array.isArray(languages) ? languages : [];
  setPartialState('languages', 
    currentLanguages.map((lang, i) => (i === index ? { ...lang, [field]: value } : lang))
  );
}, [languages, setPartialState]);

// Skills
const handleAddSkill = useCallback(() => {
  const currentSkills = Array.isArray(skills) ? skills : [];
  setPartialState('skills', [...currentSkills, ""]);
}, [skills, setPartialState]);

const handleRemoveSkill = useCallback((index) => {
  const currentSkills = Array.isArray(skills) ? skills : [];
  setPartialState('skills', currentSkills.filter((_, i) => i !== index));
}, [skills, setPartialState]);

const handleSkillChange = useCallback((index, value) => {
  const currentSkills = Array.isArray(skills) ? skills : [];
  setPartialState('skills', currentSkills.map((skill, i) => (i === index ? value : skill)));
}, [skills, setPartialState]);

// Supported formats
const handleSupportedFormatChange = useCallback((format) => {
  const currentFormats = Array.isArray(supportedFormats) ? supportedFormats : [];
  setPartialState('supportedFormats',
    currentFormats.includes(format) 
      ? currentFormats.filter((f) => f !== format) 
      : [...currentFormats, format]
  );
}, [supportedFormats, setPartialState]);

  // Toggles
  const handleRevisionsIncludedChange = useCallback(
    (checked) => setRevisionsIncluded(checked),
    [setRevisionsIncluded]
  );

  const handleSupportIncludedChange = useCallback(
    (checked) => setSupportIncluded(checked),
    [setSupportIncluded]
  );

  return (
    <Box className="step-two">
      <Typography variant="h5" gutterBottom>
        Pricing & Professional Details
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Set your packages and professional information.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Packages Section */}
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Packages
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <PackageCard
            title="Basic Package"
            packageDescription={basicPackage}
            onDescriptionChange={setBasicPackage}
            price={totalBasic}
            onPriceChange={setTotalBasic}
            deliveryTime={deliveryBasic}
            onDeliveryChange={(e) => setDeliveryBasic(e.target.value)}
            revisions={ravisionBasic}
            onRevisionsChange={(e) => setRavisionBasic(e.target.value)}
            includesSource={sourceFileBasice === "yes"}
            onSourceChange={setSourceFileBasice}
            includesHighRes={resolutionFileBasice === "yes"}
            onHighResChange={setResolutionFileBasice}
            isError={isError}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <PackageCard
            title="Standard Package"
            packageDescription={standerdPackage}
            onDescriptionChange={setStanderdPackage}
            price={totalStand}
            onPriceChange={setTotalStand}
            deliveryTime={deliveryStadard}
            onDeliveryChange={(e) => setDeliveryStadard(e.target.value)}
            revisions={ravisionStadard}
            onRevisionsChange={(e) => setRavisionStadard(e.target.value)}
            includesSource={sourceFileStandard === "yes"}
            onSourceChange={setSourceFileStandard}
            includesHighRes={resolutionFileStandard === "yes"}
            onHighResChange={setResolutionFileStandard}
            isError={isError}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <PackageCard
            title="Premium Package"
            packageDescription={premiumPackage}
            onDescriptionChange={setPremiumPackage}
            price={totalPremium}
            onPriceChange={setTotalPremium}
            deliveryTime={deliveryPremium}
            onDeliveryChange={(e) => setDeliveryPremium(e.target.value)}
            revisions={ravisionPremium}
            onRevisionsChange={(e) => setRavisionPremium(e.target.value)}
            includesSource={sourceFilePremium === "yes"}
            onSourceChange={setSourceFilePremium}
            includesHighRes={resolutionFilePremium === "yes"}
            onHighResChange={setResolutionFilePremium}
            isError={isError}
          />
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Professional Details */}
      <Typography variant="h6" gutterBottom>
        Professional Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Experience Level</InputLabel>
            <Select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              label="Experience Level"
            >
              <MenuItem value="beginner">Beginner</MenuItem>
              <MenuItem value="intermediate">Intermediate</MenuItem>
              <MenuItem value="expert">Expert</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Availability</InputLabel>
            <Select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              label="Availability"
            >
              <MenuItem value="within_24_hours">Within 24 hours</MenuItem>
              <MenuItem value="within_3_days">Within 3 days</MenuItem>
              <MenuItem value="within_1_week">Within 1 week</MenuItem>
              <MenuItem value="within_2_weeks">Within 2 weeks</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Response Time</InputLabel>
            <Select
              value={responseTime}
              onChange={(e) => setResponseTime(e.target.value)}
              label="Response Time"
            >
              <MenuItem value="within_1_hour">Within 1 hour</MenuItem>
              <MenuItem value="within_3_hours">Within 3 hours</MenuItem>
              <MenuItem value="within_24_hours">Within 24 hours</MenuItem>
              <MenuItem value="within_48_hours">Within 48 hours</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Usage Rights</InputLabel>
            <Select
              value={usageRights}
              onChange={(e) => setUsageRights(e.target.value)}
              label="Usage Rights"
            >
              <MenuItem value="personal_use">Personal Use</MenuItem>
              <MenuItem value="commercial_use">Commercial Use</MenuItem>
              <MenuItem value="enterprise_use">Enterprise Use</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Supported Formats */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Supported File Formats
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {["PSD", "AI", "PDF", "JPG", "PNG", "SVG", "EPS", "Figma", "Sketch"].map(
              (format) => (
                <Chip
                  key={format}
                  label={format}
                  clickable
                  color={safeSupportedFormats.includes(format) ? "primary" : "default"}
                  variant={safeSupportedFormats.includes(format) ? "filled" : "outlined"}
                  onClick={() => handleSupportedFormatChange(format)}
                />
              )
            )}
          </Box>
        </Grid>

        {/* Additional Options */}
        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={revisionsIncluded}
                onChange={(e) => handleRevisionsIncludedChange(e.target.checked)}
                color="primary"
              />
            }
            label="Revisions Included"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={supportIncluded}
                onChange={(e) => handleSupportIncludedChange(e.target.checked)}
                color="primary"
              />
            }
            label="Post-delivery Support Included"
          />
        </Grid>

        {/* Languages */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Languages
          </Typography>
          {safeLanguages.map((lang, index) => (
            <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Language"
                  value={lang.language || ""}
                  onChange={(e) =>
                    handleLanguageChange(index, "language", e.target.value)
                  }
                  placeholder="English"
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <FormControl fullWidth>
                  <InputLabel>Proficiency</InputLabel>
                  <Select
                    value={lang.proficiency || "Fluent"}
                    onChange={(e) =>
                      handleLanguageChange(index, "proficiency", e.target.value)
                    }
                    label="Proficiency"
                  >
                    <MenuItem value="Basic">Basic</MenuItem>
                    <MenuItem value="Conversational">Conversational</MenuItem>
                    <MenuItem value="Fluent">Fluent</MenuItem>
                    <MenuItem value="Native">Native</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Box sx={{ display: "flex", height: "100%", alignItems: "center" }}>
                  <IconButton
                    onClick={() => handleRemoveLanguage(index)}
                    disabled={safeLanguages.length === 0}
                    color="error"
                  >
                    <Remove />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          ))}
          <Button
            startIcon={<Add />}
            onClick={handleAddLanguage}
            variant="outlined"
          >
            Add Language
          </Button>
        </Grid>

        {/* Skills */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Skills
          </Typography>
          {safeSkills.map((skill, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 1, mb: 1, alignItems: "center" }}
            >
              <TextField
                value={skill || ""}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                placeholder="Add a skill"
                fullWidth
                size="small"
              />
              <IconButton
                onClick={() => handleRemoveSkill(index)}
                color="error"
                size="small"
              >
                <Remove />
              </IconButton>
            </Box>
          ))}
          <Button startIcon={<Add />} onClick={handleAddSkill} variant="outlined">
            Add Skill
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepTwo;
