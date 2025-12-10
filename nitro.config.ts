//https://nitro.unjs.io/config
declare const defineNitroConfig: any;
export default defineNitroConfig({
  errorHandler: "~/error",
  srcDir: "server",
  preset: "cloudflare-module",
  experimental: {
    database: true
  }
});
