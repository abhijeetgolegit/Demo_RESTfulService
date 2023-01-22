//REST - Representational State Transfer
var express = require('express');

// body-parser is used to parse the Request body
// and populate the req object
var bodyParser = require('body-parser');

// ODM - Object Data Mapping
// Mongoose
var mongoose = require('mongoose');

// Create Express app

var app = express();

app.set('port', 3300);
app.use(bodyParser.json());

// Database connectivity
var dbHost = 'mongodb://localhost:27017/WebinarDB';
mongoose.connect(dbHost);

// book schema
var bookSchema = mongoose.Schema({
    name: String,
    isbn: { type: String, index: true, unique: true },
    author: String,
    pages: Number
});

var Book = mongoose.model('Book', bookSchema);

app.listen(app.get('port'), function () {
    console.log('Server up at http://localhost:' + app.get('port'));
});

// To allow CORS - Cross Origin Resrouce Sharing 
app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Get All Books
app.get('/books', function (req, res) {
    Book.find({}, function (err, result) {
        if (err) throw err;
        res.json(result);
    });
});

// Get Book by isbn
app.get('/book/:isbn', function (req, res) {
    console.log('Fetching details for the book with isbn:- ' +
        req.params.isbn);
    Book.findOne({ isbn: req.params.isbn },
        function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// Insert a new book
app.post('/book', function (req, res) {
    console.log('Adding new book ' + req.body.name);
    var book = new Book({
        name: req.body.name,
        isbn: req.body.isbn,
        author: req.body.author,
        pages: req.body.pages
    });

    book.save(function (err, result) {
        if (err) throw err;
        res.json({
            message: 'Successfuly added the Book ', book: result
        });
    });
});

// Modify an existing book
app.put('/book/:isbn', function (req, res) {
    Book.findOne({ isbn: req.params.isbn },
        function (err, result) {
            if (err) throw err;
            if (!result) {
                res.json({
                    message: 'Book with ISBN ' + req.params.isbn + ' not found!'
                });
            }
                result.name = req.body.name,
                //result.isbn = req.body.isbn,
                result.author = req.body.author,
                result.pages = req.body.pages

            result.save(function (err, result) {
                if (err) throw err;
                res.json({
                    message: 'Successfuly updated the Book ', book: result
                });
            });
        });
});

// Delete an Existing book
app.delete('/book/:isbn',function(req,res){
    Book.findOneAndRemove({isbn:req.params.isbn},
        function(err,result){
        if(err) throw err;
        res.json({
            message:'Successfuly deleted the Book ',book:result
        });
    });    
});

