import { Link2, Trash2 } from 'lucide-react';
import AudioUploadCard from '../../../components/ui/audio-upload-card.jsx';
import { resolveApiAssetUrl } from '../../api/mediaAssets.js';
import { fileToOptimizedDataUrl, getImageUploadLimitInMb } from '../../lib/media/imageUpload.js';

export default function AdminImageField({
  label,
  value,
  onChange,
  placeholder = 'Paste image URL or upload',
  hint = 'Add an image URL or upload a JPG, PNG or WEBP file.',
  shape = 'square',
  layout = 'split',
  showUrlInput = true
}) {
  const wrapperClassName = ['adminImageFieldPreview', shape === 'circle' ? 'circle' : '', shape === 'landscape' ? 'landscape' : '']
    .filter(Boolean)
    .join(' ');
  const fieldClassName = ['adminImageField', layout === 'stacked' ? 'stacked' : '']
    .filter(Boolean)
    .join(' ');
  const helperHint = /backend/i.test(hint || '') ? 'Add an image URL or upload a local preview file.' : hint;
  const previewUrl = resolveApiAssetUrl(value);
  const displayValue = typeof value === 'string' && value.startsWith('data:') ? '' : value;
  const resolvedPlaceholder = typeof value === 'string' && value.startsWith('data:')
    ? 'Local image selected. Upload a new file or paste a hosted URL.'
    : placeholder;

  const handleFileSelection = async (files) => {
    const [file] = Array.from(files || []);

    if (!file) {
      return;
    }

    try {
      const dataUrl = await fileToOptimizedDataUrl(file);
      onChange(dataUrl);
    } catch {
      // Ignore preview read errors.
    }
  };

  return (
    <div className={fieldClassName}>
      <div className={wrapperClassName}>
        {previewUrl ? <img src={previewUrl} alt={label || 'Preview'} /> : <span>{shape === 'circle' ? 'AV' : 'IMG'}</span>}
      </div>

      <div className="adminImageFieldControls">
        {showUrlInput ? (
          <label className="adminField adminFieldStack fullSpan">
            <span>{label}</span>
            <div className="adminInlineInput">
              <Link2 size={16} />
              <input value={displayValue} onChange={(event) => onChange(event.target.value)} placeholder={resolvedPlaceholder} />
            </div>
          </label>
        ) : (
          <div className="adminFieldStack fullSpan">
            <span>{label}</span>
            <p className="adminFieldHint">{helperHint}</p>
          </div>
        )}

        <AudioUploadCard
          className="adminUploadCard fullSpan"
          title={value ? 'Yuklenmis sekli yenile' : 'Preview sekli yukle'}
          description={helperHint}
          accept="image/png,image/jpeg,image/webp"
          fileTypeLabel="image"
          buttonLabel={value ? 'Fayli deyis' : 'Fayl sec'}
          helperItems={['JPG, PNG, WEBP', `Max ${getImageUploadLimitInMb()} MB`]}
          onFilesSelected={handleFileSelection}
          showFloatingPreview={false}
        />

        <div className="adminImageFieldActions fullSpan">
          <button type="button" className="adminSecondaryButton interactive danger" onClick={() => onChange('')}>
            <Trash2 size={15} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
}
