import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Step,
  StepLabel,
  Stepper,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from '../../utils/axios';
import { clearValidationErrors, setCurrentStep } from '../../redux/slices/gigsSlice';
import { getGigDetail } from '../../redux/slices/allGigsSlice';
import {
  Description, FAQ, Gallery, Overview,
  Pricing, Publish, Requirements, useGigForm,
} from './gig-steps';

// ── Theme ─────────────────────────────────────────────────────────────────────
const T = {
  mainBg:      '#020617',
  cardBg:      'rgba(255,255,255,0.02)',
  cardBgActive:'rgba(255,255,255,0.04)',
  orange:      '#f0591f',
  orangeHover: '#d94e18',
  orangeFade:  'rgba(240,89,31,0.08)',
  orangeBorder:'rgba(240,89,31,0.35)',
  white:       '#ffffff',
  lightGray:   '#d4d4d8',
  midGray:     '#a1a1aa',
  bodyGray:    '#71717a',
  border:      'rgba(255,255,255,0.06)',
  borderMid:   'rgba(255,255,255,0.07)',
  surface:     '#0c1525',
};

// ── Step config ───────────────────────────────────────────────────────────────
const GIG_STEPS = {
  OVERVIEW: 0, PRICING: 1, DESCRIPTION: 2,
  FAQ: 3, REQUIREMENTS: 4, GALLERY: 5, PUBLISH: 6,
};
const STEP_LABELS = [
  'Overview', 'Pricing', 'Description',
  'FAQ', 'Requirements', 'Gallery', 'Publish',
];

// ── Exit confirmation dialog ──────────────────────────────────────────────────
const ExitConfirmation = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
    PaperProps={{ sx: { backgroundColor: T.surface, border: `1px solid ${T.borderMid}`, borderRadius: 3 } }}>
    <DialogTitle sx={{ color: T.white, fontWeight: 700, borderBottom: `1px solid ${T.border}` }}>
      Leave Page?
    </DialogTitle>
    <DialogContent sx={{ pt: 3 }}>
      <Typography variant="body2" sx={{ color: T.midGray }}>
        You have unsaved changes. Are you sure you want to leave?
      </Typography>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'space-between', p: 2, borderTop: `1px solid ${T.border}` }}>
      <Button onClick={onClose}
        sx={{ color: T.midGray, borderColor: T.borderMid, textTransform: 'none', borderRadius: '8px' }}
        variant="outlined">Cancel</Button>
      <Button onClick={onConfirm} variant="outlined"
        sx={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.4)', textTransform: 'none', borderRadius: '8px',
              '&:hover': { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: '#ef4444' } }}>
        Leave Anyway
      </Button>
    </DialogActions>
  </Dialog>
);

// ── Nav guard ─────────────────────────────────────────────────────────────────
const useNavigationGuard = (hasUnsavedChanges) => {
  useEffect(() => {
    const handle = (e) => {
      if (hasUnsavedChanges) { e.preventDefault(); e.returnValue = ''; return e.returnValue; }
    };
    window.addEventListener('beforeunload', handle);
    return () => window.removeEventListener('beforeunload', handle);
  }, [hasUnsavedChanges]);
};

// ── Upload helpers ────────────────────────────────────────────────────────────
const uploadSingleFile = async (file, label) => {
  const fd = new FormData();
  fd.append('file', file);
  const res = await axios.post('upload-media', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }, timeout: 300000,
  });
  if (res.data.status === 'error' || res.data.status !== 'success')
    throw new Error(res.data.message || `Failed to upload ${label || 'file'}`);
  const fileUrl = res.data.data?.file_url;
  if (!fileUrl) throw new Error(`Upload succeeded but no URL returned for ${label || 'file'}`);
  return fileUrl;
};

const uploadGalleryFiles = async (gigId, currentFormData, updateToast) => {
  const totalFiles = [];
  (currentFormData.images || []).forEach((img, i) => {
    if (i >= 3) return;
    const file = img?.fileObject ?? (img instanceof File ? img : null);
    if (file instanceof File) totalFiles.push({ type: 'image', index: i, file });
  });
  const videoItem = currentFormData.video;
  const videoFile = videoItem?.fileObject ?? (videoItem instanceof File ? videoItem : null);
  if (videoFile instanceof File) totalFiles.push({ type: 'video', file: videoFile });
  (currentFormData.documents || []).forEach((doc, i) => {
    if (i >= 2) return;
    const file = doc?.fileObject ?? (doc instanceof File ? doc : null);
    if (file instanceof File) totalFiles.push({ type: 'pdf', index: i, file });
  });
  if (totalFiles.length === 0) return false;

  const imageUrls = []; let videoUrl = null; const pdfUrls = {}; let uploadCount = 0;
  for (const item of totalFiles) {
    uploadCount++;
    if (updateToast) updateToast(`Uploading file ${uploadCount}/${totalFiles.length}...`);
    const label = item.type === 'image' ? `image ${item.index + 1}` : item.type === 'video' ? 'video' : `PDF ${item.index + 1}`;
    const fileUrl = await uploadSingleFile(item.file, label);
    if (item.type === 'image') imageUrls.push(fileUrl);
    else if (item.type === 'video') videoUrl = fileUrl;
    else pdfUrls[`pdf_file${item.index + 1}`] = fileUrl;
  }
  if (updateToast) updateToast('Saving media to gig...');
  const galleryPayload = { gig_id: gigId };
  if (imageUrls.length > 0) galleryPayload.images = imageUrls;
  if (videoUrl) galleryPayload.video = videoUrl;
  Object.assign(galleryPayload, pdfUrls);
  await axios.post('gig-gallery', galleryPayload, { timeout: 60000 });
  return true;
};

// ── Main Component ────────────────────────────────────────────────────────────
const CreateGig = () => {
  const dispatch      = useDispatch();
  const location      = useLocation();
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const theme         = useTheme();
  const isMobile      = useMediaQuery(theme.breakpoints.down('md'));

  const { currentStep, validationErrors } = useSelector((s) => s.gig);

  const [showSuccess,       setShowSuccess]       = useState(false);
  const [successMessage,    setSuccessMessage]    = useState('');
  const [isInitialized,     setIsInitialized]     = useState(false);
  const [isEditMode,        setIsEditMode]        = useState(false);
  const [editGigId,         setEditGigId]         = useState(null);
  const [loadedData,        setLoadedData]        = useState(null);
  const [showExitConfirm,   setShowExitConfirm]   = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [navigationTarget,  setNavigationTarget]  = useState(null);
  const [dataLoading,       setDataLoading]       = useState(false);
  const [isPublishing,      setIsPublishing]      = useState(false);

  const formDataRef    = useRef({});
  const initialLoadRef = useRef(true);

  const { gigData, editGigIdFromRoute, editFlag } = useMemo(() => ({
    gigData:            location.state?.gigData || location.state?.gig,
    editGigIdFromRoute: location.state?.gig_id || searchParams.get('edit'),
    editFlag:           location.state?.isEditMode || searchParams.get('mode') === 'edit',
  }), [location.state, searchParams]);

  const isEditRequest = useMemo(
    () => !!(gigData || editFlag || editGigIdFromRoute),
    [gigData, editFlag, editGigIdFromRoute],
  );

  useEffect(() => { if (!isEditRequest) dispatch(setCurrentStep(0)); }, [dispatch, isEditRequest]);

  useEffect(() => {
    const loadData = async () => {
      setDataLoading(true);
      try {
        let dataToLoad = null, editMode = false, loadedGigId = null;
        if (gigData) { editMode = true; dataToLoad = gigData; loadedGigId = editGigIdFromRoute || gigData.id; }
        if (!dataToLoad && editGigIdFromRoute) {
          editMode = true; loadedGigId = editGigIdFromRoute;
          try {
            const r = await dispatch(getGigDetail(editGigIdFromRoute)).unwrap();
            if (r) dataToLoad = r;
          } catch (e) { toast.error('Failed to load gig data for editing'); }
        }
        setIsEditMode(editMode); setLoadedData(dataToLoad);
        if (loadedGigId) setEditGigId(loadedGigId);
        setIsInitialized(true);
      } catch (error) {
        toast.error('Failed to load gig data'); setIsInitialized(true);
      } finally { setDataLoading(false); }
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, gigData, editGigIdFromRoute, editFlag, isEditRequest]);

  const initialData = useMemo(() => {
    if (loadedData && Object.keys(loadedData).length > 0) return loadedData;
    return {};
  }, [loadedData]);

  const { formData, updateFormData, validateStep, isStepValid } = useGigForm(initialData);

  useEffect(() => {
    const previousData = formDataRef.current;
    formDataRef.current = formData;
    if (isInitialized && Object.keys(formData).length > 0) {
      const hasActualChanges = JSON.stringify(previousData) !== JSON.stringify(formData);
      if (!initialLoadRef.current && hasActualChanges) setHasUnsavedChanges(true);
      if (initialLoadRef.current && Object.keys(formData).length > 0) initialLoadRef.current = false;
    }
  }, [formData, isInitialized]);

  useNavigationGuard(hasUnsavedChanges);

  const handlePublish = useCallback(async () => {
    setIsPublishing(true);
    const currentFormData = formDataRef.current;
    try {
      if (isEditMode && editGigId) {
        toast.info('Updating gig overview...', { autoClose: false, toastId: 'publish-progress' });
        const overviewRes = await axios.post('update-gig-overView', {
          gig_id: editGigId, title: currentFormData.gigTitle || '',
          category_id: currentFormData.category_id, subcategory_id: currentFormData.subcategory_id,
          tags: Array.isArray(currentFormData.tags) ? currentFormData.tags : [],
        });
        if (!overviewRes.data.status) throw new Error(overviewRes.data.message || 'Failed to update overview');

        toast.update('publish-progress', { render: 'Updating packages...' });
        const pkgPayload = { gig_id: editGigId };
        const pkgs = currentFormData.packages || {};
        if (pkgs.basic || pkgs.standard || pkgs.premium) {
          pkgPayload.packages = {};
          ['basic', 'standard', 'premium'].forEach((type) => {
            if (pkgs[type]) pkgPayload.packages[type] = {
              title: pkgs[type].title || '', description: pkgs[type].description || '',
              delivery_time: pkgs[type].delivery_time || '3', revisions: pkgs[type].revisions || '1',
              price: String(pkgs[type].price || '0').replace('$', ''),
            };
          });
        }
        const pkgRes = await axios.post('update-gig-package', pkgPayload);
        if (!pkgRes.data.status) throw new Error(pkgRes.data.message || 'Failed to update packages');

        if (currentFormData.description) {
          toast.update('publish-progress', { render: 'Updating description...' });
          const descRes = await axios.post('update-gig-description', { gig_id: editGigId, description: currentFormData.description });
          if (!descRes.data.status) throw new Error(descRes.data.message || 'Failed to update description');
        }

        toast.update('publish-progress', { render: 'Updating requirements...' });
        const reqs = (currentFormData.requirements || []).filter((r) => r && r.trim());
        await axios.post('update-gig-requirement', { gig_id: editGigId, requirement: reqs.length > 0 ? reqs : [] });

        toast.update('publish-progress', { render: 'Updating FAQs...' });
        const faqs = (currentFormData.faqs || []).filter((f) => f.question && f.question.trim());
        await axios.post('update-gig-question', { gig_id: editGigId, questions: faqs.map((f) => ({ question: f.question, answer: f.answer || '' })) });

        toast.update('publish-progress', { render: 'Uploading media files...' });
        await uploadGalleryFiles(editGigId, currentFormData, (msg) => toast.update('publish-progress', { render: msg }));

        toast.update('publish-progress', { render: 'Publishing gig...' });
        const publishRes = await axios.post('update-gig-publish', { gig_id: editGigId });
        if (!publishRes.data.status) {
          const missing = publishRes.data.missing_fields;
          throw new Error(publishRes.data.message + (missing ? ` (Missing: ${missing.join(', ')})` : ''));
        }
        toast.dismiss('publish-progress');
        toast.success('Gig updated and published successfully!');
        setHasUnsavedChanges(false); setSuccessMessage('Gig updated successfully!'); setShowSuccess(true);
        setTimeout(() => navigate('/gigs/manage'), 2000);

      } else {
        toast.info('Creating gig overview...', { autoClose: false, toastId: 'publish-progress' });
        const overviewRes = await axios.post('gig-overView', {
          title: currentFormData.gigTitle || '', category_id: currentFormData.category_id,
          subcategory_id: currentFormData.subcategory_id,
          tags: Array.isArray(currentFormData.tags) ? currentFormData.tags : [],
        });
        if (!overviewRes.data.status) throw new Error(overviewRes.data.message || 'Failed to create gig overview');
        const newGigId = overviewRes.data.data.id;

        toast.update('publish-progress', { render: 'Adding packages...' });
        const pkgPayload = { gig_id: newGigId };
        const pkgs = currentFormData.packages || {};
        if (pkgs.basic || pkgs.standard || pkgs.premium) {
          pkgPayload.packages = {};
          ['basic', 'standard', 'premium'].forEach((type) => {
            if (pkgs[type]) pkgPayload.packages[type] = {
              title: pkgs[type].title || '', description: pkgs[type].description || '',
              delivery_time: pkgs[type].delivery_time || '3', revisions: pkgs[type].revisions || '1',
              price: String(pkgs[type].price || '0').replace('$', ''),
            };
          });
        }
        const pkgRes = await axios.post('gig-package', pkgPayload);
        if (!pkgRes.data.status) throw new Error(pkgRes.data.message || 'Failed to add packages');

        if (currentFormData.description) {
          toast.update('publish-progress', { render: 'Adding description...' });
          const descRes = await axios.post('gig-description', { gig_id: newGigId, description: currentFormData.description });
          if (!descRes.data.status) throw new Error(descRes.data.message || 'Failed to add description');
        }

        const reqs = (currentFormData.requirements || []).filter((r) => r && r.trim());
        if (reqs.length > 0) {
          toast.update('publish-progress', { render: 'Adding requirements...' });
          await axios.post('gig-requirement', { gig_id: newGigId, requirement: reqs });
        }

        const faqs = (currentFormData.faqs || []).filter((f) => f.question && f.question.trim());
        if (faqs.length > 0) {
          toast.update('publish-progress', { render: 'Adding FAQs...' });
          await axios.post('gig-question', { gig_id: newGigId, allquestion: faqs.map((f) => ({ gig_id: newGigId, question: f.question, answer: f.answer || '' })) });
        }

        toast.update('publish-progress', { render: 'Uploading media files...' });
        await uploadGalleryFiles(newGigId, currentFormData, (msg) => toast.update('publish-progress', { render: msg }));

        toast.update('publish-progress', { render: 'Publishing gig...' });
        const publishRes = await axios.post('update-gig-publish', { gig_id: newGigId });
        if (!publishRes.data.status) {
          const missing = publishRes.data.missing_fields;
          throw new Error(publishRes.data.message + (missing ? ` (Missing: ${missing.join(', ')})` : ''));
        }
        toast.dismiss('publish-progress');
        toast.success('Gig published successfully!');
        setHasUnsavedChanges(false); setSuccessMessage('Gig published successfully!'); setShowSuccess(true);
        setTimeout(() => navigate('/gigs/manage'), 2000);
      }
    } catch (error) {
      toast.dismiss('publish-progress');
      toast.error(`Failed: ${error?.response?.data?.message || error?.message || 'Unknown error'}`);
    } finally { setIsPublishing(false); }
  }, [editGigId, isEditMode, navigate]);

  const handleNext = async () => {
    try {
      dispatch(clearValidationErrors());
      if (!validateStep(currentStep)) return;
      if (currentStep === GIG_STEPS.PUBLISH) { await handlePublish(); return; }
      dispatch(setCurrentStep(currentStep + 1));
    } catch { toast.error('An error occurred. Please try again.'); }
  };

  const handleBack = () => {
    dispatch(clearValidationErrors());
    if (currentStep > 0) dispatch(setCurrentStep(currentStep - 1));
  };

  const handleStepClick = (step) => {
    if (step < currentStep) { dispatch(clearValidationErrors()); dispatch(setCurrentStep(step)); }
  };

  const confirmExit  = () => { setShowExitConfirm(false); setHasUnsavedChanges(false); if (navigationTarget) navigate(navigationTarget); };
  const cancelExit   = () => { setShowExitConfirm(false); setNavigationTarget(null); };

  const progress = useMemo(() => Math.round((currentStep / (STEP_LABELS.length - 1)) * 100), [currentStep]);

  const renderStepContent = (step) => {
    const commonProps = { formData: formData || {}, updateFormData, validationErrors: validationErrors || {}, isEditMode };
    switch (step) {
      case GIG_STEPS.OVERVIEW:      return <Overview {...commonProps} />;
      case GIG_STEPS.PRICING:       return <Pricing {...commonProps} />;
      case GIG_STEPS.DESCRIPTION:   return <Description {...commonProps} />;
      case GIG_STEPS.FAQ:           return <FAQ {...commonProps} />;
      case GIG_STEPS.REQUIREMENTS:  return <Requirements {...commonProps} />;
      case GIG_STEPS.GALLERY:       return <Gallery {...commonProps} />;
      case GIG_STEPS.PUBLISH:       return <Publish {...commonProps} onPublish={handlePublish} progress={progress} />;
      default: return <Typography color="error">Unknown step</Typography>;
    }
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (!isInitialized || dataLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: 2, backgroundColor: T.mainBg }}>
        <CircularProgress size={36} sx={{ color: T.orange }} />
        <Typography variant="body2" sx={{ color: T.midGray }}>
          {dataLoading ? 'Loading gig data...' : 'Initializing...'}
        </Typography>
      </Box>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', p: { xs: 1.5, sm: 3, md: 5 }, backgroundColor: T.mainBg, minHeight: '100vh', width: '100%' }}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover
        toastStyle={{ backgroundColor: '#0c1525', color: T.white, border: `1px solid ${T.borderMid}`, borderRadius: '10px' }} />

      {/* ── Header card ── */}
      <Box sx={{
        p: 3, mb: 3, borderRadius: '16px',
        backgroundColor: T.cardBg,
        border: `1px solid ${T.border}`,
        backdropFilter: 'blur(8px)',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ color: T.white, fontWeight: 700, mb: 0.5 }}>
              {isEditMode ? '✏️ Edit Gig' : 'Create New Gig'}
            </Typography>
            <Typography variant="body2" sx={{ color: T.bodyGray, fontSize: '13px' }}>
              {isEditMode
                ? `Editing: ${formData?.gigTitle || 'Untitled'}`
                : 'Fill in the details to create your new service'}
            </Typography>

            {/* Progress bar */}
            <Box sx={{ mt: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.75 }}>
                <Typography variant="caption" sx={{ color: T.midGray, fontWeight: 600 }}>Progress</Typography>
                <Typography variant="caption" sx={{ color: T.orange, fontWeight: 700 }}>{progress}%</Typography>
              </Box>
              <Box sx={{ width: '100%', height: 5, backgroundColor: T.border, borderRadius: 99, overflow: 'hidden' }}>
                <Box sx={{
                  width: `${progress}%`, height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${T.orange}, #ff8c5a)`,
                  transition: 'width 0.4s ease',
                  boxShadow: `0 0 10px rgba(240,89,31,0.4)`,
                }} />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Stepper ── */}
      <Box sx={{
        p: { xs: 2, md: 3 }, mb: 3, borderRadius: '16px',
        backgroundColor: T.cardBg, border: `1px solid ${T.border}`,
        overflowX: 'auto',
      }}>
        <Stepper
          activeStep={currentStep}
          alternativeLabel={!isMobile}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{
            '& .MuiStepIcon-root': { color: T.border, fontSize: '1.3rem' },
            '& .MuiStepIcon-root.Mui-completed': { color: T.orange },
            '& .MuiStepIcon-root.Mui-active': { color: T.orange, filter: `drop-shadow(0 0 6px ${T.orange})` },
            '& .MuiStepLabel-label': { color: T.bodyGray, fontSize: '12px', fontWeight: 500 },
            '& .MuiStepLabel-label.Mui-active': { color: T.white, fontWeight: 700 },
            '& .MuiStepLabel-label.Mui-completed': { color: T.midGray },
            '& .MuiStepConnector-line': { borderColor: T.border },
            '& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': { borderColor: T.orange },
            '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line': { borderColor: T.orangeBorder },
          }}
        >
          {STEP_LABELS.map((label, index) => (
            <Step key={label}>
              <StepLabel
                onClick={() => handleStepClick(index)}
                sx={{ cursor: index < currentStep ? 'pointer' : 'default' }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Validation errors ── */}
      {validationErrors && Object.keys(validationErrors).length > 0 && (
        <Box sx={{
          mb: 3, p: 2, borderRadius: '12px',
          backgroundColor: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="subtitle2" sx={{ color: '#ef4444', fontWeight: 700, mb: 1 }}>
                ⚠️ Please fix the following errors:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {Object.values(validationErrors).map((error, i) => (
                  <li key={i} style={{ color: T.midGray, fontSize: '13px', marginBottom: 4 }}>{error}</li>
                ))}
              </ul>
            </Box>
            <button onClick={() => dispatch(clearValidationErrors())}
              style={{ background: 'none', border: 'none', color: T.bodyGray, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 4px' }}>
              ×
            </button>
          </Box>
        </Box>
      )}

      {/* ── Step content ── */}
      <Box sx={{
        p: { xs: 2, md: 4 }, mb: 3, borderRadius: '16px',
        backgroundColor: T.cardBg, border: `1px solid ${T.border}`,
        // pass dark theme context down via CSS vars for child step components
        '--gt-bg':           T.mainBg,
        '--gt-card':         T.cardBgActive,
        '--gt-white':        T.white,
        '--gt-gray':         T.midGray,
        '--gt-body':         T.bodyGray,
        '--gt-orange':       T.orange,
        '--gt-border':       T.border,
      }}>
        {renderStepContent(currentStep)}
      </Box>

      {/* ── Navigation buttons ── */}
      <Box sx={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexDirection: { xs: 'column', sm: 'row' }, gap: 2,
        p: 3, borderRadius: '16px',
        backgroundColor: T.cardBg, border: `1px solid ${T.border}`,
      }}>
        {/* Step indicator */}
        <Typography variant="caption" sx={{ color: T.bodyGray, display: { xs: 'none', sm: 'block' } }}>
          Step {currentStep + 1} of {STEP_LABELS.length}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', sm: 'auto' } }}>
          <Button
            disabled={currentStep === 0}
            onClick={handleBack}
            variant="outlined"
            fullWidth={isMobile}
            sx={{
              borderColor: T.borderMid, color: T.lightGray,
              textTransform: 'none', borderRadius: '10px', fontWeight: 600,
              minWidth: { xs: '100%', sm: 100 },
              '&:hover': { borderColor: T.orange, color: T.orange, backgroundColor: T.orangeFade },
              '&:disabled': { borderColor: T.border, color: T.bodyGray },
            }}
          >
            ← Back
          </Button>

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!isStepValid(currentStep) || isPublishing}
            fullWidth={isMobile}
            startIcon={isPublishing ? <CircularProgress size={16} color="inherit" /> : null}
            sx={{
              backgroundColor: T.orange,
              textTransform: 'none', borderRadius: '10px', fontWeight: 700,
              minWidth: { xs: '100%', sm: 150 },
              boxShadow: `0 4px 14px rgba(240,89,31,0.35)`,
              '&:hover': { backgroundColor: T.orangeHover, boxShadow: `0 6px 18px rgba(240,89,31,0.45)` },
              '&:disabled': { backgroundColor: 'rgba(240,89,31,0.25)', color: 'rgba(255,255,255,0.4)', boxShadow: 'none' },
            }}
          >
            {isPublishing
              ? (isEditMode ? 'Updating...' : 'Publishing...')
              : currentStep === STEP_LABELS.length - 1
                ? (isEditMode ? '🚀 Update Gig' : '🚀 Publish Gig')
                : 'Next →'}
          </Button>
        </Box>
      </Box>

      {/* ── Success snackbar ── */}
      <Snackbar open={showSuccess} autoHideDuration={4000} onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          backgroundColor: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '12px', padding: '12px 20px',
          backdropFilter: 'blur(12px)', boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
        }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>{successMessage}</Typography>
        </Box>
      </Snackbar>

      {/* ── Exit confirm ── */}
      <ExitConfirmation open={showExitConfirm} onClose={cancelExit} onConfirm={confirmExit} />
    </Box>
  );
};

export default CreateGig;