const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations
} = require('./db');

const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/customers', async(req, res, next)=> {
  try {
    res.send(await fetchCustomers());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/restaurants', async(req, res, next)=> {
  try {
    res.send(await fetchRestaurants());
  }
  catch(ex){
    next(ex);
  }
});

app.get('/api/reservations', async(req, res, next)=> {
  try {
    res.send(await fetchReservations());
  }
  catch(ex){
    next(ex);
  }
});

app.delete('/api/reservation/:id', async(req, res, next)=> {
  try {
    await destroyReservation(req.params.id);
    res.sendStatus(204);
  }
  catch(ex){
    next(ex);
  }
});

app.post('/api/reservation', async(req, res, next)=> {
  try {
    res.status(201).send(await createReservation(req.body));
  }
  catch(ex){
    next(ex);
  }
});

const init = async()=> {
  await client.connect();
  console.log('connected to database');

  await createTables();
  console.log('tables created');
  const [cat, david, tessa, crab, olive, toyko] = await Promise.all([
    createCustomer('Cat'),
    createCustomer('David'),
    createCustomer('Tessa'),
    createRestaurant('Mr. Crab'),
    createRestaurant('Olive Garden'),
    createRestaurant('Toyko SteakHouse')
  ]);

  await Promise.all([
    createReservation({ date:'03/01/2024', party_count: 4, customer_id: tessa.id, restaurant_id: toyko.id}),
    createReservation({ date:'03/01/2024', party_count: 2, customer_id: tessa.id, restaurant_id: crab.id}),
    createReservation({ date:'03/01/2024', party_count: 5, customer_id: tessa.id, restaurant_id: olive.id}),
    createReservation({ date:'03/01/2024', party_count: 1, customer_id: cat.id, restaurant_id: toyko.id})
  ]);

  //console.log(`${david.name} has an id of ${david.id}`);

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();