import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getLocaleFromLanguage, getStoredLanguage, sanitizeLanguage, setStoredLanguage } from './locale.js';
import { translateText } from './translations.js';

const I18nContext = createContext(null);
const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];

function shouldSkipNode(node) {
  const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;

  if (!element) {
    return false;
  }

  if (element.closest('[data-i18n-skip="true"]')) {
    return true;
  }

  const tagName = element.tagName?.toLowerCase();
  return ['script', 'style', 'code', 'pre'].includes(tagName);
}

function createTreeWalker(root) {
  return document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue?.trim() || shouldSkipNode(node)) {
        return NodeFilter.FILTER_REJECT;
      }

      return NodeFilter.FILTER_ACCEPT;
    }
  });
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getStoredLanguage);
  const originalTextMapRef = useRef(new WeakMap());
  const previousLanguageRef = useRef(language);

  useEffect(() => {
    const nextLanguage = sanitizeLanguage(language);
    const locale = getLocaleFromLanguage(nextLanguage);

    setStoredLanguage(nextLanguage);
    document.documentElement.lang = locale;
  }, [language]);

  useEffect(() => {
    const previousLanguage = previousLanguageRef.current;

    function processTextNode(node) {
      if (!node || shouldSkipNode(node)) {
        return;
      }

      const originalTextMap = originalTextMapRef.current;
      const existingOriginal = originalTextMap.get(node);
      const currentValue = node.nodeValue || '';

      if (!existingOriginal) {
        originalTextMap.set(node, currentValue);
      } else {
        const previousRenderedValue = translateText(previousLanguage, existingOriginal);
        if (currentValue !== previousRenderedValue && currentValue !== existingOriginal) {
          originalTextMap.set(node, currentValue);
        }
      }

      const sourceValue = originalTextMap.get(node) || currentValue;
      const translatedValue = translateText(language, sourceValue);

      if (node.nodeValue !== translatedValue) {
        node.nodeValue = translatedValue;
      }
    }

    function processAttributes(element) {
      if (!element || shouldSkipNode(element)) {
        return;
      }

      TRANSLATABLE_ATTRIBUTES.forEach((attribute) => {
        const currentValue = element.getAttribute(attribute);

        if (!currentValue || !currentValue.trim()) {
          return;
        }

        const datasetKey = `i18nOriginal${attribute
          .replace(/-([a-z])/g, (_, char) => char.toUpperCase())
          .replace(/^./, (char) => char.toUpperCase())}`;
        const existingOriginal = element.dataset[datasetKey];
        const previousRenderedValue = existingOriginal ? translateText(previousLanguage, existingOriginal) : null;

        if (!existingOriginal || (currentValue !== previousRenderedValue && currentValue !== existingOriginal)) {
          element.dataset[datasetKey] = currentValue;
        }

        const sourceValue = element.dataset[datasetKey] || currentValue;
        const translatedValue = translateText(language, sourceValue);

        if (currentValue !== translatedValue) {
          element.setAttribute(attribute, translatedValue);
        }
      });
    }

    function processSubtree(rootNode) {
      if (!rootNode) {
        return;
      }

      if (rootNode.nodeType === Node.TEXT_NODE) {
        processTextNode(rootNode);
        return;
      }

      if (rootNode.nodeType !== Node.ELEMENT_NODE) {
        return;
      }

      processAttributes(rootNode);

      const walker = createTreeWalker(rootNode);
      let currentNode = walker.nextNode();

      while (currentNode) {
        processTextNode(currentNode);
        currentNode = walker.nextNode();
      }

      rootNode.querySelectorAll('*').forEach((element) => {
        processAttributes(element);
      });
    }

    processSubtree(document.body);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => processSubtree(node));
          return;
        }

        if (mutation.type === 'characterData') {
          processTextNode(mutation.target);
          return;
        }

        if (mutation.type === 'attributes') {
          processAttributes(mutation.target);
        }
      });
    });

    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRIBUTES
    });

    previousLanguageRef.current = language;

    return () => {
      observer.disconnect();
    };
  }, [language]);

  const contextValue = useMemo(
    () => ({
      language,
      locale: getLocaleFromLanguage(language),
      setLanguage,
      t: (value) => translateText(language, value)
    }),
    [language]
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error('useI18n must be used within I18nProvider.');
  }

  return context;
}
