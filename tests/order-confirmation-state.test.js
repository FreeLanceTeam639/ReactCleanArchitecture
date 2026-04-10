import assert from 'node:assert/strict';
import test from 'node:test';

import {
  consumePendingOrderConfirmation,
  setPendingOrderConfirmation
} from '../src/shared/lib/storage/orderConfirmationState.js';
import { decodeMojibake } from '../src/shared/lib/text/decodeMojibake.js';
import { translateText } from '../src/shared/i18n/translations.js';

function createStorage() {
  const values = new Map();

  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, String(value));
    },
    removeItem(key) {
      values.delete(key);
    }
  };
}

test('order confirmation state is stored and consumed once', () => {
  global.window = {
    sessionStorage: createStorage()
  };

  setPendingOrderConfirmation({
    orderId: 'ORD-20260409-TEST1234',
    totalAmount: '$250'
  });

  const firstRead = consumePendingOrderConfirmation();
  const secondRead = consumePendingOrderConfirmation();

  assert.equal(firstRead.orderId, 'ORD-20260409-TEST1234');
  assert.equal(firstRead.totalAmount, '$250');
  assert.equal(secondRead, null);

  delete global.window;
});

test('azerbaijani translation returns decoded professional copy', () => {
  const translated = translateText('az', 'Build faster with specialists already matched to your goals.');

  assert.match(translated, /məqsədlərinizə uyğun/i);
  assert.doesNotMatch(translated, /Ã|Å|Ä|Ð|Ñ|â|É/);
});

test('decodeMojibake fixes garbled translation fragments', () => {
  assert.equal(decodeMojibake('AzÉ™rbaycan dili'), 'Azərbaycan dili');
  assert.equal(decodeMojibake('Ð ÑƒÑÑÐºÐ¸Ð¹'), 'Русский');
});
