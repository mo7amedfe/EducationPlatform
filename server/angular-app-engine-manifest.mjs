
export default {
  basePath: 'https://mo7amedfe.github.io/EducationPlatform',
  supportedLocales: {
  "en-US": ""
},
  entryPoints: {
    '': () => import('./main.server.mjs')
  },
};
