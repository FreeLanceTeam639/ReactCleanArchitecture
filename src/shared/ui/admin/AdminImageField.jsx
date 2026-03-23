import { ImagePlus, Link2, Trash2 } from 'lucide-react';
import { useRef } from 'react';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('File oxuna bilmədi.'));
    reader.readAsDataURL(file);
  });
}

export default function AdminImageField({
  label,
  value,
  onChange,
  placeholder = 'Paste image URL or upload',
  hint = 'Future backend upload endpoint üçün hazır media sahəsi.',
  shape = 'square'
}) {
  const inputRef = useRef(null);
  const wrapperClassName = shape === 'circle' ? 'adminImageFieldPreview circle' : 'adminImageFieldPreview';
  const helperHint = /backend/i.test(hint || '') ? 'Add an image URL or upload a local preview file.' : hint;

  const handleFileSelection = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      onChange(dataUrl);
    } catch {
      // ignore preview errors in demo mode
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="adminImageField">
      <div className={wrapperClassName}>
        {value ? <img src={value} alt={label || 'Preview'} /> : <span>{shape === 'circle' ? 'AV' : 'IMG'}</span>}
      </div>

      <div className="adminImageFieldControls">
        <label className="adminField fullSpan">
          <span>{label}</span>
          <div className="adminInlineInput">
            <Link2 size={16} />
            <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
          </div>
        </label>

        <div className="adminImageFieldActions fullSpan">
          <button type="button" className="adminSecondaryButton interactive" onClick={() => inputRef.current?.click()}>
            <ImagePlus size={15} /> Upload preview
          </button>
          <button type="button" className="adminSecondaryButton interactive danger" onClick={() => onChange('')}>
            <Trash2 size={15} /> Remove
          </button>
        </div>

        <input ref={inputRef} className="adminHiddenFileInput" type="file" accept="image/*" onChange={handleFileSelection} />
        {helperHint ? <p className="adminFieldHint fullSpan">{helperHint}</p> : null}
      </div>
    </div>
  );
}
