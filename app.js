// Core Module
const path = require('path');

// External Module
const express = require('express');

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");
const { mongoConnect, getDB } = require('./utils/databaseUtil');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(rootDir, 'view'));

app.use(express.urlencoded({ extended: false }));
app.use(storeRouter);
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, 'public')));

app.use(errorsController.pageNotFound);

const seedSampleHomes = async () => {
  const db = getDB();
  const homesCollection = db.collection('homes');
  const existingHomes = await homesCollection.countDocuments();

  await homesCollection.updateMany(
    { photoUrl: { $in: ['/images/house5.svg', '/images/house5.png'] } },
    { $set: { photoUrl: '/images/house5.jpg' } }
  );
  await homesCollection.updateMany(
    { photoUrl: { $in: ['/images/house6.svg', '/images/house6.png'] } },
    { $set: { photoUrl: '/images/house6.jpg' } }
  );

  if (existingHomes === 0) {
    await homesCollection.insertMany([
      {
        houseName: 'Second House',
        price: '1999',
        location: 'Ghaziabad',
        rating: '4.9',
        photoUrl: '/images/house5.jpg',
        description: 'A bright and cozy home with a terrace garden and modern interior design.'
      },
      {
        houseName: 'Summer Home',
        price: '1499',
        location: 'Jaipur',
        rating: '4',
        photoUrl: '/images/house6.jpg',
        description: 'A welcoming summer retreat with a poolside lounge and open kitchen.'
      }
    ]);
  }
};

const PORT = 3000;
mongoConnect(async () => {
  await seedSampleHomes();
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.log('Failed to start app:', err);
  process.exit(1);
});