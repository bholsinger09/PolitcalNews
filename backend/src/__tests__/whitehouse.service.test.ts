import { describe, it, expect } from 'vitest';
import { WhiteHouseService } from '../services/whitehouse.js';

describe('WhiteHouseService', () => {
  const service = new WhiteHouseService();

  it('should fetch latest updates', async () => {
    const result = await service.getLatestUpdates();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    result.forEach(article => {
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('type');
    });
  });

  it('should filter by type', async () => {
    const result = await service.getByType('briefing');
    expect(Array.isArray(result)).toBe(true);
    result.forEach(article => {
      expect(article.type).toBe('briefing');
    });
  });
});
