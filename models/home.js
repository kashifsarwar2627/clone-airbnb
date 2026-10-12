const { ObjectId } = require('mongodb');
const { getDB } = require('../utils/databaseUtil');

module.exports = class Home {
  constructor(houseName, price, location, rating, photoUrl, description, _id) {
    this.houseName = houseName;
    this.price = price;
    this.location = location;
    this.rating = rating;
    this.photoUrl = photoUrl;
    this.description = description;
    if (_id) {
      this._id = _id;
    }
  }

  static decorateDocument(home) {
    if (!home) {
      return home;
    }

    if (home._id && !home.id) {
      home.id = String(home._id);
    }

    return home;
  }

  save() {
    const db = getDB();
    if (this._id) { // update
      const updateFields = {
        houseName: this.houseName,
        price: this.price,
        location: this.location,
        rating: this.rating,
        photoUrl: this.photoUrl,
        description: this.description
      };

      return db.collection('homes').updateOne({_id: new ObjectId(String(this._id))}, {$set: updateFields});
    } else { // insert
      return db.collection('homes').insertOne(this);
    }
  }

  static fetchAll() {
    const db = getDB();
    return db.collection('homes').find().toArray().then((homes) => homes.map((home) => Home.decorateDocument(home)));
  }

  static findById(homeId) {
    const db = getDB();
    return db.collection('homes')
      .findOne({_id: new ObjectId(String(homeId))})
      .then((home) => Home.decorateDocument(home));
  }

  static deleteById(homeId) {
    const db = getDB();
    return db.collection('homes')
    .deleteOne({_id: new ObjectId(String(homeId))});
  }
};