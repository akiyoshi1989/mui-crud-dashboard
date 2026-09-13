import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const workflow = readFileSync('.github/workflows/ci.yml', 'utf8');

describe('GitHub Actions CI', () => {
  it('Biome の lint とフォーマットを実行する', () => {
    expect(workflow).toContain('npm run lint');
  });

  it('UT を実行する', () => {
    expect(workflow).toContain('npm run test');
  });
});
