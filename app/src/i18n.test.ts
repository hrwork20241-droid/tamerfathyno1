import { describe, expect, it } from 'vitest';
import { LANG_CODES, PRODUCT_NAMES, STRINGS, WORDS } from './data/locale';
import { AR_WORDS, P } from './data/products';

// Every language must be complete, so no screen ever falls back to English.
describe.each(LANG_CODES)('%s', lang => {
  it('has every UI string, none empty', () => {
    for (const key of Object.keys(STRINGS.en)) {
      expect(STRINGS[lang][key as keyof typeof STRINGS.en], key).toBeTruthy();
    }
  });

  it('names every product', () => {
    for (const p of P) expect(PRODUCT_NAMES[lang][p.id], `product ${p.id}`).toBeTruthy();
  });

  it.skipIf(lang === 'en')('translates every category, subcategory and colour', () => {
    for (const word of Object.keys(AR_WORDS)) expect(WORDS[lang][word], word).toBeTruthy();
  });
});
