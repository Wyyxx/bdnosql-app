@echo off
set FECHA=%date:~6,4%%date:~3,2%%date:~0,2%
mongodump --uri="mongodb+srv://Admon:aGfVRAQ9dwEwNpSi@escuela.rr7gjjr.mongodb.net/ConAutos_DB" --out="C:\Backups\Full_%FECHA%"
