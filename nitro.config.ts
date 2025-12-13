//https://nitro.unjs.io/config
declare const defineNitroConfig: any;
export default defineNitroConfig({
  compatibilityDate: '2025-12-13',
  errorHandler: "~/error",
  srcDir: "server",
  preset: "cloudflare-module",
  experimental: {
    database: true
  }
});
