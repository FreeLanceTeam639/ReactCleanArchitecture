import { ArrowDown, ArrowUp, ImagePlus, Link2, Star, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import AdminActionIconButton from './AdminActionIconButton.jsx';

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('File oxuna bilmədi.'));
    reader.readAsDataURL(file);
  });
}

function createMediaItem(url, index = 0) {
  return {
    id: `med_${Math.random().toString(36).slice(2, 10)}`,
    url,
    type: 'image',
    isPrimary: index === 0,
    sortOrder: index + 1
  };
}

function normalizeItems(items = []) {
  const safeItems = Array.isArray(items) ? items.filter((item) => item?.url) : [];

  if (!safeItems.length) {
    return [];
  }

  const primaryId = safeItems.find((item) => item.isPrimary)?.id || safeItems[0]?.id;

  return safeItems.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
    isPrimary: item.id === primaryId
  }));
}

export default function AdminMediaGalleryField({ label = 'Media gallery', items = [], onChange }) {
  const [draftUrl, setDraftUrl] = useState('');
  const inputRef = useRef(null);
  const mediaItems = normalizeItems(items);

  const commit = (nextItems) => {
    const normalized = normalizeItems(nextItems);
    onChange(normalized);
  };

  const handleAddUrl = () => {
    const trimmedValue = draftUrl.trim();

    if (!trimmedValue) {
      return;
    }

    commit([...mediaItems, createMediaItem(trimmedValue, mediaItems.length)]);
    setDraftUrl('');
  };

  const handleFileSelection = async (event) => {
    const files = Array.from(event.target.files || []);

    if (!files.length) {
      return;
    }

    const dataUrls = await Promise.all(files.map((file) => readFileAsDataUrl(file)));
    commit([...mediaItems, ...dataUrls.map((url, index) => createMediaItem(url, mediaItems.length + index))]);
    event.target.value = '';
  };

  const handleRemove = (mediaId) => commit(mediaItems.filter((item) => item.id !== mediaId));

  const handlePrimary = (mediaId) => {
    const selected = mediaItems.find((item) => item.id === mediaId);
    const rest = mediaItems.filter((item) => item.id !== mediaId);
    commit([{ ...selected, isPrimary: true }, ...rest.map((item) => ({ ...item, isPrimary: false }))]);
  };

  const handleMove = (mediaId, direction) => {
    const currentIndex = mediaItems.findIndex((item) => item.id === mediaId);
    const nextIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= mediaItems.length) {
      return;
    }

    const cloned = [...mediaItems];
    const [target] = cloned.splice(currentIndex, 1);
    cloned.splice(nextIndex, 0, target);
    commit(cloned);
  };

  return (
    <div className="adminMediaField fullSpan">
      <div className="adminMediaFieldHeader">
        <div>
          <span>{label}</span>
          <p className="adminFieldHint">Task və listing şəkilləri üçün upload-ready gallery sahəsi.</p>
        </div>
      </div>

      <div className="adminMediaComposer">
        <label className="adminInlineInput fullSpan">
          <Link2 size={16} />
          <input value={draftUrl} onChange={(event) => setDraftUrl(event.target.value)} placeholder="Paste image URL and click Add" />
        </label>
        <div className="adminImageFieldActions">
          <button type="button" className="adminSecondaryButton interactive" onClick={handleAddUrl}>Add URL</button>
          <button type="button" className="adminSecondaryButton interactive" onClick={() => inputRef.current?.click()}>
            <ImagePlus size={15} /> Upload images
          </button>
        </div>
        <input ref={inputRef} className="adminHiddenFileInput" type="file" accept="image/*" multiple onChange={handleFileSelection} />
      </div>

      {mediaItems.length ? (
        <div className="adminMediaGrid">
          {mediaItems.map((item, index) => (
            <div key={item.id} className="adminMediaCard">
              <img src={item.url} alt={`Media ${index + 1}`} />
              <div className="adminMediaMeta">
                <span>{index === 0 ? 'Primary image' : `Media ${index + 1}`}</span>
                <div className="adminRowActions">
                  <AdminActionIconButton icon={Star} label="Set primary" onClick={() => handlePrimary(item.id)} tone={index === 0 ? 'primary' : 'default'} />
                  <AdminActionIconButton icon={ArrowUp} label="Move up" onClick={() => handleMove(item.id, 'up')} disabled={index === 0} />
                  <AdminActionIconButton icon={ArrowDown} label="Move down" onClick={() => handleMove(item.id, 'down')} disabled={index === mediaItems.length - 1} />
                  <AdminActionIconButton icon={Trash2} label="Remove image" onClick={() => handleRemove(item.id)} tone="danger" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="adminEmptyState compact">
          <strong>No media attached</strong>
          <p>URL əlavə et və ya lokal fayldan preview yüklə.</p>
        </div>
      )}
    </div>
  );
}
