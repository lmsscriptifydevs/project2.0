import {
  CloudUpload,
  Crop as CropIcon,
  Delete,
  Image as ImageIcon,
  Description as PdfIcon,
  VideoLibrary,
  CheckCircle,
  InfoOutlined
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slider,
  Typography,
  Fade,
  Stack
} from '@mui/material';
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { useDropzone } from 'react-dropzone';

// Color Schema
const theme = {
  mainBg: "#020617",
  cardBg: "rgba(255, 255, 255, 0.02)",
  cardBgActive: "rgba(255, 255, 255, 0.04)",
  primaryOrange: "#f0591f",
  secondaryBlueBlur: "rgba(59, 130, 246, 0.05)",
  pureWhite: "#ffffff",
  mediumGrayTitle: "#a1a1aa",
  bodyGrayText: "#71717a",
  lightBorder: "rgba(255, 255, 255, 0.06)",
  orangeBorderActive: "rgba(240, 89, 31, 0.4)"
};

// ... (Baaki constants jaise MAX_SIZE wagera wahi rahenge jo aapne diye hain)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PDF_SIZE = 20 * 1024 * 1024;
const MAX_IMAGES = 3;
const MAX_DOCUMENTS = 2;
const IMG_MIN_W = 712;
const IMG_MIN_H = 430;
const IMG_MAX_W = 4000;
const IMG_MAX_H = 2416;
const IMG_REC_W = 1280;
const IMG_REC_H = 769;
const CROP_ASPECT = IMG_REC_W / IMG_REC_H;

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const createFileId = (type, index = 0) =>
  `${type}_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 9)}`;

const createPreviewURL = (file) => {
  const url = URL.createObjectURL(file);
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  return url;
};

const Gallery = ({ formData = {}, updateFormData, validationErrors = {}, isEditMode = false }) => {
  const images = useMemo(() => formData.images || [], [formData.images]);
  const video = useMemo(() => formData.video || null, [formData.video]);
  const documents = useMemo(() => formData.documents || [], [formData.documents]);

  const [state, dispatch] = useReducer((s, a) => {
    switch (a.type) {
      case 'SET_ERROR': return { ...s, errors: { ...s.errors, [a.payload.type]: a.payload.message } };
      case 'CLEAR_ERROR': const {[a.payload]:_, ...rest} = s.errors; return { ...s, errors: rest };
      case 'SET_PROCESSING': return { ...s, processing: a.payload };
      default: return s;
    }
  }, { errors: {}, processing: false });

  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState(null);
  const [cropQueue, setCropQueue] = useState([]);

  // --- Functions (Logic remains same as yours) ---
  const setError = useCallback((type, message) => dispatch({ type: 'SET_ERROR', payload: { type, message } }), []);
  const clearError = useCallback((type) => dispatch({ type: 'CLEAR_ERROR', payload: type }), []);

  const processFile = useCallback((file, type, index = 0) => ({
    fileObject: file,
    name: file.name,
    type: file.type,
    size: file.size,
    preview: createPreviewURL(file),
    isNew: true,
    fileId: createFileId(type, index)
  }), []);

  // Image Drop Handling
  const onImageDrop = useCallback(async (acceptedFiles) => {
    if (state.processing) return;
    const availableSlots = MAX_IMAGES - images.length;
    if (availableSlots <= 0) { setError('images', 'Limit reached'); return; }
    
    const filesToProcess = acceptedFiles.slice(0, availableSlots);
    setCropQueue(filesToProcess);
    if(filesToProcess.length > 0) {
        const url = URL.createObjectURL(filesToProcess[0]);
        setCropImageSrc(url);
        setCropDialogOpen(true);
    }
  }, [images.length, state.processing, setError]);

  const imageDropzone = useDropzone({
    onDrop: onImageDrop,
    accept: { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] },
    maxSize: MAX_IMAGE_SIZE,
    disabled: images.length >= MAX_IMAGES
  });

  // Video Drop Handling
  const videoDropzone = useDropzone({
    onDrop: (files) => {
      if(files.length > 0) updateFormData({ video: processFile(files[0], 'video') });
    },
    accept: { 'video/*': ['.mp4', '.mov', '.avi'] },
    maxFiles: 1,
    maxSize: MAX_VIDEO_SIZE,
    disabled: !!video
  });

  // Document Drop Handling
  const documentDropzone = useDropzone({
    onDrop: (files) => {
      const slots = MAX_DOCUMENTS - documents.length;
      const processed = files.slice(0, slots).map((f, i) => processFile(f, 'document', i));
      updateFormData({ documents: [...documents, ...processed] });
    },
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_PDF_SIZE,
    disabled: documents.length >= MAX_DOCUMENTS
  });

  // --- Render Helpers with New UI ---

  const renderDropZone = (dropzone, icon, label, subtitle, disabled) => (
    <Box
      {...dropzone.getRootProps()}
      sx={{
        p: 4,
        border: `2px dashed ${dropzone.isDragActive ? theme.primaryOrange : theme.lightBorder}`,
        borderRadius: 4,
        bgcolor: dropzone.isDragActive ? theme.secondaryBlueBlur : theme.cardBg,
        textAlign: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          borderColor: disabled ? theme.lightBorder : theme.primaryOrange,
          bgcolor: disabled ? theme.cardBg : theme.cardBgActive,
          transform: disabled ? 'none' : 'translateY(-4px)'
        },
        opacity: disabled ? 0.5 : 1
      }}
    >
      <input {...dropzone.getInputProps()} />
      <Box sx={{ color: theme.primaryOrange, mb: 1.5 }}>
        {icon}
      </Box>
      <Typography variant="body1" fontWeight="bold" sx={{ color: theme.pureWhite }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: theme.bodyGrayText }}>
        {subtitle}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ bgcolor: theme.mainBg, p: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: theme.pureWhite }}>
          Media <span style={{ color: theme.primaryOrange }}>Gallery</span>
        </Typography>
        <Typography variant="body2" sx={{ color: theme.bodyGrayText }}>
          Upload high-quality images and videos to showcase your skills.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Images Section */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, borderRadius: 4 }}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ color: theme.pureWhite, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ImageIcon sx={{ color: theme.primaryOrange }} /> Images ({images.length}/{MAX_IMAGES}) — Min: 1, Max: 3
                </Typography>
                {images.length > 0 && <Chip label="Verified" size="small" color="success" icon={<CheckCircle />} />}
              </Stack>

              <Grid container spacing={2}>
                {images.map((img, idx) => (
                  <Grid item xs={12} sm={4} key={img.fileId || idx}>
                    <Fade in={true}>
                      <Box sx={{ 
                        position: 'relative', 
                        borderRadius: 3, 
                        overflow: 'hidden', 
                        height: 160,
                        border: `1px solid ${theme.lightBorder}`,
                        '&:hover .delete-btn': { opacity: 1 }
                      }}>
                        <img src={img.preview} alt="prev" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <IconButton 
                          className="delete-btn"
                          size="small"
                          onClick={() => updateFormData({ images: images.filter((_, i) => i !== idx) })}
                          sx={{ 
                            position: 'absolute', top: 8, right: 8, 
                            bgcolor: 'rgba(255,0,0,0.8)', color: 'white',
                            opacity: 0, transition: '0.2s',
                            '&:hover': { bgcolor: 'red' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                        <Box sx={{ position: 'absolute', bottom: 0, width: '100%', p: 1, bgcolor: 'rgba(0,0,0,0.6)' }}>
                           <Typography variant="caption" noWrap sx={{ color: 'white', display: 'block' }}>{formatFileSize(img.size)}</Typography>
                        </Box>
                      </Box>
                    </Fade>
                  </Grid>
                ))}
                {images.length < MAX_IMAGES && (
                  <Grid item xs={12} sm={4}>
                    {renderDropZone(imageDropzone, <CloudUpload fontSize="large" />, "Add Image", "JPG, PNG (Max 5MB)", images.length >= MAX_IMAGES)}
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Video Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, borderRadius: 4 }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: theme.pureWhite, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <VideoLibrary sx={{ color: theme.primaryOrange }} /> Video Showcase (Max: 1 video, 100MB)
                </Typography>
              
              {video ? (
                <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: '#000' }}>
                  <video src={video.preview} controls style={{ width: '100%', height: '180px' }} />
                  <Button 
                    fullWidth startIcon={<Delete />} color="error" 
                    onClick={() => updateFormData({ video: null })}
                    sx={{ mt: 1, textTransform: 'none' }}
                  >
                    Remove Video
                  </Button>
                </Box>
              ) : (
                renderDropZone(videoDropzone, <VideoLibrary fontSize="large" />, "Upload Video", "MP4, MOV (Max 100MB)", !!video)
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Documents Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', bgcolor: theme.cardBg, border: `1px solid ${theme.lightBorder}`, borderRadius: 4 }}>
            <CardContent>
                <Typography variant="h6" sx={{ color: theme.pureWhite, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PdfIcon sx={{ color: theme.primaryOrange }} /> Documents ({documents.length}/{MAX_DOCUMENTS}) — Max: 2 PDFs
                </Typography>

              <Stack spacing={1} sx={{ mb: 2 }}>
                {documents.map((doc, idx) => (
                  <Box key={idx} sx={{ 
                    p: 1.5, borderRadius: 2, bgcolor: theme.cardBgActive, 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    border: `1px solid ${theme.lightBorder}`
                  }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <PdfIcon sx={{ color: '#ef4444' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: theme.pureWhite }}>{doc.name}</Typography>
                        <Typography variant="caption" sx={{ color: theme.bodyGrayText }}>{formatFileSize(doc.size)}</Typography>
                      </Box>
                    </Stack>
                    <IconButton size="small" color="error" onClick={() => updateFormData({ documents: documents.filter((_, i) => i !== idx) })}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>

              {documents.length < MAX_DOCUMENTS && 
                renderDropZone(documentDropzone, <PdfIcon fontSize="large" />, "Add PDF", "Project Briefs, CV (Max 20MB)", documents.length >= MAX_DOCUMENTS)
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Info */}
      <Box sx={{ 
        mt: 4, p: 2, bgcolor: theme.secondaryBlueBlur, borderRadius: 3, 
        border: `1px solid ${theme.lightBorder}`, display: 'flex', gap: 2 
      }}>
        <InfoOutlined sx={{ color: theme.primaryOrange }} />
        <Typography variant="caption" sx={{ color: theme.mediumGrayTitle }}>
          Make sure your images are high resolution ({IMG_REC_W}x{IMG_REC_H}px) for the best buyer experience. Emojis and bright colors in thumbnails increase clicks!
        </Typography>
      </Box>

      {/* Crop Dialog (Themed) */}
      <ImageCropDialog 
         open={cropDialogOpen} 
         imageSrc={cropImageSrc} 
         onClose={() => setCropDialogOpen(false)} 
         onCropComplete={(blob) => {
           const file = new File([blob], "cropped.jpg", { type: 'image/jpeg' });
           updateFormData({ images: [...images, processFile(file, 'image')] });
           setCropDialogOpen(false);
         }}
      />
    </Box>
  );
};

// --- Styled Crop Dialog ---
const ImageCropDialog = ({ open, imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState(null);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: theme.mainBg, color: 'white', borderRadius: 4 } }}>
      <DialogTitle sx={{ borderBottom: `1px solid ${theme.lightBorder}`, fontWeight: 'bold' }}>
        Perfect Your <span style={{ color: theme.primaryOrange }}>Image</span>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Box sx={{ position: 'relative', height: 400, bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
          <Cropper 
            image={imageSrc} crop={crop} zoom={zoom} aspect={CROP_ASPECT} 
            onCropChange={setCrop} onZoomChange={setZoom} onCropComplete={(_, p) => setPixels(p)} 
          />
        </Box>
        <Box sx={{ mt: 3, px: 2 }}>
           <Typography variant="caption" sx={{ color: theme.bodyGrayText }}>Zoom Adjustment</Typography>
           <Slider value={zoom} min={1} max={3} step={0.1} onChange={(_, v) => setZoom(v)} sx={{ color: theme.primaryOrange }} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, borderTop: `1px solid ${theme.lightBorder}` }}>
        <Button onClick={onClose} sx={{ color: theme.bodyGrayText }}>Cancel</Button>
        <Button 
          variant="contained" 
          onClick={async () => {
             const blob = await getCroppedImg(imageSrc, pixels);
             onCropComplete(blob);
          }} 
          sx={{ bgcolor: theme.primaryOrange, '&:hover': { bgcolor: '#d44a19' }, fontWeight: 'bold', borderRadius: 2 }}
        >
          Crop & Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// (getCroppedImg helper remains same)
const createImage = (url) => new Promise((res, rej) => {
  const img = new Image();
  img.addEventListener('load', () => res(img));
  img.addEventListener('error', (e) => rej(e));
  img.src = url;
});

const getCroppedImg = async (imageSrc, pixelCrop) => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = IMG_REC_W; canvas.height = IMG_REC_H;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, IMG_REC_W, IMG_REC_H);
  return new Promise((res) => canvas.toBlob((b) => res(b), 'image/jpeg', 0.95));
};

export default Gallery;