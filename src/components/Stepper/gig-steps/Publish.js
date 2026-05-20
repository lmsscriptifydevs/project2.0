import React from 'react';
import {
  Assignment,
  AttachMoney,
  CheckCircle,
  Description as DescIcon,
  Image as ImageIcon,
  LiveHelp as FaqIcon,
  VideoLibrary as VideoIcon,
  FactCheck as ChecklistIcon
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Stack,
  LinearProgress
} from '@mui/material';

const Publish = ({ formData }) => {
  const tags = formData?.tags || [];
  const packages = formData?.packages || {};
  const description = formData?.description || '';
  const requirements = formData?.requirements || [];
  const imgList = formData?.images || [];
  const faqs = formData?.faqs || [];
  const docList = formData?.documents || [];

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
    successGreen: "#4caf50"
  };

  const getProgressPercentage = () => {
    const steps = [
      formData?.gigTitle && formData?.category_id && formData?.subcategory_id && tags.length > 0,
      Object.values(packages).length >= 1 && Object.values(packages).every(pkg => pkg.price && pkg.delivery_time),
      description.replace(/<[^>]*>/g, '').length >= 750,
      true, // Requirements are optional but counted as step reached
      imgList.length > 0
    ];
    return (steps.filter(Boolean).length / steps.length) * 100;
  };

  const progress = getProgressPercentage();

  // Helper for Section Titles
  const SectionHeader = ({ icon, title }) => (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Box sx={{ color: theme.primaryOrange, display: 'flex' }}>{icon}</Box>
      <Typography variant="h6" fontWeight="bold" sx={{ color: theme.pureWhite }}>
        {title}
      </Typography>
    </Stack>
  );

  return (
    <Box sx={{ bgcolor: theme.mainBg, borderRadius: 2 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: theme.pureWhite }}>
          Final <span style={{ color: theme.primaryOrange }}>Review</span>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.bodyGrayText }}>
          Apni gig ko publish karne se pehle details ko achi tarah check kar lein.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side: Details */}
        <Grid item xs={12} md={8}>
          
          {/* Overview Card */}
          <Card sx={{ bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, mb: 3, backgroundImage: 'none' }}>
            <CardContent>
              <SectionHeader icon={<Assignment fontSize="small" />} title="Service Overview" />
              <Typography variant="h6" sx={{ color: theme.pureWhite, mb: 1.5, fontSize: '1.1rem' }}>
                {formData?.gigTitle || 'Untitled Gig'}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {tags.map((tag, index) => (
                  <Chip 
                    key={index} 
                    label={tag} 
                    size="small" 
                    sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: theme.mediumGrayTitle, border: `1px solid ${theme.lightBorder}` }} 
                  />
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Pricing Grid */}
          <Card sx={{ bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, mb: 3, backgroundImage: 'none' }}>
            <CardContent>
              <SectionHeader icon={<AttachMoney fontSize="small" />} title="Packages & Pricing" />
              <Grid container spacing={2}>
                {Object.entries(packages).map(([key, pkg]) => (
                  <Grid item xs={12} sm={4} key={key}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(255,255,255,0.03)', 
                      border: `1px solid ${theme.lightBorder}`,
                      textAlign: 'center'
                    }}>
                      <Typography variant="subtitle2" sx={{ color: theme.primaryOrange, textTransform: 'uppercase', mb: 1 }}>
                        {key}
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" sx={{ color: theme.pureWhite, mb: 1 }}>
                        ${pkg.price}
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: theme.bodyGrayText }}>
                         {pkg.delivery_time} Days Delivery
                      </Typography>
                      <Typography variant="caption" display="block" sx={{ color: theme.bodyGrayText }}>
                         {pkg.revisions} Revisions
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Description Snippet */}
          <Card sx={{ bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, mb: 3, backgroundImage: 'none' }}>
            <CardContent>
              <SectionHeader icon={<DescIcon fontSize="small" />} title="Description" />
              <Box sx={{ 
                p: 2, 
                bgcolor: 'rgba(0,0,0,0.2)', 
                borderRadius: 2, 
                borderLeft: `3px solid ${theme.primaryOrange}` 
              }}>
                <Typography variant="body2" sx={{ color: theme.mediumGrayTitle, fontStyle: 'italic' }}>
                  {description ? `${description.replace(/<[^>]*>/g, '').substring(0, 250)}...` : 'No description added'}
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ mt: 1.5, display: 'block', color: theme.bodyGrayText }}>
                Total length: {description.replace(/<[^>]*>/g, '').length} characters
              </Typography>
            </CardContent>
          </Card>

          {/* FAQs & Requirements */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, backgroundImage: 'none' }}>
                <CardContent>
                  <SectionHeader icon={<FaqIcon fontSize="small" />} title="FAQs" />
                  {faqs.length > 0 ? (
                    faqs.slice(0, 2).map((faq, index) => (
                      <Box key={index} sx={{ mb: 1.5 }}>
                        <Typography variant="caption" fontWeight="bold" sx={{ color: theme.pureWhite }}>Q: {faq.question}</Typography>
                        <Typography variant="body2" sx={{ color: theme.bodyGrayText, fontSize: '0.8rem' }}>A: {faq.answer}</Typography>
                      </Box>
                    ))
                  ) : <Typography variant="caption" sx={{ color: theme.bodyGrayText }}>No FAQs</Typography>}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%', bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, backgroundImage: 'none' }}>
                <CardContent>
                  <SectionHeader icon={<ChecklistIcon fontSize="small" />} title="Requirements" />
                  {requirements.length > 0 ? (
                    <List dense sx={{ p: 0 }}>
                      {requirements.slice(0, 3).map((req, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 25 }}><CheckCircle sx={{ fontSize: 14, color: theme.successGreen }} /></ListItemIcon>
                          <ListItemText primary={req} primaryTypographyProps={{ fontSize: '0.8rem', color: theme.bodyGrayText }} />
                        </ListItem>
                      ))}
                    </List>
                  ) : <Typography variant="caption" sx={{ color: theme.bodyGrayText }}>Optional requirements</Typography>}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Side: Checklist Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            bgcolor: theme.cardBg, 
            border: `1px solid ${theme.orangeBorderActive}`, 
            position: 'sticky', 
            top: 20,
            backgroundImage: 'none'
          }}>
            <CardContent>
              <Typography variant="subtitle1" fontWeight="bold" sx={{ color: theme.pureWhite, mb: 2 }}>
                Publish Checklist
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                  <Typography variant="caption" sx={{ color: theme.mediumGrayTitle }}>Ready to go</Typography>
                  <Typography variant="caption" fontWeight="bold" sx={{ color: theme.primaryOrange }}>{Math.round(progress)}%</Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={progress} 
                  sx={{ 
                    height: 6, 
                    borderRadius: 3, 
                    bgcolor: 'rgba(255,255,255,0.05)',
                    '& .MuiLinearProgress-bar': { bgcolor: progress === 100 ? theme.successGreen : theme.primaryOrange }
                  }} 
                />
              </Box>

              <List dense>
                {[
                  { label: "Overview details", done: formData?.gigTitle && tags.length > 0, icon: <Assignment fontSize="small" /> },
                  { label: "Pricing configuration", done: Object.values(packages).length >= 1, icon: <AttachMoney fontSize="small" /> },
                  { label: "Detailed description", done: description.length >= 750, icon: <DescIcon fontSize="small" /> },
                  { label: "Portfolio media", done: imgList.length > 0, icon: <ImageIcon fontSize="small" /> }
                ].map((item, idx) => (
                  <ListItem key={idx} sx={{ px: 0 }}>
                    <ListItemIcon sx={{ minWidth: 35, color: item.done ? theme.successGreen : theme.bodyGrayText }}>
                      {item.done ? <CheckCircle fontSize="small" /> : item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label} 
                      primaryTypographyProps={{ 
                        fontSize: '0.85rem', 
                        color: item.done ? theme.pureWhite : theme.bodyGrayText,
                        fontWeight: item.done ? 'bold' : 'normal'
                      }} 
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2, borderColor: theme.lightBorder }} />

              {progress === 100 ? (
                <Alert 
                  severity="success" 
                  icon={<CheckCircle fontSize="inherit" />}
                  sx={{ 
                    bgcolor: 'rgba(76, 175, 80, 0.1)', 
                    color: '#81c784', 
                    fontSize: '0.75rem',
                    border: '1px solid rgba(76, 175, 80, 0.3)'
                  }}
                >
                  Everything looks perfect! You are ready to publish.
                </Alert>
              ) : (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    bgcolor: 'rgba(240, 89, 31, 0.1)', 
                    color: '#ffb74d', 
                    fontSize: '0.75rem',
                    border: '1px solid rgba(240, 89, 31, 0.3)'
                  }}
                >
                  Please complete the missing steps to go live.
                </Alert>
              )}
              
              {/* Media Summary Chips */}
              <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                 <Chip size="small" icon={<ImageIcon sx={{ fontSize: '12px !important' }}/>} label={`${imgList.length} Images`} sx={{ color: theme.bodyGrayText, fontSize: '10px' }} />
                 <Chip size="small" icon={<VideoIcon sx={{ fontSize: '12px !important' }}/>} label={formData?.video ? "Video On" : "No Video"} sx={{ color: theme.bodyGrayText, fontSize: '10px' }} />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Publish;