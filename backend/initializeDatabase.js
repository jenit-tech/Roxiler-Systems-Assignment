const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const axios = require('axios');

const db = new sqlite3.Database('database.db');


const url = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';


axios.get(url)
  .then(response => {
    const jsonData = response.data;


    const insertStatement = db.prepare(
      'INSERT INTO products (title, price, description, category, image, sold, dateOfSale) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    db.serialize(() => {
      jsonData.forEach((product) => {
        insertStatement.run(
          product.title,
          product.price,
          product.description,
          product.category,
          product.image,
          product.sold,
          product.dateOfSale
        );
      });

      insertStatement.finalize();

      console.log('Database initialized with seed data.');
    });


    db.close();
  })
  .catch(error => {
    console.error('Error fetching data from the URL:', error.message);

  });