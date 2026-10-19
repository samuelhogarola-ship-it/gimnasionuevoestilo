import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('Arroyo is closed on Sundays in Spanish and English pages', async () => {
  const [spanish, english] = await Promise.all([
    readFile(new URL('../arroyo/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../en/arroyo/index.html', import.meta.url), 'utf8'),
  ]);

  assert.match(spanish, /Domingos[^<]*(?:cerrado|cerrados)/i);
  assert.match(english, /(?:Sundays[^<]*closed|closed[^<]*Sundays)/i);
  assert.doesNotMatch(spanish, /Sábados y domingos de 9:00 a 14:00/i);
  assert.doesNotMatch(english, /Saturdays and Sundays from 9:00 to 14:00/i);
});
