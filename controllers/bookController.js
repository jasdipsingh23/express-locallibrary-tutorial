let Book = require('../models/book');
let Author = require('../models/author');
let Genre = require('../models/genre');
let BookInstance = require('../models/bookinstance');

let mongoose = require('mongoose');
let async = require('async');

const {body, validationResult} = require('express-validator');

exports.index = function (req, res) {
    
    async.parallel({
        book_count: function (callback) {
            Book.countDocuments({}, callback);
        }, 
        book_insance_count: function (callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_insance_available_count: function (callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function (callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function (callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', {title: 'Local Library Home', error: err, data: results});
    });
};

// Display list of all books.
exports.book_list = function(req, res, next) {
    
    Book.find({}, 'title author')
        .sort({title : 1})
        .populate('author')
        .exec(function (err, list_books) {
            if (err) {
                return next(err);
            }

            res.render('book_list', {title: 'Book List', book_list: list_books});
        });

};

// Display detail page for a specific book.
exports.book_detail = function(req, res, next) {

    let id = mongoose.Types.ObjectId(req.params.id);
    
    async.parallel({
        book: function (callback) {
            
            Book.findById(id)
                .populate('author')
                .populate('genre')
                .exec(callback);
        }, 

        book_instance: function (callback) {

            BookInstance.find({'book': id})
                .exec(callbcak);
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        }

        if(results.book == null) {
            var err = new Error('Book not found');
            err.status = 404;
            return next(err);
        }

        res.render('book_detail', {title: results.book.title, book: results.book, book_instances: results.book_instance});
    });
    
};

// Display book create form on GET.
exports.book_create_get = function(req, res) {
    async.parallel({
        authors: function(callback) {
            Author.find(callback);
        },

        genres: function(callback) {
            Genre.find(callback);
        },
    }, (err, results) => {
        if(err) {
            return next(err);
        }
        res.render('book_form', {title: 'Create Book', authors: results.authors, genres: results.genres });
    });
};

// Handle book create on POST.
exports.book_create_post = [
    // Convert genre to array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(typeof req.body.genre === 'undefined') {
                req.body.genre = [];
            } else {
                req.body.genre = new Array(req.body.genre);
            }
        }
        
        next();
    },

    // Validate and sanitize
    body('title', 'Title must not be empty').trim().isLength({min : 1}).escape(),
    body('author', 'Author must not be empty').trim().isLength({min : 1}).escape(),
    body('summary', 'Summary must not be empty').trim().isLength({min : 1}).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({min : 1}).escape(),
    body('genre.*').escape(),

    (req, res, next) => {
        const errors = validationResult(res);

        let book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            }
        );

        if(!errors.isEmpty()) {
            async.parallel({
                authors: function(callback) {
                    Author.find(callback);
                },
                genres: function(callback) {
                    Genre.find(callback);
                },
            }, (err, results) => {
                if(err) {
                    return next(err);
                }

                for(let i = 0; i < results.genres.length; i++) {
                    if(book.genre.indexOf(results.genres[i]._id > -1)) {
                        results.genres[i].checked = 'true';
                    }
                }
                
                res.render('book_form', {title : 'Create Book', auhotrs: results.authors, genres: results.generes, book: book, errors: errors.array() });
            });
            return;

        } else {
            book.save( (err) => {
                if(err) {
                    return next(err);
                }

                res.redirect(book.url);
            });
        }
    }
];

// Display book delete form on GET.
exports.book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
};

// Handle book delete on POST.
exports.book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
};

// Display book update form on GET.
exports.book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
};

// Handle book update on POST.
exports.book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
};
