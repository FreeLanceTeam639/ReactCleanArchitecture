import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import AudioUploadCard from '../../../components/ui/audio-upload-card.jsx';
import { resolveApiAssetUrl } from '../../../shared/api/mediaAssets.js';
import { fileToOptimizedDataUrl, getImageUploadLimitInMb } from '../../../shared/lib/media/imageUpload.js';

const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

function normalizeImages(images = [], maxItems = 6) {
  return Array.isArray(images)
    ? images.filter((item) => typeof item === 'string' && item.trim()).slice(0, maxItems)
    : [];
}

export default function WorkspaceTaskMediaField({
  label = 'Task visuals',
  value = [],
  onChange,
  maxItems = 6
}) {
  const uploaderRef = useRef(null);
  const [localError, setLocalError] = useState('');
  const images = normalizeImages(value, maxItems);
  const remaining = Math.max(0, maxItems - images.length);
  const coverImage = resolveApiAssetUrl(images[0] || '');

  const processFiles = async (rawFiles) => {
    const files = Array.from(rawFiles || []);

    if (!files.length) {
      return;
    }

    if (!remaining) {
      setLocalError(`Maksimum ${maxItems} sekil elave ede bilersiniz.`);
      return;
    }

    const acceptedFiles = files.filter((file) => supportedTypes.has(String(file.type || '').toLowerCase()));

    if (!acceptedFiles.length) {
      setLocalError('Yalniz JPG, PNG ve WEBP sekilleri yukleye bilersiniz.');
      return;
    }

    try {
      const nextImages = await Promise.all(
        acceptedFiles.slice(0, remaining).map((file) => fileToOptimizedDataUrl(file))
      );
      onChange([...images, ...nextImages]);
      setLocalError(
        acceptedFiles.length < files.length
          ? 'Bezi fayllar uygun formatda olmadi ve elave edilmedi.'
          : ''
      );
    } catch (error) {
      setLocalError(error?.message || 'Secdiyiniz sekil oxuna bilmedi. Zehmet olmasa yeniden secin.');
    }
  };

  const handleRemove = (indexToRemove) => {
    onChange(images.filter((_, index) => index !== indexToRemove));
  };

  const handleMakePrimary = (indexToMove) => {
    if (indexToMove <= 0) {
      return;
    }

    const nextImages = [...images];
    const [selectedImage] = nextImages.splice(indexToMove, 1);
    onChange([selectedImage, ...nextImages]);
  };

  const handleRemoveClick = (event, indexToRemove) => {
    event.preventDefault();
    event.stopPropagation();
    handleRemove(indexToRemove);
  };

  const handleMakePrimaryClick = (event, indexToMove) => {
    event.preventDefault();
    event.stopPropagation();
    handleMakePrimary(indexToMove);
  };

  return (
    <div className="taskMediaField fullWidth">
      <div className="taskMediaFieldHeader">
        <div>
          <span>{label}</span>
          <p>Turbo.az tipli elan axini kimi task ucun bir nece sekil yukle, cover sec ve sonra paylas.</p>
        </div>
        <strong>{images.length}/{maxItems}</strong>
      </div>

      <AudioUploadCard
        ref={uploaderRef}
        className="taskUploadCard"
        title={images.length ? 'Sekil elave et veya surushdur' : 'Task sekillerini yukle'}
        description="Drag & drop et veya sec. Ilk sekil card cover-i olacaq, detail sehifesinde ise gallery kimi gorunecek."
        accept="image/png,image/jpeg,image/webp"
        multiple
        selectedCount={images.length}
        maxFiles={maxItems}
        fileTypeLabel="image"
        buttonLabel={remaining ? 'Sekilleri sec' : 'Limit dolub'}
        disabled={!remaining}
        helperItems={[
          `Maksimum ${maxItems} sekil`,
          'JPG, PNG, WEBP',
          `Max ${getImageUploadLimitInMb()} MB`,
          'Cover sekli deyise bilersiniz'
        ]}
        onFilesSelected={processFiles}
      />

      {localError ? <p className="taskMediaError">{localError}</p> : null}

      {images.length ? (
        <div className="taskMediaShowcase">
          <article className="taskMediaPrimaryStage">
            <div className="taskMediaPrimaryImageWrap">
              {coverImage ? <img src={coverImage} alt="Task cover" className="taskMediaPrimaryImage" /> : null}
              <span className="taskMediaPrimaryBadge">Elan cover sekli</span>
            </div>

            <div className="taskMediaPrimaryInfo">
              <div>
                <strong>Esas goruntu</strong>
                <p>Bu sekil ana sehifedeki task card-inda ve task detail sehifesinin ilk goruntusunde cixacaq.</p>
              </div>

              <div className="taskMediaPrimaryActions">
                <button
                  type="button"
                  className="taskMediaTextButton interactive danger"
                  onClick={(event) => handleRemoveClick(event, 0)}
                >
                  <Trash2 size={15} /> Cover-i sil
                </button>
                <button type="button" className="taskMediaTextButton interactive" onClick={() => uploaderRef.current?.open()}>
                  <ImagePlus size={15} /> Daha cox sekil elave et
                </button>
              </div>
            </div>
          </article>

          <div className="taskMediaSecondaryGrid">
            {images.slice(1).map((image, index) => {
              const actualIndex = index + 1;
              const resolvedImage = resolveApiAssetUrl(image);

              return (
                <article key={`${image}-${actualIndex}`} className="taskMediaSecondaryCard">
                  <div className="taskMediaSecondaryImageWrap">
                    <img src={resolvedImage} alt={`Task visual ${actualIndex + 1}`} className="taskMediaSecondaryImage" />
                  </div>
                  <div className="taskMediaSecondaryOverlay">
                    <span className="taskMediaSequenceBadge">#{actualIndex + 1}</span>
                    <div className="taskMediaCardActions">
                      <button
                        type="button"
                        className="taskMediaIconButton interactive"
                        onClick={(event) => handleMakePrimaryClick(event, actualIndex)}
                        aria-label="Make cover image"
                        title="Cover et"
                      >
                        <Star size={15} />
                      </button>
                      <button
                        type="button"
                        className="taskMediaIconButton interactive danger"
                        onClick={(event) => handleRemoveClick(event, actualIndex)}
                        aria-label="Remove image"
                        title="Sil"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="taskMediaSecondaryBody">
                    <div className="taskMediaSecondaryMeta">
                      <strong>Elave goruntu #{actualIndex + 1}</strong>
                      <span>Task detail gallery-de gorunecek</span>
                    </div>

                    <div className="taskMediaSecondaryActions">
                      <button
                        type="button"
                        className="taskMediaMiniButton interactive"
                        onClick={(event) => handleMakePrimaryClick(event, actualIndex)}
                      >
                        <Star size={14} /> Cover et
                      </button>
                      <button
                        type="button"
                        className="taskMediaMiniButton interactive danger"
                        onClick={(event) => handleRemoveClick(event, actualIndex)}
                      >
                        <Trash2 size={14} /> Sil
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {images.length < maxItems ? (
              <button type="button" className="taskMediaAddMoreCard interactive" onClick={() => uploaderRef.current?.open()}>
                <ImagePlus size={18} />
                <strong>Yeni sekil elave et</strong>
                <span>{remaining} yer qalib</span>
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="taskMediaEmptyState">
          <strong>Hec bir sekil secilmeyib</strong>
          <p>Yuklediyiniz sekiller burada elan cover-i ve diger gallery kartlari kimi gorunecek.</p>
        </div>
      )}
    </div>
  );
}
