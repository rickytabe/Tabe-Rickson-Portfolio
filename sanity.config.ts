import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/lib/sanity/schemas';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export default defineConfig({
  basePath: '/studio', // This is the route where the studio will be accessible
  projectId,
  dataset,
  title: 'Tabe Rickson Portfolio Studio',
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
  ],
});
