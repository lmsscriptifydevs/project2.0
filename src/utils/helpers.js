function stripHtmlTags(html) {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  }
  function titleToSlug(title) {
    return title.toLowerCase().replace(/\s+/g, '-');
}
// Function to paginate the array
function paginateArray(array, pageSize, pageNumber) {
    --pageNumber; // Adjust the page number to 0-based index
    var startIndex = pageNumber * pageSize;
    var endIndex = startIndex + pageSize;
    return array?.slice(startIndex, endIndex);
  }
const MEDIA_BASE = "https://portal.grapetask.co";

function resolveMediaUrl(path) {
  if (!path || typeof path !== 'string') return '';
  let trimmed = path.trim();
  if (!trimmed) return '';
  const baseWithSlash = MEDIA_BASE + '/';
  while (trimmed.includes(baseWithSlash)) {
    const idx = trimmed.lastIndexOf(baseWithSlash);
    trimmed = trimmed.substring(idx + baseWithSlash.length);
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('blob:') || trimmed.startsWith('data:')) return trimmed;
  return `${MEDIA_BASE}/${trimmed.replace(/^\//, '')}`;
}

function getGigThumbnail(media) {
  if (!media) return '';
  const raw = media.image1 || media.image_1 || media.image2 || media.image_2 || media.image3 || media.image_3;
  return raw ? resolveMediaUrl(raw) : '';
}

function getGigImages(media) {
  if (!media) return [];
  const images = [];
  const fields = ['image1', 'image_1', 'image2', 'image_2', 'image3', 'image_3'];
  const seen = new Set();
  for (const field of fields) {
    const raw = media[field];
    if (raw && typeof raw === 'string') {
      const resolved = resolveMediaUrl(raw);
      if (resolved && !seen.has(resolved)) {
        seen.add(resolved);
        images.push(resolved);
      }
    }
  }
  return images;
}

function getGigVideo(media) {
  if (!media) return null;
  const raw = media.video;
  if (raw && typeof raw === 'string') {
    return resolveMediaUrl(raw);
  }
  return null;
}

export { paginateArray, stripHtmlTags, titleToSlug, resolveMediaUrl, getGigThumbnail, getGigImages, getGigVideo, MEDIA_BASE };
