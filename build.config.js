import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    './main',
    // mkdist builder transpiles file-to-file keeping original sources structure
    {
      builder: 'mkdist',
      input: './tasks',
      outDir: './dist/tasks',
    },
    // {
    //   builder: 'mkdist',
    //   input: './tasks/temp',
    //   outDir: './dist/tasks/temp'
    // },
  ],
  clean: true,
  rollup: {
    emitCJS: true,
  },
  declaration: false,
});
