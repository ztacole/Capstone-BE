const mysql = require('mysql2');

const db = mysql.createConnection({
  host: '153.92.15.37',
  user: 'u271135862_capstone',
  password: 'Recyclens123#',       
  database: 'u271135862_capstone' 
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;
