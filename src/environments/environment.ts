// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  baseUrl: 'https://localhost:7055/api/' ,     // 'http://localhost:8078/api/' //
 // baseUrl: 'https://192.168.0.221:7057/api/',
 // baseUrl: 'https://192.168.0.221:7057/api/'

  // Demo mode (public iframe preview, ?demo=1): backend endpoint that mints a SHORT-LIVED,
  // read-only demo JWT for the DEDICATED demo account. No password ships in the JS bundle —
  // the server owns the demo user. Set to '' to fully disable demo auto-login.
  demoLoginEndpoint: 'TblUsers/DemoLogin'
};