import type { WhiteHouseArticle } from '../types/news.js';

export class WhiteHouseService {
  async getLatestUpdates(): Promise<WhiteHouseArticle[]> {
    // Mock White House data (in production, scrape from whitehouse.gov or use an API)
    return [
      {
        id: `wh-${Date.now()}-1`,
        title: 'Presidential Address on Economic Policy',
        description: 'The President outlined new initiatives to strengthen the economy and support working families.',
        url: 'https://www.whitehouse.gov/briefing-room/',
        publishedAt: new Date().toISOString(),
        type: 'statement',
      },
      {
        id: `wh-${Date.now()}-2`,
        title: 'Press Briefing on National Security',
        description: 'White House Press Secretary provides updates on recent national security developments.',
        url: 'https://www.whitehouse.gov/briefing-room/',
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        type: 'briefing',
      },
      {
        id: `wh-${Date.now()}-3`,
        title: 'New Executive Order on Climate Change',
        description: 'Administration announces comprehensive plan to address environmental challenges.',
        url: 'https://www.whitehouse.gov/briefing-room/',
        publishedAt: new Date(Date.now() - 172800000).toISOString(),
        type: 'press-release',
      },
    ];
  }

  async getByType(type: 'briefing' | 'statement' | 'press-release'): Promise<WhiteHouseArticle[]> {
    const all = await this.getLatestUpdates();
    return all.filter(article => article.type === type);
  }
}

export const whitehouseService = new WhiteHouseService();
