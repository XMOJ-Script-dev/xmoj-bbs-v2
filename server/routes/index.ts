export default eventHandler((event) => {
  ThrowErrorIfFailed(new Result(false, "This is a test error"));
  return "Start by editing <code>server/routes/index.ts</code>.";
});
