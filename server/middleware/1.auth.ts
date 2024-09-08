import { readBody } from 'h3';

export default defineEventHandler(async (event) => {
  if (getRequestURL(event).pathname.startsWith('/GetNotice') || getRequestURL(event).pathname === '/') {  //Requests that don't need authentication
    return;
  }
  if (event._method !== "POST") {
    throw new Error("Actions that require authentication must use POST method");
  }
  const data = await readBody(event);
  ThrowErrorIfFailed(CheckParams(data, {
    "SessionID": "string",
    "Username": "string"
  }));
})