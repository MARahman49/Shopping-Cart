var Product = require('./models/product');
var mongoose = require('mongoose');

mongoose.connect('localhost:27017/minicart');

var products = [
  new Product({
    name: 'Nike Metcon DSX Flyknit 2 WOD-Paradise',
    category: 'Men Training Shoe',
    price: 160,
    imgSrcPath: '/images/product-shoe-1.png'
  }),
  new Product({
    name: 'Nike Metcon DSX Flyknit 2',
    category: 'Men Training Shoe',
    price: 150,
    imgSrcPath: '/images/product-shoe-2.png'
  }),
  new Product({
    name: 'Nike Zoom Command',
    category: 'Men Training Shoe',
    price: 120,
    imgSrcPath: '/images/product-shoe-3.png'
  }),
  new Product({
    name: 'Nike Free Trainer V7',
    category: 'Men Training Shoe',
    price: 100,
    imgSrcPath: '/images/product-shoe-4.png'
  }),
  new Product({
    name: 'Air Jordan Trainer 2 Flyknit',
    category: 'Men Training Shoe',
    price: 140,
    imgSrcPath: '/images/product-shoe-5.png'
  }),
  new Product({
    name: 'Nike Lunar Control Vapor 2',
    category: 'Men Golf Shoe',
    price: 175,
    imgSrcPath: '/images/product-shoe-6.png'
  })
];

var countEnd = 0;

for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    countEnd++;
    if (countEnd === products.length) { exitProcess(); }
  });
}
function exitProcess() { mongoose.disconnect(); }