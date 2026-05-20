// src/config/categoryFieldsConfig.js

/**
 * Category-specific field configurations
 * This defines what additional fields appear for each category/subcategory
 */

export const FIELD_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SELECT: 'select',
  MULTISELECT: 'multiselect',
  CHECKBOX: 'checkbox',
  RADIO: 'radio',
  TEXTAREA: 'textarea',
  FILE: 'file',
  DATE: 'date',
  TOGGLE: 'toggle'
};

// Field configuration structure
const createField = (config) => ({
  id: config.id,
  label: config.label,
  type: config.type,
  required: config.required || false,
  placeholder: config.placeholder || '',
  helperText: config.helperText || '',
  validation: config.validation || null,
  options: config.options || [], // For select/multiselect/radio
  step: config.step || 'overview', // Which step to show in: overview, pricing, description, requirements, gallery
  condition: config.condition || null, // Function to determine if field should show
  defaultValue: config.defaultValue || '',
  min: config.min,
  max: config.max,
  accept: config.accept, // For file inputs
  multiple: config.multiple || false
});

// Category field mappings
export const categoryFields = {
  // GRAPHIC DESIGN CATEGORIES
  'logo-design': {
    overview: [
      createField({
        id: 'logo_style',
        label: 'Logo Style',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['Minimalist', 'Modern', 'Vintage', 'Hand-drawn', '3D', 'Mascot', 'Typography', 'Abstract'],
        helperText: 'Select styles you can deliver (max 3)',
        validation: (value) => value?.length > 0 && value?.length <= 3
      }),
      createField({
        id: 'file_formats',
        label: 'File Formats Provided',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['AI', 'EPS', 'PDF', 'PNG', 'JPG', 'SVG', 'PSD'],
        helperText: 'What file formats will you deliver?'
      }),
      createField({
        id: 'includes_source_file',
        label: 'Include Source Files',
        type: FIELD_TYPES.TOGGLE,
        helperText: 'Will you provide editable source files?'
      })
    ],
    pricing: [
      createField({
        id: 'revision_rounds',
        label: 'Revision Rounds',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 0,
        max: 10,
        helperText: 'How many revision rounds included per package?'
      }),
      createField({
        id: 'concepts_included',
        label: 'Initial Concepts',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 1,
        max: 20,
        helperText: 'Number of initial logo concepts'
      })
    ],
    requirements: [
      createField({
        id: 'requires_brand_guidelines',
        label: 'Do you have existing brand guidelines?',
        type: FIELD_TYPES.RADIO,
        required: true,
        options: ['Yes', 'No', 'Will provide later']
      }),
      createField({
        id: 'color_preference',
        label: 'Color Preferences',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Describe your color preferences or provide hex codes'
      })
    ]
  },

  // VIDEO & ANIMATION
  'video-editing': {
    overview: [
      createField({
        id: 'video_type',
        label: 'Video Type',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['YouTube Video', 'Social Media', 'Commercial', 'Documentary', 'Wedding', 'Corporate', 'Music Video'],
        helperText: 'What types of videos do you edit?'
      }),
      createField({
        id: 'editing_software',
        label: 'Software Used',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'Avid'],
        helperText: 'What software do you use?'
      })
    ],
    pricing: [
      createField({
        id: 'video_length_minutes',
        label: 'Maximum Video Length (minutes)',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 1,
        max: 120,
        helperText: 'Max length for this package'
      }),
      createField({
        id: 'includes_color_grading',
        label: 'Color Grading Included',
        type: FIELD_TYPES.TOGGLE
      }),
      createField({
        id: 'includes_sound_design',
        label: 'Sound Design Included',
        type: FIELD_TYPES.TOGGLE
      })
    ],
    requirements: [
      createField({
        id: 'footage_format',
        label: 'Footage Format',
        type: FIELD_TYPES.TEXT,
        required: true,
        placeholder: 'e.g., MP4, MOV, 4K, 1080p'
      }),
      createField({
        id: 'reference_videos',
        label: 'Reference Video Links',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Paste YouTube/Vimeo links of similar style'
      })
    ]
  },

  // VOICE OVER
  'voice-over': {
    overview: [
      createField({
        id: 'voice_gender',
        label: 'Voice Gender',
        type: FIELD_TYPES.SELECT,
        required: true,
        options: ['Male', 'Female', 'Non-binary', 'Child']
      }),
      createField({
        id: 'accents',
        label: 'Accents Available',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['American', 'British', 'Australian', 'Indian', 'French', 'German', 'Spanish', 'Neutral']
      }),
      createField({
        id: 'voice_age',
        label: 'Voice Age Range',
        type: FIELD_TYPES.SELECT,
        required: true,
        options: ['Young Adult (18-30)', 'Adult (30-50)', 'Mature (50+)', 'Child']
      })
    ],
    pricing: [
      createField({
        id: 'word_count',
        label: 'Maximum Word Count',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 50,
        max: 5000,
        helperText: 'Max words for this package'
      }),
      createField({
        id: 'includes_background_music',
        label: 'Background Music Included',
        type: FIELD_TYPES.TOGGLE
      }),
      createField({
        id: 'includes_sync_to_video',
        label: 'Sync to Video Included',
        type: FIELD_TYPES.TOGGLE
      })
    ],
    requirements: [
      createField({
        id: 'script_provided',
        label: 'Will you provide a script?',
        type: FIELD_TYPES.RADIO,
        required: true,
        options: ['Yes', 'No, I need help writing it']
      }),
      createField({
        id: 'tone_style',
        label: 'Tone/Style',
        type: FIELD_TYPES.SELECT,
        options: ['Professional', 'Conversational', 'Energetic', 'Calm', 'Authoritative', 'Friendly']
      })
    ]
  },

  // WRITING & TRANSLATION
  'article-writing': {
    overview: [
      createField({
        id: 'writing_niches',
        label: 'Writing Niches',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['Technology', 'Health', 'Finance', 'Travel', 'Lifestyle', 'Business', 'Education', 'Entertainment'],
        helperText: 'Select up to 5 niches'
      }),
      createField({
        id: 'seo_optimized',
        label: 'SEO Optimized',
        type: FIELD_TYPES.TOGGLE,
        helperText: 'Do you optimize for search engines?'
      })
    ],
    pricing: [
      createField({
        id: 'word_count_range',
        label: 'Word Count',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 100,
        max: 10000,
        helperText: 'Number of words per article'
      }),
      createField({
        id: 'includes_research',
        label: 'Research Included',
        type: FIELD_TYPES.TOGGLE
      }),
      createField({
        id: 'includes_images',
        label: 'Images Included',
        type: FIELD_TYPES.TOGGLE
      })
    ],
    requirements: [
      createField({
        id: 'target_keywords',
        label: 'Target Keywords',
        type: FIELD_TYPES.TEXTAREA,
        placeholder: 'Provide keywords to target (one per line)'
      }),
      createField({
        id: 'content_tone',
        label: 'Content Tone',
        type: FIELD_TYPES.SELECT,
        options: ['Professional', 'Casual', 'Technical', 'Conversational', 'Academic']
      })
    ]
  },

  // PROGRAMMING & TECH
  'web-development': {
    overview: [
      createField({
        id: 'tech_stack',
        label: 'Technology Stack',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['React', 'Vue', 'Angular', 'Node.js', 'Python', 'PHP', 'WordPress', 'Shopify', 'Laravel', 'Django'],
        helperText: 'Technologies you work with'
      }),
      createField({
        id: 'responsive_design',
        label: 'Responsive Design',
        type: FIELD_TYPES.TOGGLE,
        defaultValue: true,
        helperText: 'Mobile-friendly design included?'
      })
    ],
    pricing: [
      createField({
        id: 'num_pages',
        label: 'Number of Pages',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 1,
        max: 50
      }),
      createField({
        id: 'includes_backend',
        label: 'Backend Development',
        type: FIELD_TYPES.TOGGLE
      }),
      createField({
        id: 'includes_cms',
        label: 'CMS Integration',
        type: FIELD_TYPES.TOGGLE
      })
    ],
    requirements: [
      createField({
        id: 'hosting_info',
        label: 'Hosting Provider',
        type: FIELD_TYPES.TEXT,
        placeholder: 'e.g., AWS, Vercel, Netlify, or your own'
      }),
      createField({
        id: 'design_provided',
        label: 'Will you provide design files?',
        type: FIELD_TYPES.RADIO,
        required: true,
        options: ['Yes (Figma/XD)', 'No, need design too', 'I have reference sites']
      })
    ]
  },

  // MUSIC & AUDIO
  'music-production': {
    overview: [
      createField({
        id: 'music_genres',
        label: 'Music Genres',
        type: FIELD_TYPES.MULTISELECT,
        required: true,
        options: ['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Classical', 'Jazz', 'Country', 'R&B'],
        helperText: 'Genres you produce'
      }),
      createField({
        id: 'daw_software',
        label: 'DAW Used',
        type: FIELD_TYPES.MULTISELECT,
        options: ['FL Studio', 'Ableton Live', 'Logic Pro', 'Pro Tools', 'Cubase']
      })
    ],
    pricing: [
      createField({
        id: 'track_length_seconds',
        label: 'Track Length (seconds)',
        type: FIELD_TYPES.NUMBER,
        required: true,
        min: 15,
        max: 600
      }),
      createField({
        id: 'includes_mixing',
        label: 'Mixing Included',
        type: FIELD_TYPES.TOGGLE
      }),
      createField({
        id: 'includes_mastering',
        label: 'Mastering Included',
        type: FIELD_TYPES.TOGGLE
      })
    ]
  }
};

// Helper to get fields for a category/subcategory and step
export const getFieldsForCategory = (categorySlug, step = 'overview') => {
  const config = categoryFields[categorySlug];
  if (!config || !config[step]) return [];
  return config[step];
};

// Helper to get all fields for a category across all steps
export const getAllFieldsForCategory = (categorySlug) => {
  const config = categoryFields[categorySlug];
  if (!config) return {};
  return config;
};

// Map category IDs to slugs (you'll need to adjust based on your actual category IDs)
export const categoryIdToSlug = {
  1: 'logo-design',
  2: 'video-editing',
  3: 'voice-over',
  4: 'article-writing',
  5: 'web-development',
  6: 'music-production',
  // Add more mappings based on your categories
};

export const getCategorySlugById = (categoryId) => {
  return categoryIdToSlug[categoryId] || null;
};