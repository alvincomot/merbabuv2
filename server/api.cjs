const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const mysql = require("mysql");
const response = require("./response.cjs");

app.use(bodyParser.json());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_merbabu",
});

app.get("/", (req, res) => {
  response(200, "APIIIIIIIIIIIIIIIIIIIII V1 Merbabu V2 ready to go", "SUCCESS", res);
});

app.get("/mahasiswa", (req, res) => {
  const sql = "SELECT * FROM mahasiswa"
  db.query(sql, (err, fields) => {
    if (err) throw err
    response(200, fields, "mahasiwa get list", res)
  })
})

app.post("/mahasiswa", (req, res) => {
  if(req.file === null) return response.status(400).json({msg: "No file uploaded"})
  const { nim, nama, kelas, alamat } = req.body
  const sql = `INSERT INTO mahasiswa (nim, nama, kelas, alamat) VALUES (${nim}, '${nama}', '${kelas}', '${alamat}')`
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res)
    if (fields?.affectedRows) {
      const data = {
        isSuccess: fields.affectedRows,
        id: fields.insertId,
      }
      response(200, data, "Data Added Successfully", res)
    }
  })
})

app.put("/mahasiswa", (req, res) => {
  const { nim, nama, kelas, alamat } = req.body
  const sql = `UPDATE mahasiswa SET nama = '${nama}', kelas = '${kelas}', alamat = '${alamat}' WHERE nim = ${nim}`
  db.query(sql, (err, fields) => { 
    if(err) response(500, "invalid", "error", res)
    if (fields?.affectedRows) { 
      const data = {
        isSuccess: fields.affectedRows,
        message: fields.message,
      }
      response(200, data, "successfully update data", res)
    } else {
      response(404, "user not found", "error", res)
    }
  })
  
})

app.delete("/mahasiswa", (req, res) => {
  const { nim } = req.body
  const sql = `DELETE FROM mahasiswa WHERE nim = ${nim}`
  db.query(sql, (err, fields) => {
    if (err) response(500, "invalid", "error", res)

    if (fields?.affectedRows) {
      const data = {
        isDeleted: fields.affectedRows
      }
      response(200, data, "successfully deleted data", res)
    } else {
      response(404, "user not found", "error", res)
    }
  })
})

db.connect((err) => {
  if (err) {
    console.error("❌ Gagal terhubung ke database:", err.stack);
    return;
  }
  console.log(`🎉 Berhasil terhubung ke database MySQL (ID: ${db.threadId})`);
});

app.listen(port, () => {
  console.log(`🚀 Server API berjalan di http://localhost:${port}`);
});