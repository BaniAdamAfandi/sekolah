import rss from '@astrojs/rss';
import { getCollection, getEntry } from 'astro:content';

export async function GET(context) {
  const site = (await getEntry('pengaturan', 'site')).data;
  const berita = (await getCollection('berita', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime()
  );

  return rss({
    title: `${site.schoolName} — Berita`,
    description: `Berita dan kegiatan terbaru ${site.schoolName}`,
    site: context.site,
    items: berita.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.excerpt ?? '',
      categories: [post.data.category],
      link: `/berita/${post.id}/`,
    })),
    customData: `<language>id-ID</language>`,
  });
}
