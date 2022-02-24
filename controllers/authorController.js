let Author = require('../models/author');
let Book = require('../models/book');

let async = require('async');
let mongoose = require('mongoose');

exports.author_list = (req, res, next) => {
    Author.find()
        .sort([['family-name', 'ascending']])
        .exec(function (err, list_authors) {
            if(err) {
                return next(err);
            }

            res.render('author_list', {title: 'Author List', author_list: list_authors});
        });
};

exports.author_detail = (req, res, next)  => {

    let id = mongoose.Types.ObjectId(req.params.id);

    async.parallel({
        author: function(callback) {
            Author.findById(id)
                .exec(callback);
        },
        authors_books: function(callback) {
            Book.find({'author': id}, 'title summary')
                .exec(callback);
        },
    }, function(err, results) {
        if(err) {
            return next(err);
        }

        if(results.author == null) {
            var err = new Error('Author not found');
            err.status = 404;
            return next(err);
        }

        res.render('author_detail', {title: 'Author Detail', author: results.author, author_books: authors_books});
    });
};

exports.author_create_get = (req, res) => {
    res.send('NOT IMPEMENTED: Author create GET');
};

exports.author_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author create POST');
};

exports.author_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete GET');
};

exports.author_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author delete POST');
};

exports.author_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update GET');
};

exports.author_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: Author update POST');
};