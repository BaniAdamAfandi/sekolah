import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Parser untuk file JSON singleton (satu objek) → array berisi satu entri.
const singleton = (text: string) => [JSON.parse(text)];

// ── Berita / Artikel ──────────────────────────────────────────
const berita = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/berita' }),
  schema: z.object({
    title: z.string(),
    publishDate: z.coerce.date(),
    category: z.string().default('Umum'),
    thumbnail: z.string().optional(),
    excerpt: z.string().optional(),
    author: z.string().default('Admin Sekolah'),
    draft: z.boolean().default(false),
  }),
});

// ── Guru & Tenaga Kependidikan ────────────────────────────────
const guru = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guru' }),
  schema: z.object({
    name: z.string(),
    nip: z.string().optional(),
    role: z.string(),
    photo: z.string().optional(),
    order: z.number().default(99),
  }),
});

// ── Agenda / Event ────────────────────────────────────────────
const agenda = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/agenda' }),
  schema: z.object({
    title: z.string(),
    eventDate: z.coerce.date(),
    location: z.string().optional(),
    description: z.string().optional(),
  }),
});

// ── Galeri (album foto) ───────────────────────────────────────
const galeri = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/galeri' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date().optional(),
    cover: z.string().optional(),
    category: z.string().default('Kegiatan'),
    images: z
      .array(
        z.object({
          image: z.string(),
          caption: z.string().optional(),
        })
      )
      .default([]),
  }),
});

// â”€â”€ Modul Pembelajaran â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const modul = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/modul' }),
  schema: z.object({
    title: z.string(),
    type: z.string().default('Modul'),
    link: z.string().url(),
    description: z.string().optional(),
    order: z.number().default(99),
  }),
});

// ── Pengaturan Situs (singleton, JSON) ────────────────────────
const pengaturan = defineCollection({
  loader: file('./src/content/settings/site.json', { parser: singleton }),
  schema: z.object({
    id: z.string(),
    schoolName: z.string(),
    tagline: z.string(),
    logo: z.string().optional(),
    npsn: z.string().optional(),
    accreditation: z.string().optional(),
    address: z.string(),
    email: z.string().optional(),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    mapsEmbed: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    studentCount: z.string().optional(),
    teacherCount: z.string().optional(),
    heroImage: z.string().optional(),
    heroImages: z.array(z.object({ image: z.string() })).optional(),
    heroInterval: z.number().optional(),
    heroHeadline: z.string().optional(),
    heroSubheadline: z.string().optional(),
  }),
});

// ── Profil Sekolah (singleton, JSON) ──────────────────────────
const profil = defineCollection({
  loader: file('./src/content/settings/profil.json', { parser: singleton }),
  schema: z.object({
    id: z.string(),
    principalName: z.string().optional(),
    principalPhoto: z.string().optional(),
    principalGreeting: z.string().optional(),
    vision: z.string().optional(),
    missions: z.array(z.object({ point: z.string() })).default([]),
    history: z.string().optional(),
  }),
});

// ── PPDB (singleton, JSON) ────────────────────────────────────
const ppdb = defineCollection({
  loader: file('./src/content/settings/ppdb.json', { parser: singleton }),
  schema: z.object({
    id: z.string(),
    isOpen: z.boolean().default(false),
    year: z.string().optional(),
    intro: z.string().optional(),
    requirements: z.array(z.object({ point: z.string() })).default([]),
    steps: z.array(z.object({ step: z.string() })).default([]),
    externalLink: z.string().optional(),
  }),
});

export const collections = { berita, guru, agenda, galeri, modul, pengaturan, profil, ppdb };
