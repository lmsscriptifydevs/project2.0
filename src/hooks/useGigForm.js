import { debounce } from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setValidationErrors } from './../redux/slices/gigsSlice';

const defaultFormData = {
  gigTitle: 'I will ',
  category_id: '',
  subcategory_id: '',
  tags: [],
  faqs: [],
  packages: {
    basic: { title: 'Good', description: '', delivery_time: '3', revisions: '1', price: '' },
    standard: { title: 'Better', description: '', delivery_time: '5', revisions: '3', price: '' },
    premium: { title: 'Best', description: '', delivery_time: '7', revisions: '5', price: '' }
  },
  description: '',
  requirements: [],
  images: [],
  video: null,
  documents: []
};

const VALIDATION_RULES = {
  gigTitle: { 
    min: 60, 
    max: 90, 
    message: { 
      min: 'Title must be at least 60 characters long', 
      max: 'Title cannot exceed 90 characters' 
    } 
  },
  description: { 
    min: 1500, 
    max: 3000, 
    message: { 
      min: 'Description must be at least 1500 characters long', 
      max: 'Description cannot exceed 3000 characters' 
    } 
  },
  tags: { 
    min: 1, 
    max: 10, 
    message: { 
      min: 'Please add at least one tag', 
      max: 'You can only add up to 10 tags' 
    } 
  },
  requirements: {
    min: 5,
    max: 2000,
    message: {
      min: 'Requirement must be at least 5 characters long',
      max: 'Requirement cannot exceed 2000 characters'
    }
  },
  images: { 
    min: 1, 
    max: 3, 
    message: { 
      min: 'Please upload at least one image', 
      max: 'You can only upload up to 3 images' 
    } 
  },
  documents: { 
    max: 2, 
    message: { 
      max: 'You can only upload up to 2 documents' 
    } 
  },
  video: { 
    max: 1, 
    message: { 
      max: 'You can only upload 1 video' 
    } 
  }
};

const PACKAGE_RULES = {
  title: { 
    max: 50, 
    message: 'Package title cannot exceed 50 characters' 
  },
  description: { 
    min: 750,
    max: 1000, 
    message: {
      min: 'Package description must be at least 750 characters',
      max: 'Package description cannot exceed 1000 characters'
    }
  },
  delivery_time: { 
    min: 1, 
    message: 'Delivery time must be at least 1 day' 
  },
  revisions: { 
    min: 0, 
    allow: 'unlimited',
    message: 'Revisions must be 0 or more or "unlimited"' 
  },
  price: { 
    min: 5, 
    message: 'Package price must be at least $5' 
  }
};

const universalDataTransformer = (inputData) => {
  if (!inputData || typeof inputData !== 'object') {
    return {};
  }

  console.log('Transforming input data:', Object.keys(inputData));

  const safeJsonParse = (str, fallback = []) => {
    if (Array.isArray(str)) return str;
    if (typeof str !== 'string') return fallback;
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : fallback;
    } catch {
      return fallback;
    }
  };

  const extractTitle = (data) => {
    return data.gig_title || data.title || data.gigTitle || '';
  };

  const extractCategoryId = (data) => {
    return data.category_id?.toString() || 
           data.category?.id?.toString() || '';
  };

  const extractSubcategoryId = (data) => {
    return data.subcategory_id?.toString() || 
           data.subcategory?.id?.toString() || '';
  };

  const extractTags = (data) => {
    return safeJsonParse(data.tags) || [];
  };

  const extractDescription = (data) => {
    return data.description || '';
  };

  const extractRequirements = (data) => {
    const requirements = safeJsonParse(data.requirements || data.requirement) || [];
    // Clean each requirement - handle newlines and special characters
    return requirements.map(req => {
      if (typeof req === 'string') {
        return req
          .trim()
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .replace(/\n{3,}/g, '\n\n')
          .replace(/[^\S\n]+/g, ' ')
          .substring(0, 2000);
      }
      return req;
    }).filter(req => req && req.length >= 5);
  };

  const extractFaqs = (data) => {
    let faqs = [];
    if (Array.isArray(data.faqs)) faqs = data.faqs;
    else if (Array.isArray(data.faq)) faqs = data.faq;
    else if (data.faq && typeof data.faq === 'object' && data.faq.question) {
      faqs = [data.faq];
    }
    
    // Clean each FAQ - handle newlines and special characters
    return faqs.map(faq => ({
      ...faq,
      question: faq.question
        ? faq.question
            .trim()
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[^\S\n]+/g, ' ')
            .substring(0, 500)
        : '',
      answer: faq.answer
        ? faq.answer
            .trim()
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            .replace(/\n{3,}/g, '\n\n')
            .replace(/[^\S\n]+/g, ' ')
            .substring(0, 2000)
        : ''
    })).filter(faq => faq.question && faq.answer);
  };

  const extractImages = (data) => {
    const images = [];

    if (data.media) {
      const { image1, image2, image3 } = data.media;
      [image1, image2, image3].forEach((imgUrl, index) => {
        if (imgUrl && typeof imgUrl === 'string' && !imgUrl.includes('gig.jpg')) {
          images.push({
            url: imgUrl,
            name: `image_${index + 1}`,
            type: 'image/jpeg',
            source: `media_image${index + 1}`
          });
        }
      });
    }

    if (Array.isArray(data.images)) {
      data.images.forEach((img, index) => {
        if (img && (img.url || typeof img === 'string')) {
          const url = typeof img === 'string' ? img : img.url;
          images.push({
            url: url,
            name: img.name || `image_${images.length + 1}`,
            type: img.type || 'image/jpeg',
            source: `direct_image_${index}`
          });
        }
      });
    }

    return images;
  };

  const extractPackages = (data) => {
    const packages = { ...defaultFormData.packages };

    if (Array.isArray(data.packages)) {
      data.packages.forEach((pkg, index) => {
        const packageData = {
          title: pkg.title || '',
          description: pkg.description || '',
          delivery_time: (pkg.delivery_time || pkg.deliveryTime || '3').toString(),
          revisions: (pkg.revisions || pkg.ravision || pkg.revision_limit || '1').toString(),
          price: (pkg.price || pkg.total || pkg.amount || '').toString()
        };

        if (pkg.type === 'basic' || index === 0) {
          packages.basic = { ...packages.basic, ...packageData };
        } else if (pkg.type === 'standard' || index === 1) {
          packages.standard = { ...packages.standard, ...packageData };
        } else if (pkg.type === 'premium' || index === 2) {
          packages.premium = { ...packages.premium, ...packageData };
        }
      });
    } else if (data.packages && typeof data.packages === 'object') {
      Object.keys(data.packages).forEach(pkgType => {
        if (packages[pkgType] && data.packages[pkgType]) {
          packages[pkgType] = { ...packages[pkgType], ...data.packages[pkgType] };
        }
      });
    }

    return packages;
  };

  const transformed = {
    gigTitle: extractTitle(inputData),
    category_id: extractCategoryId(inputData),
    subcategory_id: extractSubcategoryId(inputData),
    tags: extractTags(inputData),
    description: extractDescription(inputData),
    requirements: extractRequirements(inputData),
    faqs: extractFaqs(inputData),
    images: extractImages(inputData),
    video: inputData.video || (inputData.media?.video ? { url: inputData.media.video, name: 'video', type: 'video/mp4' } : null),
    documents: inputData.documents?.length > 0 ? inputData.documents : (() => {
      const docs = [];
      if (inputData.media?.pdf_file1) docs.push({ url: inputData.media.pdf_file1, name: 'document_1', type: 'application/pdf' });
      if (inputData.media?.pdf_file2) docs.push({ url: inputData.media.pdf_file2, name: 'document_2', type: 'application/pdf' });
      return docs;
    })(),
    packages: extractPackages(inputData)
  };

  return transformed;
};

export const useGigForm = (initialData = {}) => {
  const dispatch = useDispatch();
  const previousDataRef = useRef();
  const isInitialMount = useRef(true);

  const processedInitialData = useMemo(() => {
    const shouldTransform = initialData && Object.keys(initialData).length > 0;

    if (shouldTransform) {
      const transformed = universalDataTransformer(initialData);
      return transformed;
    }

    return {};
  }, [initialData]);

  const [formData, setFormData] = useState(() => {
    const initialState = {
      ...defaultFormData,
      ...processedInitialData,
      packages: {
        ...defaultFormData.packages,
        ...(processedInitialData.packages || {})
      }
    };
    return initialState;
  });

  useEffect(() => {
    if (processedInitialData && Object.keys(processedInitialData).length > 0) {
      setFormData({
        ...defaultFormData,
        ...processedInitialData,
        packages: {
          ...defaultFormData.packages,
          ...(processedInitialData.packages || {})
        }
      });
    } else if (isInitialMount.current) {
      setFormData(defaultFormData);
    }
    isInitialMount.current = false;
  }, [processedInitialData]);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => {
      const newData = { ...prev, ...updates };

      if (updates.packages) {
        newData.packages = {
          ...prev.packages,
          ...updates.packages,
          ...(updates.packages.basic && {
            basic: { ...prev.packages.basic, ...updates.packages.basic }
          }),
          ...(updates.packages.standard && {
            standard: { ...prev.packages.standard, ...updates.packages.standard }
          }),
          ...(updates.packages.premium && {
            premium: { ...prev.packages.premium, ...updates.packages.premium }
          })
        };
      }

      return newData;
    });
  }, []);

  const immediateUpdate = useCallback((updates) => {
    updateFormData(updates);
  }, [updateFormData]);

  const debouncedUpdate = useMemo(
    () => debounce(updateFormData, 1000),
    [updateFormData]
  );

  const resetForm = useCallback(() => {
    setFormData(defaultFormData);
    previousDataRef.current = undefined;
    isInitialMount.current = true;
  }, []);

  const validateField = useCallback((field, value) => {
    const rules = VALIDATION_RULES[field];
    if (!rules) return null;

    if (rules.min && value.length < rules.min) return rules.message.min;
    if (rules.max && value.length > rules.max) return rules.message.max;

    return null;
  }, []);

  const validateMedia = useCallback((field, files) => {
    const rules = VALIDATION_RULES[field];
    if (!rules) return null;

    if (rules.min && (!files || files.length < rules.min)) return rules.message.min;
    if (rules.max && files && files.length > rules.max) return rules.message.max;

    return null;
  }, []);

  const validatePackage = useCallback((pkg, pkgType) => {
    const errors = {};
    const packageName = pkgType.charAt(0).toUpperCase() + pkgType.slice(1);

    if (!pkg.title || pkg.title.trim().length === 0) {
      errors.title = `${packageName} package title is required`;
    } else if (pkg.title.length > PACKAGE_RULES.title.max) {
      errors.title = PACKAGE_RULES.title.message;
    }

    if (!pkg.description || pkg.description.trim().length === 0) {
      errors.description = `${packageName} package description is required`;
    } else if (pkg.description.length < PACKAGE_RULES.description.min) {
      errors.description = PACKAGE_RULES.description.message.min;
    } else if (pkg.description.length > PACKAGE_RULES.description.max) {
      errors.description = PACKAGE_RULES.description.message.max;
    }

    const deliveryTime = parseInt(pkg.delivery_time);
    if (isNaN(deliveryTime) || deliveryTime < PACKAGE_RULES.delivery_time.min) {
      errors.delivery_time = PACKAGE_RULES.delivery_time.message;
    }

    const revisions = pkg.revisions?.toString().toLowerCase().trim();

    if (!revisions && revisions !== '0') {
      errors.revisions = 'Revisions field is required';
    } else if (revisions === 'unlimited') {
      // valid
    } else {
      const revisionsNum = parseInt(revisions);
      if (isNaN(revisionsNum)) {
        errors.revisions = 'Revisions must be a number or "unlimited"';
      } else if (revisionsNum < PACKAGE_RULES.revisions.min) {
        errors.revisions = PACKAGE_RULES.revisions.message;
      }
    }

    const price = parseFloat(pkg.price);
    if (isNaN(price) || price < PACKAGE_RULES.price.min) {
      errors.price = PACKAGE_RULES.price.message;
    }

    return errors;
  }, []);

  const validateCrossField = useCallback((formData) => {
    const errors = {};
    const basicPrice = parseFloat(formData.packages?.basic?.price);
    const standardPrice = parseFloat(formData.packages?.standard?.price);
    const premiumPrice = parseFloat(formData.packages?.premium?.price);

    if (basicPrice && standardPrice && basicPrice >= standardPrice) {
      errors.package_pricing = "Standard package should be priced higher than Basic";
    }
    if (standardPrice && premiumPrice && standardPrice >= premiumPrice) {
      errors.package_pricing = "Premium package should be priced higher than Standard";
    }

    return errors;
  }, []);

  const validateStep = useCallback((step) => {
    const errors = {};

    switch (step) {
      case 0: {
        errors.gigTitle = validateField('gigTitle', formData.gigTitle || '');
        if (!formData.category_id) errors.category_id = 'Please select a category';
        if (!formData.subcategory_id) errors.subcategory_id = 'Please select a subcategory';

        const tagsError = validateMedia('tags', formData.tags);
        if (tagsError) errors.tags = tagsError;
        break;
      }

      case 1: {
        if (!formData.packages) {
          errors.packages = 'Packages configuration is required';
        } else {
          const packageTypes = ['basic', 'standard', 'premium'];
          packageTypes.forEach(pkgType => {
            const pkg = formData.packages[pkgType];
            if (!pkg) {
              errors.packages = `${pkgType.charAt(0).toUpperCase() + pkgType.slice(1)} package is required`;
            } else {
              const packageErrors = validatePackage(pkg, pkgType);
              Object.keys(packageErrors).forEach(errorKey => {
                errors[`${pkgType}_${errorKey}`] = packageErrors[errorKey];
              });
            }
          });
          Object.assign(errors, validateCrossField(formData));
        }
        break;
      }

      case 2: {
        const plainText = formData.description?.replace(/<[^>]*>/g, '') || '';
        if (plainText.length < VALIDATION_RULES.description.min) {
          errors.description = VALIDATION_RULES.description.message.min;
        } else if (plainText.length > VALIDATION_RULES.description.max) {
          errors.description = VALIDATION_RULES.description.message.max;
        }
        break;
      }

      case 3: {
        // FAQ step - at least 1 FAQ required
        if (!formData.faqs || !Array.isArray(formData.faqs) || formData.faqs.length === 0) {
          errors.faqs = 'Please add at least 1 FAQ before proceeding';
        } else {
          // Validate each FAQ has minimum content
          formData.faqs.forEach((faq, index) => {
            if (!faq.question || faq.question.trim().length < 10) {
              errors[`faq_question_${index}`] = `FAQ ${index + 1} question must be at least 10 characters`;
            }
            if (!faq.answer || faq.answer.trim().length < 10) {
              errors[`faq_answer_${index}`] = `FAQ ${index + 1} answer must be at least 10 characters`;
            }
          });
        }
        break;
      }

      case 4: {
        // Requirements step - at least 1 requirement required
        if (!formData.requirements || !Array.isArray(formData.requirements) || formData.requirements.length === 0) {
          errors.requirements = 'Please add at least 1 requirement before proceeding';
        } else {
          formData.requirements.forEach((req, index) => {
            if (req && req.length < 5) {
              errors[`requirement_${index}`] = `Requirement ${index + 1} must be at least 5 characters`;
            } else if (req && req.length > 2000) {
              errors[`requirement_${index}`] = `Requirement ${index +1} cannot exceed 2000 characters`;
            }
          });
        }
        break;
      }

      case 5: {
        const imagesError = validateMedia('images', formData.images);
        if (imagesError) errors.images = imagesError;

        const documentsError = validateMedia('documents', formData.documents);
        if (documentsError) errors.documents = documentsError;

        if (formData.video) {
          if (formData.video.size && formData.video.size > 50 * 1024 * 1024) {
            errors.video = 'Video file size must be less than 50MB';
          }
        }
        break;
      }

      default:
        break;
    }

    const filteredErrors = Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value !== null && value !== undefined)
    );

    dispatch(setValidationErrors(filteredErrors));
    return Object.keys(filteredErrors).length === 0;
  }, [formData, validateField, validateMedia, validatePackage, validateCrossField, dispatch]);

  const isStepValid = useCallback((step) => {
    switch (step) {
      case 0:
        return formData.gigTitle?.trim().length >= VALIDATION_RULES.gigTitle.min &&
               formData.gigTitle?.length <= VALIDATION_RULES.gigTitle.max &&
               formData.category_id &&
               formData.subcategory_id &&
               formData.tags?.length >= VALIDATION_RULES.tags.min &&
               formData.tags?.length <= VALIDATION_RULES.tags.max;

      case 1: {
        if (!formData.packages) return false;
        const packageTypes = ['basic', 'standard', 'premium'];
        return packageTypes.every(pkgType => {
          const pkg = formData.packages[pkgType];
          if (!pkg) return false;

          const hasValidTitle = pkg.title?.trim().length > 0 && pkg.title?.length <= PACKAGE_RULES.title.max;
          const hasValidDescription = pkg.description?.trim().length >= PACKAGE_RULES.description.min && pkg.description?.length <= PACKAGE_RULES.description.max;
          const hasValidDeliveryTime = pkg.delivery_time && parseInt(pkg.delivery_time) >= PACKAGE_RULES.delivery_time.min;

          const revisions = pkg.revisions?.toString().toLowerCase().trim();
          const hasValidRevisions = revisions === 'unlimited' ||
                                   (revisions && !isNaN(parseInt(revisions)) && parseInt(revisions) >= PACKAGE_RULES.revisions.min);

          const hasValidPrice = pkg.price && parseFloat(pkg.price) >= PACKAGE_RULES.price.min;

          return hasValidTitle && hasValidDescription && hasValidDeliveryTime && hasValidRevisions && hasValidPrice;
        });
      }

      case 2: {
        const plainText = formData.description?.replace(/<[^>]*>/g, '') || '';
        return plainText.length >= VALIDATION_RULES.description.min &&
               plainText.length <= VALIDATION_RULES.description.max;
      }

      case 3:
        // FAQ step - at least 1 FAQ required with valid content
        if (!formData.faqs || !Array.isArray(formData.faqs) || formData.faqs.length === 0) {
          return false;
        }
        return formData.faqs.every(faq => 
          faq.question && faq.question.trim().length >= 10 && 
          faq.answer && faq.answer.trim().length >= 10
        );

      case 4:
        // Requirements step - at least 1 requirement required
        if (!formData.requirements || !Array.isArray(formData.requirements) || formData.requirements.length === 0) {
          return false;
        }
        return formData.requirements.every(req => req && req.length >= 5 && req.length <= 2000);

      case 5: {
        const hasValidImages = formData.images &&
                             formData.images.length >= VALIDATION_RULES.images.min &&
                             formData.images.length <= VALIDATION_RULES.images.max;

        const hasValidDocuments = !formData.documents ||
                                formData.documents.length <= VALIDATION_RULES.documents.max;

        const hasValidVideo = !formData.video ||
                             (formData.video && typeof formData.video === 'object' && Object.keys(formData.video).length > 0);

        return hasValidImages && hasValidDocuments && hasValidVideo;
      }

      default:
        return true;
    }
  }, [formData]);

  const getCharacterCount = useCallback((html) => html?.replace(/<[^>]*>/g, '').length || 0, []);

  const hasChanges = useCallback(() => {
    return JSON.stringify(formData) !== JSON.stringify(previousDataRef.current);
  }, [formData]);

  useEffect(() => {
    if (Object.keys(formData).length > 0 && !previousDataRef.current) {
      previousDataRef.current = JSON.parse(JSON.stringify(formData));
    }
  }, [formData]);

  return {
    formData,
    updateFormData: immediateUpdate,
    debouncedUpdate,
    resetForm,
    validateStep,
    isStepValid,
    getCharacterCount,
    hasChanges,
    validationRules: VALIDATION_RULES
  };
};