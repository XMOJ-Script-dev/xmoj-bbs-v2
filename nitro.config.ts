//https://nitro.unjs.io/config
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const defineNitroConfig: any;
export default defineNitroConfig({
  errorHandler: "~/error",
  srcDir: "server",
  preset: "cloudflare-module",
  experimental: {
    database: true
  }
});
