export const environment = {
  production: true,
//  baseUrl: 'https://maintenance-api.s-cloud-me.com/api/'    // https://maintenance-api.icore.cf/api/
     // baseUrl:'https://localhost:7055/api/'
  // baseUrl: 'https://192.168.0.221:7057/api/'   // LAN-only; NOT reachable from the public marketing site
   // Public API host for the embedded demo on https://testmaintenance.skyline-inov.com
   baseUrl: 'https://maintenance-api.skyline-inov.com/api/',

  // Demo mode (public iframe preview, ?demo=1): backend endpoint that mints a SHORT-LIVED,
  // read-only demo JWT for the DEDICATED demo account. No password ships in the JS bundle.
  // Set to '' to fully disable demo auto-login.
  demoLoginEndpoint: 'TblUsers/DemoLogin'
};