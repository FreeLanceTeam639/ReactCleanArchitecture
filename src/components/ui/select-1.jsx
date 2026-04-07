import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, X } from 'lucide-react';

function joinClassNames(...values) {
  return values.filter(Boolean).join(' ');
}

function normalizeOption(option) {
  if (typeof option === 'string') {
    return { value: option, label: option, group: '' };
  }

  return {
    value: option?.value ?? '',
    label: option?.label ?? String(option?.value ?? ''),
    group: option?.group ?? ''
  };
}

export default function SelectOne({
  label = '',
  value = '',
  onChange,
  options = [],
  placeholder = 'Select an option',
  clearLabel = 'Clear',
  className = '',
  triggerClassName = '',
  menuClassName = '',
  disabled = false,
  showClear = false
}) {
  const fieldRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0, width: 0 });

  const normalizedOptions = useMemo(
    () => options.map(normalizeOption),
    [options]
  );

  const selectedOption = useMemo(
    () => normalizedOptions.find((option) => String(option.value) === String(value)),
    [normalizedOptions, value]
  );

  const groupedOptions = useMemo(() => {
    const map = new Map();

    normalizedOptions.forEach((option) => {
      const key = option.group || '';
      if (!map.has(key)) {
        map.set(key, []);
      }

      map.get(key).push(option);
    });

    return Array.from(map.entries());
  }, [normalizedOptions]);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) {
      return;
    }

    const rect = triggerRef.current.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + 10,
      left: rect.left,
      width: rect.width
    });
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    updatePosition();

    const handlePointerDown = (event) => {
      if (
        fieldRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsOpen(false);
    };

    const handleWindowChange = () => updatePosition();
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, updatePosition]);

  const handleToggle = () => {
    if (disabled) {
      return;
    }

    setIsOpen((current) => !current);
  };

  const handleSelect = (nextValue) => {
    onChange?.(nextValue);
    setIsOpen(false);
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onChange?.('');
    setIsOpen(false);
  };

  const menu = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <div
          ref={menuRef}
          className={joinClassNames('selectOneMenu', menuClassName)}
          style={{
            position: 'fixed',
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
            width: `${menuPosition.width}px`
          }}
        >
          {groupedOptions.map(([groupName, items]) => (
            <div key={groupName || 'default'} className="selectOneGroup">
              {groupName ? <div className="selectOneGroupLabel">{groupName}</div> : null}
              {items.map((option) => {
                const isSelected = String(option.value) === String(value);

                return (
                  <button
                    key={`${groupName}-${option.value}`}
                    type="button"
                    className={joinClassNames('selectOneOption', isSelected ? 'isSelected' : '')}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span>{option.label}</span>
                    <span className="selectOneOptionCheck" aria-hidden="true">
                      {isSelected ? <Check size={15} /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>,
        document.body
      )
    : null;

  return (
    <div ref={fieldRef} className={joinClassNames('selectOneField', className)}>
      {label ? <span className="selectOneLabel">{label}</span> : null}

      <button
        ref={triggerRef}
        type="button"
        className={joinClassNames('selectOneTrigger', triggerClassName, isOpen ? 'isOpen' : '', disabled ? 'isDisabled' : '')}
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={joinClassNames('selectOneValue', selectedOption ? 'hasValue' : 'isPlaceholder')}>
          {selectedOption?.label || placeholder}
        </span>

        <span className="selectOneActions">
          {showClear && selectedOption ? (
            <span className="selectOneInlineClear" onClick={handleClear} role="button" tabIndex={-1} aria-label={clearLabel}>
              <X size={14} />
            </span>
          ) : null}
          <span className="selectOneIcon" aria-hidden="true">
            <ChevronDown size={16} />
          </span>
        </span>
      </button>

      {menu}
    </div>
  );
}
