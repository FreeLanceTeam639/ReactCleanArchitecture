import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils.js';

export function GlowingInput({
  value = '',
  placeholder = 'Write a reply...',
  onChange,
  onSubmit,
  disabled = false,
  isSubmitting = false,
  submitLabel = 'Send',
  className = ''
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(0);
  const canSubmit = value.trim().length > 0 && !disabled && !isSubmitting;

  useEffect(() => {
    return () => {
      window.clearTimeout(typingTimer.current);
    };
  }, []);

  const handleValueChange = (nextValue) => {
    onChange?.(nextValue);
    setIsTyping(true);
    window.clearTimeout(typingTimer.current);
    typingTimer.current = window.setTimeout(() => setIsTyping(false), 700);
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      return;
    }

    onSubmit?.(value.trim());
  };

  return (
    <div className={cn('workspaceGlowingComposer', className)}>
      <motion.div
        aria-hidden="true"
        className="workspaceGlowingComposerTrail left"
        animate={{ opacity: isFocused ? 0.9 : 0.48 }}
        transition={{ type: 'spring', stiffness: 86, damping: 22 }}
      />

      <motion.div
        aria-hidden="true"
        className="workspaceGlowingComposerTrail right"
        animate={{ opacity: isFocused ? 0.9 : 0.48 }}
        transition={{ type: 'spring', stiffness: 86, damping: 22, delay: 0.05 }}
      />

      <motion.div
        className="workspaceGlowingComposerShell"
        initial={{ boxShadow: '0 18px 56px -34px rgba(255, 122, 48, 0.54)' }}
        animate={{
          boxShadow: isFocused
            ? '0 24px 72px -28px rgba(255, 122, 48, 0.86)'
            : '0 18px 56px -34px rgba(255, 122, 48, 0.58)'
        }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <div aria-hidden="true" className="workspaceGlowingComposerHighlight" />
        <div aria-hidden="true" className="workspaceGlowingComposerCore left" />
        <div aria-hidden="true" className="workspaceGlowingComposerCore right" />

        <input
          type="text"
          value={value}
          onChange={(event) => handleValueChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && onSubmit) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          spellCheck={false}
          disabled={disabled}
          className="workspaceGlowingComposerInput"
        />

        <motion.button
          type={onSubmit ? 'button' : 'submit'}
          aria-label={submitLabel}
          onClick={onSubmit ? handleSubmit : undefined}
          disabled={!canSubmit}
          className="workspaceGlowingComposerButton"
          whileHover={{ scale: canSubmit ? 1.04 : 1 }}
          whileTap={{ scale: canSubmit ? 0.96 : 1 }}
          animate={{
            boxShadow: canSubmit
              ? '0 0 34px rgba(255, 144, 70, 0.42)'
              : '0 0 10px rgba(255, 144, 70, 0.16)'
          }}
          transition={{ type: 'spring', stiffness: 240, damping: 16 }}
        >
          <motion.span
            className="workspaceGlowingComposerButtonIcon"
            animate={isTyping && canSubmit ? { x: [0, 4, 8] } : { x: 0 }}
            transition={
              isTyping && canSubmit
                ? { duration: 0.8, repeat: Infinity, ease: 'easeIn' }
                : { duration: 0.2 }
            }
          >
            <ArrowRight size={22} />
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  );
}
