const { exec } = require("child_process");
const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

const colecciones = ["autos", "rentas", "clientes"];
const baseUri = 'mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB';

colecciones.forEach((col) => {
  const command = `mongoexport --uri="${baseUri}" --collection=${col} --out="C:\\Backups\\Diff_${col}_${hoy}.json"`;
  exec(command, (err, stdout, stderr) => {
    if (err) return console.error(`❌ Error en ${col}:`, err.message);
    if (stderr) console.warn(`⚠️ Advertencia en ${col}:`, stderr);
    else console.log(`✅ Backup de ${col} creado`);
  });
});
