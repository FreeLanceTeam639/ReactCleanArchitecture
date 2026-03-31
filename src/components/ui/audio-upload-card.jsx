import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ImagePlus, Upload, X } from 'lucide-react';

function cn(...parts) {
  return parts.filter(Boolean).join(' ');
}

function truncateFilename(filename, maxLength = 28) {
  if (!filename || filename.length <= maxLength) {
    return filename || '';
  }

  const extension = filename.includes('.') ? filename.split('.').pop() : '';
  const nameWithoutExt = extension ? filename.slice(0, -(extension.length + 1)) : filename;
  const sliceLength = Math.max(10, maxLength - extension.length - 4);

  return extension
    ? `${nameWithoutExt.slice(0, sliceLength)}...${extension}`
    : `${filename.slice(0, maxLength - 3)}...`;
}

function DecorativeBars({ width = 176, height = 32, bars = 28 }) {
  const items = useMemo(() => {
    const barWidth = width / (bars * 1.7);
    const spacing = barWidth * 0.7;
    const totalWidth = barWidth * bars + spacing * (bars - 1);
    const startX = Math.max(0, (width - totalWidth) / 2);

    return Array.from({ length: bars }, (_, index) => {
      const variance = ((index * 17) % 9) + 3;
      const barHeight = Math.max(8, Math.min(height - 4, variance * 2.6));
      const x = startX + index * (barWidth + spacing);
      const y = (height - barHeight) / 2;

      return (
        <rect
          key={index}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          rx={barWidth * 0.6}
          ry={barWidth * 0.6}
          fill="currentColor"
        />
      );
    });
  }, [bars, height, width]);

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      {items}
    </svg>
  );
}

function FloatingFileCard({ isVisible, label, previewUrl, onDismiss, onAnimationComplete }) {
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsRemoving(false);
    }
  }, [isVisible]);

  if (!isVisible || !label) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="uploadCardFloatingWrap"
        initial={{ right: 18, bottom: 18, opacity: 0, scale: 0.86 }}
        animate={
          isRemoving
            ? {
                opacity: 0,
                scale: 0,
                filter: 'blur(8px)',
                transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
              }
            : {
                left: '50%',
                top: '50%',
                x: '-50%',
                y: '-50%',
                opacity: 1,
                scale: 1,
                transition: { duration: 0.45, ease: [0.23, 1, 0.32, 1] }
              }
        }
        exit={{
          opacity: 0,
          scale: 0,
          filter: 'blur(8px)',
          transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] }
        }}
        onAnimationComplete={isRemoving ? onDismiss : onAnimationComplete}
      >
        <motion.div
          className="uploadCardFloatingChip"
          initial={{ scale: 1.24 }}
          animate={
            isRemoving
              ? { scale: 0, transition: { duration: 0.3 } }
              : [
                  { scale: 1.08, transition: { duration: 0.18, ease: 'easeInOut' } },
                  { scale: 1, transition: { duration: 0.36, ease: [0.68, -0.55, 0.265, 1.55] } }
                ]
          }
        >
          <button
            type="button"
            className="uploadCardFloatingDismiss interactive"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setIsRemoving(true);
            }}
            aria-label="Dismiss upload preview"
          >
            <X size={12} />
          </button>

          <div className="uploadCardFloatingVisual">
            {previewUrl ? (
              <img src={previewUrl} alt={label} className="uploadCardFloatingThumb" />
            ) : (
              <div className="uploadCardFloatingBars">
                <DecorativeBars />
              </div>
            )}
          </div>
          <span className="uploadCardFloatingLabel">{label}</span>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function buildFloatingLabel(files, fileTypeLabel) {
  const [firstFile] = files;

  if (!firstFile) {
    return '';
  }

  const baseName = truncateFilename(firstFile.name || `${fileTypeLabel || 'file'}`);

  if (files.length === 1) {
    return baseName;
  }

  return `${baseName} +${files.length - 1} ${fileTypeLabel || 'file'}${files.length - 1 > 1 ? 's' : ''}`;
}

export const AudioUploadCard = forwardRef(function AudioUploadCard(
  {
    className,
    triggerAnimation = false,
    onAnimationComplete,
    title = 'Upload Files',
    description = 'Drop files here or click to browse.',
    accept = 'image/png,image/jpeg,image/webp',
    multiple = false,
    disabled = false,
    buttonLabel = 'Browse files',
    helperItems = [],
    maxFiles = null,
    selectedCount = 0,
    fileTypeLabel = 'file',
    onFilesSelected,
    showFloatingPreview = true
  },
  ref
) {
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [floatingLabel, setFloatingLabel] = useState('');
  const [floatingPreviewUrl, setFloatingPreviewUrl] = useState('');

  const releasePreviewUrl = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = '';
    }
  }, []);

  useEffect(() => () => releasePreviewUrl(), [releasePreviewUrl]);

  useEffect(() => {
    if (triggerAnimation) {
      setIsAnimating(true);
    }
  }, [triggerAnimation]);

  const handleDismissIndicator = useCallback(() => {
    setIsAnimating(false);
    setFloatingLabel('');
    setFloatingPreviewUrl('');
    releasePreviewUrl();
  }, [releasePreviewUrl]);

  const openPicker = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  useImperativeHandle(
    ref,
    () => ({
      open: openPicker,
      clearIndicator: handleDismissIndicator
    }),
    [handleDismissIndicator, openPicker]
  );

  const handleAnimationDone = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  const startFloatingPreview = useCallback(
    (files) => {
      releasePreviewUrl();
      setFloatingLabel(buildFloatingLabel(files, fileTypeLabel));
      const previewCandidate = files.find((file) => String(file.type || '').startsWith('image/'));

      if (previewCandidate) {
        const nextPreviewUrl = URL.createObjectURL(previewCandidate);
        previewUrlRef.current = nextPreviewUrl;
        setFloatingPreviewUrl(nextPreviewUrl);
      } else {
        setFloatingPreviewUrl('');
      }

      setIsAnimating(true);
    },
    [fileTypeLabel, releasePreviewUrl]
  );

  const processFiles = useCallback(
    async (rawFiles) => {
      const files = Array.from(rawFiles || []);

      if (!files.length || disabled) {
        return;
      }

      setIsUploading(true);

      try {
        await onFilesSelected?.(files);
        if (showFloatingPreview) {
          startFloatingPreview(files);
        } else {
          onAnimationComplete?.();
        }
      } finally {
        setIsUploading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    },
    [disabled, onAnimationComplete, onFilesSelected, showFloatingPreview, startFloatingPreview]
  );

  const statusText = maxFiles
    ? `${selectedCount}/${maxFiles}`
    : selectedCount
      ? `${selectedCount} selected`
      : 'Ready';

  return (
    <motion.div
      className={cn('uploadCardShell', className)}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
    >
      <div className={cn('uploadCardFrame', disabled && 'is-disabled')}>
        <div
          className={cn(
            'uploadCardDropzone interactive',
            isDragOver && 'is-drag-over',
            isUploading && 'is-uploading',
            disabled && 'is-disabled'
          )}
          onDragOver={(event) => {
            event.preventDefault();
            if (!disabled) {
              setIsDragOver(true);
            }
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            setIsDragOver(false);
          }}
          onDrop={async (event) => {
            event.preventDefault();
            setIsDragOver(false);
            await processFiles(event.dataTransfer?.files);
          }}
          onClick={openPicker}
        >
          <div className="uploadCardBackdrop" aria-hidden="true">
            <Upload size={42} />
          </div>

          <div className="uploadCardInner">
            <div className="uploadCardTopline">
              <span className="uploadCardStatusPill">{statusText}</span>
              {buttonLabel ? (
                <span className="uploadCardCTA">
                  <ImagePlus size={15} />
                  {buttonLabel}
                </span>
              ) : null}
            </div>

            <div className="uploadCardCopy">
              <strong>{title}</strong>
              <p>{description}</p>
            </div>

            {helperItems.length ? (
              <div className="uploadCardHelperRow">
                {helperItems.map((item) => (
                  <span key={item} className="uploadCardHelperPill">
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={async (event) => {
              await processFiles(event.target.files);
            }}
            className="uploadCardHiddenInput"
          />
        </div>

        {showFloatingPreview ? (
          <FloatingFileCard
            isVisible={isAnimating}
            label={floatingLabel}
            previewUrl={floatingPreviewUrl}
            onDismiss={handleDismissIndicator}
            onAnimationComplete={handleAnimationDone}
          />
        ) : null}
      </div>
    </motion.div>
  );
});

export default AudioUploadCard;
