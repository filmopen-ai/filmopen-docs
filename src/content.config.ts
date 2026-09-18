import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { defineCollection } from 'astro:content';

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  // Starlight looks for its interface strings here; English is built in, and
  // declaring the collection is what stops it warning that it is missing.
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};
