/*eslint-env node*/
const express = require('express');
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');
const path = require('path');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(expressSession({
    secret: 'any phrase will do',
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));

const passport = require('./src/config/passportConfig')(app);

/**
 * passport configuration
 */



//const sql = require('mssql');

const config = {
    user: 'shuvadip',
    password: 'Cowgoat@2107',
    server: 'libmanagement.database.windows.net', // You can use 'localhost\\instance' to connect to named instance
    database: 'lib',
    options: {
        encrypt: true
    }
}

//sql.connect(config).catch(err => debug(err));

const nav = [{
    title: 'Authors',
    href: '/authors'
}, {
    title: 'Books',
    href: '/books'
}];
const title = "My Library";
const bookRouter = require('./src/routers/bookRouter')(nav, title, config, passport);
app.use('/books', bookRouter);

app.get('/', (req, res) => {
    //res.sendFile(path.join(__dirname, "views/index.html"));
    res.render('login');
});

app.post('/login', passport.authenticate('local', {
    failureRedirect: '/',
    successRedirect: '/books'
}));

app.listen(3000, () => {
    debug(`listing to port :${chalk.green('3000')}`);
});