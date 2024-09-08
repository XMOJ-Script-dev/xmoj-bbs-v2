export default defineEventHandler((event) => {

  if (getRequestURL(event).pathname.startsWith('/auth')) {
    event.context.user = { name: 'Nitro' }
  }
})