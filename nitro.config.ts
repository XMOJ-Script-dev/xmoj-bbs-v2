//https://nitro.unjs.io/config
export default defineNitroConfig({
  errorHandler: "~/error",
  srcDir: "server",
  preset: "cloudflare-module",
  experimental: {
    database: true
  }
});
