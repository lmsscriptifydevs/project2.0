import {
    AddPhotoAlternate,
    CloudUpload,
    Delete,
    PictureAsPdf,
    Videocam
} from "@mui/icons-material";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Grid,
    IconButton,
    LinearProgress,
    Typography
} from "@mui/material";
import { useCallback, useRef } from "react";

const FileUploadArea = ({ 
  title, 
  subtitle, 
  acceptedFiles, 
  onFilesSelect, 
  files, 
  onFileRemove,
  maxFiles,
  icon: Icon
}) => {
  const fileInputRef = useRef();

  const handleFileChange = useCallback((event) => {
    const selectedFiles = Array.from(event.target.files);
    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }
    onFilesSelect(selectedFiles);
    event.target.value = ''; // Reset input
  }, [files.length, maxFiles, onFilesSelect]);

  const handleDrop = useCallback((event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    onFilesSelect(droppedFiles);
  }, [onFilesSelect]);

  const handleDragOver = useCallback((event) => {
    event.preventDefault();
  }, []);

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{title}</Typography>
        </Box>
        
        <Typography variant="body2" color="textSecondary" paragraph>
          {subtitle}
        </Typography>

        {/* Upload Area */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: '2px dashed',
            borderColor: 'primary.main',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: 'action.hover',
            mb: 2
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            Drag & drop files here or click to browse
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Accepted formats: {acceptedFiles} • Max: {maxFiles} files
          </Typography>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={acceptedFiles}
            multiple
            style={{ display: 'none' }}
          />
        </Box>

        {/* Selected Files */}
        {files.length > 0 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Selected Files ({files.length}/{maxFiles})
            </Typography>
            <Grid container spacing={1}>
              {files.map((file, index) => (
                <Grid item xs={12} key={index}>
                  <Card variant="outlined" sx={{ p: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
                        <Icon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {file.name}
                        </Typography>
                      </Box>
                      <IconButton 
                        size="small" 
                        onClick={() => onFileRemove(index)}
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                    {file.uploadProgress !== undefined && (
                      <LinearProgress 
                        variant="determinate" 
                        value={file.uploadProgress || 0}
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        <Button
          startIcon={<AddPhotoAlternate />}
          onClick={() => fileInputRef.current?.click()}
          variant="outlined"
          fullWidth
          disabled={files.length >= maxFiles}
        >
          Add Files ({files.length}/{maxFiles})
        </Button>
      </CardContent>
    </Card>
  );
};

const StepFive = ({
  uploadedImages,
  setUploadedImages,
  uploadedVideos,
  setUploadedVideos,
  uploadedPDFs,
  setUploadedPDFs,
  isError,
  errorMessage
}) => {
  const handleImagesSelect = useCallback((files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setUploadedImages(prev => [...prev, ...imageFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }))]);
  }, [setUploadedImages]);

  const handleVideosSelect = useCallback((files) => {
    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    setUploadedVideos(prev => [...prev, ...videoFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }))]);
  }, [setUploadedVideos]);

  const handlePDFsSelect = useCallback((files) => {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    setUploadedPDFs(prev => [...prev, ...pdfFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadProgress: 0
    }))]);
  }, [setUploadedPDFs]);

  const handleImageRemove = useCallback((index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  }, [setUploadedImages]);

  const handleVideoRemove = useCallback((index) => {
    setUploadedVideos(prev => prev.filter((_, i) => i !== index));
  }, [setUploadedVideos]);

  const handlePDFRemove = useCallback((index) => {
    setUploadedPDFs(prev => prev.filter((_, i) => i !== index));
  }, [setUploadedPDFs]);

  const totalFiles = uploadedImages.length + uploadedVideos.length + uploadedPDFs.length;

  return (
    <Box className="step-five">
      <Typography variant="h5" gutterBottom>
        Gallery & Portfolio
      </Typography>
      <Typography variant="body2" color="textSecondary" paragraph>
        Showcase your work with images, videos, and PDF samples.
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Images Upload */}
        <Grid item xs={12} md={6}>
          <FileUploadArea
            title="Images"
            subtitle="Upload high-quality images of your work"
            acceptedFiles="image/*"
            onFilesSelect={handleImagesSelect}
            files={uploadedImages}
            onFileRemove={handleImageRemove}
            maxFiles={10}
            icon={AddPhotoAlternate}
          />
        </Grid>

        {/* Videos Upload */}
        <Grid item xs={12} md={6}>
          <FileUploadArea
            title="Videos"
            subtitle="Upload video demonstrations or samples"
            acceptedFiles="video/*"
            onFilesSelect={handleVideosSelect}
            files={uploadedVideos}
            onFileRemove={handleVideoRemove}
            maxFiles={3}
            icon={Videocam}
          />
        </Grid>

        {/* PDFs Upload */}
        <Grid item xs={12}>
          <FileUploadArea
            title="PDF Documents"
            subtitle="Upload case studies, portfolios, or documentation"
            acceptedFiles=".pdf"
            onFilesSelect={handlePDFsSelect}
            files={uploadedPDFs}
            onFileRemove={handlePDFRemove}
            maxFiles={5}
            icon={PictureAsPdf}
          />
        </Grid>

        {/* Summary */}
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upload Summary
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Chip 
                  label={`${uploadedImages.length} Images`} 
                  color={uploadedImages.length > 0 ? "success" : "default"}
                  variant={uploadedImages.length > 0 ? "filled" : "outlined"}
                />
                <Chip 
                  label={`${uploadedVideos.length} Videos`} 
                  color={uploadedVideos.length > 0 ? "success" : "default"}
                  variant={uploadedVideos.length > 0 ? "filled" : "outlined"}
                />
                <Chip 
                  label={`${uploadedPDFs.length} PDFs`} 
                  color={uploadedPDFs.length > 0 ? "success" : "default"}
                  variant={uploadedPDFs.length > 0 ? "filled" : "outlined"}
                />
                <Chip 
                  label={`${totalFiles} Total Files`} 
                  color="primary"
                  variant="filled"
                />
              </Box>
              
              {uploadedImages.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  At least one image is required to publish your gig.
                </Alert>
              )}

              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Tips for better results:</strong>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  • Use high-quality, professional images<br/>
                  • Show different angles and details of your work<br/>
                  • Include before/after examples if applicable<br/>
                  • Keep videos under 2 minutes for better engagement<br/>
                  • Use PDFs for detailed case studies and testimonials
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StepFive;