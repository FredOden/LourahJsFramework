var exec = command => java.lang.Runtime.getRuntime().exec(command);
var process = exec([
  "ls", "-l", "/storage/emulated/0/Download"
  ]);
var s = Activity.inputStream2String(
  process.getInputStream()
  );
console.log("s::" + s);