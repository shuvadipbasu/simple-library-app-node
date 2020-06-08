const passport = require('passport');
//const session = require('express-session');
const bodyParser = require('body-parser');
const { Strategy } = require('passport-local');



function passportConfig(app) {
    const dummyUsers = [{
        username: 'a',
        password: 'a'
    }];

    //app.use(session({ secret: "cats" }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Strategy((username, password, done) => {
        if (username === "a" && password === "a") {
            console.log("success");
            return done(null, { username, password });
        } else return done(null, false, { message: "Incorrect user name or password" });
    }));

    passport.serializeUser((user, done) => {
        console.log("user" + user.username);
        return done(null, user.username);
    });

    passport.deserializeUser((id, done) => {
        console.log("+++++id" + id);
        const usr = dummyUsers.find(user => user.username === id);
        console.log("------" + usr.username);
        if (usr)
            return done(null, usr);
        else
            return done("error found", null);
    });

    return passport;

}

module.exports = passportConfig;