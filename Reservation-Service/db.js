const mysql = require('mysql2');

// connexion بدون database
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
});

// connect
connection.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL server");

    // 1️⃣ create database if not exists
    const dbName = process.env.DB_NAME || 'hotel_reservation';
    connection.query(
        `CREATE DATABASE IF NOT EXISTS ${dbName}`,
        (err) => {
            if (err) throw err;
            console.log("Database ready");

            // 2️⃣ use database
            connection.changeUser({ database: dbName }, err => {
                if (err) throw err;

                // 3️⃣ create table
                createTables();
            });
        }
    );
});

// function create tables
function createTables() {
    const reservationTable = `
        CREATE TABLE IF NOT EXISTS reservations (
                                                    idReservation INT AUTO_INCREMENT PRIMARY KEY,
                                                    client_id INT NOT NULL,
                                                    chambre_id INT NOT NULL,
                                                    dateDebut DATE NOT NULL,
                                                    dateFin DATE NOT NULL,
                                                    statut VARCHAR(50),
            nombrePersonnes INT,
            typeChambre VARCHAR(50),
            photoActeMariage VARCHAR(255)
            )
    `;

    connection.query(reservationTable, err => {
        if (err) throw err;
        console.log("Table reservations ready");

        // 🔹 Check if totalPrix column exists before adding
        const dbName = process.env.DB_NAME || 'hotel_reservation';
        const checkColumn = `
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = '${dbName}' 
              AND TABLE_NAME = 'reservations' 
              AND COLUMN_NAME = 'totalPrix'
        `;

        connection.query(checkColumn, (err, results) => {
            if (err) throw err;

            if (results.length === 0) {
                const addTotalPrix = `ALTER TABLE reservations ADD COLUMN totalPrix DECIMAL(10,2)`;
                connection.query(addTotalPrix, err => {
                    if (err) throw err;
                    console.log("Column totalPrix added");
                });
            } else {
                console.log("Column totalPrix already exists");
            }
        });
    });
}

module.exports = connection;
