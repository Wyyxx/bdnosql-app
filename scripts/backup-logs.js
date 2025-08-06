const { exec } = require("child_process");
const now = new Date();
const fecha = now.toISOString().split("T")[0];
const hora = now.getHours().toString().padStart(2, '0');

const command = `mongoexport --uri="mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB" --collection=alertas --query="{}" --out="C:\\Backups\\Logs_${fecha}_${hora}.json"`;

exec(command, (err, stdout, stderr) => {
  if (err) return console.error("❌ Error:", err.message);
  if (stderr) console.warn("⚠️ Advertencia:", stderr);
  else console.log(`✅ Backup de logs creado`);
});
