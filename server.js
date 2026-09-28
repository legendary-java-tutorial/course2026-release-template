// Стартовое приложение модуля 6: страница с текстом версии и счётчик посещений в томе /data.
// Маршрут /crash завершает процесс кодом 1 — для опытов с политикой перезапуска (уровень 47).
const http = require("http");
const fs = require("fs");

const PORT = 3000;
const file = "/data/counter.txt";
const greeting = "Привет из Release Day!";

function readCount() {
  if (!fs.existsSync(file)) {
    return 0;
  }
  return Number(fs.readFileSync(file, "utf8")) || 0;
}

// Без права записи в том приложению работать незачем: выходим кодом 1, политика перезапуска поднимет его снова
try {
  fs.writeFileSync(file, String(readCount()));
} catch (err) {
  console.log("Не могу записать счётчик: " + err.code + " " + file);
  process.exit(1);
}

http.createServer((req, res) => {
  if (req.url === "/crash") {
    console.log("Маршрут /crash: процесс завершается с кодом 1");
    res.end("Сбой по запросу\n");
    setTimeout(() => process.exit(1), 50);
    return;
  }
  const count = readCount() + 1;
  fs.writeFileSync(file, String(count));
  res.end(greeting + " Посещений: " + count + "\n");
}).listen(PORT, () => {
  console.log("Приложение слушает порт " + PORT);
});
