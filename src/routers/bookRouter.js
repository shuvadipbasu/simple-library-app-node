const express = require('express');
const sql = require('mssql');
const debug = require('debug')('app:bookRoute');
const isAuth = require('../config/auth');

function router(nav, title, config, passport) {
    const bookRouter = express.Router();

    const books = [{
            title: "Leady with the lamp",
            genre: "drama fiction",
            author: "someone idont know",
            read: false
        },
        {
            title: "Head First Java",
            genre: "programming Language",
            author: "forgot",
            read: true
        },
        {
            title: "Project phenix",
            genre: "Software Engineering Story",
            author: "forgot",
            read: true
        }
    ];

    bookRouter.get('/', isAuth, (req, res) => {
        console.log('in /book');

        sql.connect(config).catch(err => debug(err));
        const request = new sql.Request();

        request.query('select * from books')
            .then(result => {
                debug(result);

                res.render(
                    'books', {
                        title,
                        books: result.recordset,
                        nav
                    }
                );
            });


    });

    bookRouter.route('/:id')
        .get(passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }), (req, res) => {
            const { id } = req.params;

            res.render('book', {
                nav,
                title,
                book: books[id]
            })
        });

    return bookRouter;
}

module.exports = router;