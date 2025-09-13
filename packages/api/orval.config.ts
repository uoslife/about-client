import { defineConfig, type Options } from 'orval';

const teampageInput: Options['input'] = {
  target: 'https://apis.uoslife.team/v3/api-docs',
};

export default defineConfig({
  teampage: {
    input: teampageInput,
    output: {
      baseUrl: 'https://apis.uoslife.team',
      client: 'react-query',
      httpClient: 'axios',
      mode: 'split',
      target: './src/teampage',
      override: {
        enumGenerationType: 'union',
        query: {
          useSuspenseQuery: true,
          usePrefetch: true,
        },
        useDates: true,
      },
      urlEncodeParameters: true,
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write ./src/teampage/**/*.ts',
    },
  },
});
