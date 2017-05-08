var express = require('express');
var router = express.Router();

const MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db;

var mongoURL = 'mongodb://localhost:27017/shopping-list';
MongoClient.connect(mongoURL, function(err, database) {
  if (err) {
    return console.log(err);
  }
  db = database;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Shopping Lists' });
});

router.get('/lists', function(req, res, next) {
    db.collection('lists').find().toArray(function (err, lists) {
        if (err) {
            return res.send('error');
        }
        res.render('directory', {lists: lists, title: 'Shopping Lists'});
    });
});

router.post('/lists', function(req, res, next) {
    var newList = {name: req.body.listName, items: []};
    db.collection('lists').insert(newList);
    res.redirect('/lists');
});

router.get('/lists/:listName', function(req, res, next) {
    var listName = req.params.listName;
    db.collection('lists').findOne({name: listName}, function(err, list) {
        if (err || !list) {
            return res.send('that list does not exist');
        }
        res.render('list', {listItems: list.items, title: listName});
    });
});

module.exports = router;
