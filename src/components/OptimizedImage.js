import { memo, useState } from 'react';

/**
 * PERF: Memoized image with loading state. Prevents re-renders when parent updates.
 * Use for above-the-fold images with loading placeholder; add decoding="async" for non-blocking decode.
 */
const OptimizedImage = memo(function OptimizedImage({ src, alt, className, style, width, height }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          className={`${className} loading-placeholder`}
          style={style}
          aria-hidden="true"
        />
      )}
      <img
        src={src}
        alt={alt ?? ''}
        className={className}
        style={{ ...style, display: loaded ? 'block' : 'none' }}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
      />
    </>
  );
});

export default OptimizedImage;
