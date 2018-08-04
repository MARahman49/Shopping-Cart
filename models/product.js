var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = Schema({
  name: { type: String, required: true, max: 50 },
  category: { type: String, required: true, max: 50 },
  price: { type: Number, required: true },
  imgSrcPath: { type: String, required: true },
  dateAdded: { type: String, default: Date.now }
});

var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;