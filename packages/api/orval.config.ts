import { defineConfig, type Options } from 'orval';

const teampageInput: Options['input'] = {
  target: 'https://apis.uoslife.team/v3/api-docs',
};

export default defineConfig({
  teampage: {
    input: teampageInput,
    output: {
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      target: './src/teampage',
      override: {
        enumGenerationType: 'union',
        query: {
          useSuspenseQuery: true,
          useInfinite: true,
          usePrefetch: true,
        },
        useDates: true,
        mutator: {
          path: './api-instance.ts',
          name: 'apiInstance',
        },
      },
      urlEncodeParameters: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write ./src/teampage/**/*.ts',
    },
  },
});
