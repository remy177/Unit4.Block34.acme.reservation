
const pg = require('pg');
const dbName = 'acme_reservation_db';
const dbString = (process.env.DATABASE_URL || 'postgres://postgres:ilovetess@localhost:5432/') + dbName;
const client = new pg.Client(dbString);
console.log(dbString);

const uuid = require('uuid');

const createCustomer = async(name)=> {
  const SQL = `
    INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createRestaurant = async(name)=> {
  const SQL = `
    INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

const createReservation = async({date, party_count, customer_id, restaurant_id})=> {
  const SQL = `
    INSERT INTO reservation(id, date, party_count, customer_id, restaurant_id) 
    VALUES($1, $2, $3, $4, $5) RETURNING *;
  `;
  const response = await client.query(SQL, [uuid.v4(), date, party_count, customer_id, restaurant_id]);
  return response.rows[0];
};

const fetchCustomers = async()=> {
  const SQL = `
    SELECT *
    FROM customer
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchRestaurants = async()=> {
  const SQL = `
    SELECT *
    FROM restaurant
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchReservations = async()=> {
  const SQL = `
    SELECT *
    FROM reservation
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const destroyReservation = async(id)=> {
  const SQL = `
    DELETE FROM reservation
    where id = $1
  `;
  await client.query(SQL, [id]);
};

const createTables = async()=> {
  const SQL = `
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS restaurant;

CREATE TABLE customer(
  id UUID PRIMARY KEY,
  name VARCHAR(255)
);
CREATE TABLE restaurant(
  id UUID PRIMARY KEY,
  name VARCHAR(255)
);
CREATE TABLE reservation(
  id UUID PRIMARY KEY,
  date DATE DEFAULT now(),
  party_count INTEGER NOT NULL,
  customer_id UUID REFERENCES customer(id) NOT NULL,
  restaurant_id UUID REFERENCES restaurant(id) NOT NULL
);
  `;
  await client.query(SQL);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations
};