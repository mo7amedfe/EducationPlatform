
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: 'https://mo7amedfe.github.io/EducationPlatform/',
  locale: undefined,
  routes: [
  {
    "renderMode": 0,
    "route": "/EducationPlatform"
  },
  {
    "renderMode": 0,
    "route": "/EducationPlatform/login"
  },
  {
    "renderMode": 0,
    "route": "/EducationPlatform/register"
  },
  {
    "renderMode": 0,
    "route": "/EducationPlatform/profile"
  },
  {
    "renderMode": 0,
    "route": "/EducationPlatform/PlacementTest"
  },
  {
    "renderMode": 0,
    "route": "/EducationPlatform/courses/*"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 6089, hash: 'ac17e0ff7b8256a092111b2f62f8643f1452f93dad2099aef479c7c0b4817d99', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1105, hash: '38873af4ff491a030130ad3fbbe2ff59ce185b18de78385b0c236d803de394ef', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'styles-H5ZGY3WX.css': {size: 304468, hash: 'I3jTH0GM7zY', text: () => import('./assets-chunks/styles-H5ZGY3WX_css.mjs').then(m => m.default)}
  },
};
