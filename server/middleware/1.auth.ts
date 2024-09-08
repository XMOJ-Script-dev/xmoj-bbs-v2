export default defineEventHandler((event) => {
  if (getRequestURL(event).pathname.startsWith('/GetNotice') || getRequestURL(event).pathname === '/') {  //Requests that don't need authentication
    return;
  }
})