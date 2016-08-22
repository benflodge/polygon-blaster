var util = require("util"),
    express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require("socket.io")(server),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    exphbs  = require('express-handlebars'),
    hbs = exphbs.create({}),
    api = require("./api"),
    Game = require("./game-io"),
    game,
    socket,
    sessionMiddleware;

var sessionStore = new session.MemoryStore();
var MongoStore = require('connect-mongo/es5')(session);

function init() {

    server.listen(8000);

    app.engine('handlebars',  hbs.engine);
    app.set('view engine', 'handlebars');

    app.use(express.static(__dirname + '/public'));

    app.use(bodyParser.json());       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    }));
    app.use(cookieParser());

    /* FIXME
    *  Update to use MongoStore
    */
    sessionMiddleware = session({
        secret: 'super-duper-secret-secret',
        // store: new MongoStore(api.mongoStoreOptions)
        store: sessionStore
    });

    io.use(function(socket, next) {
        sessionMiddleware(socket.request,  socket.request.res, next);
    });

    app.use(sessionMiddleware);

    app.get('/', function (req, res) {
        if(req.session && req.session.user) {
            res.render('home', {
                user: req.session.user.user,
                score: req.session.user.score
            });

        } else if (req.cookies['auto-user']){
            /* FIXME Security
             * Dont keep password in server req cookie just keep auth flag
             */
            // FIXME retrieve cookie id in person.autoLogins
            // then attempt automatic login
            api.autoLogin(
                req.cookies['auto-user'],
                req.cookies.pass,
                function(err, person){
                    if (!err || person != null){
                        console.log('Auto login', person);
                        req.session.user = getSafeUserInfo(person);
                        res.render('home', {
                            user: person.user,
                            score: person.score
                        });
                    } else {
                        res.render('home');
                    }
            });
        } else {
            res.render('home');
        }
    });

    app.post('/api/login', function(req, res) {
        api.manualLogin(
            req.param('user'),
            req.param('password'),
            function(err, person){

            if (err || !person){
                res.status(400).send(err || 'Error');
            } else {
                req.session.user = getSafeUserInfo(person);
                if (req.param('remember') == 'true'){

                    /* FIXME
                    *  Store long life cookie id
                    *
                    */
                    res.cookie('auto-user', person.user, {
                        maxAge: 900000
                    });
                }
                res.status(200).send({
                    user: person.user,
                    score: person.score
                });
            }
        });
    });

    app.post('/api/add-user', function(req, res){
        api.addNewAccount({
            email   : req.param('email'),
            user    : req.param('user'),
            pass    : req.param('password')
        }, function(err, result){
            if (err){
                res.status(400).json({ error: err });
            }   else {
                console.log('User Added', result.user);
                res.status(200).json({user: result.user});
            }
        });
    });

    app.get('/api/scores', function(req, res) {
        api.getAllScores( function(e, scores){
            res.status(200).json(scores);
        });
    });

    app.get('/game/users/me', function(req, res) {
        if (req.session && req.session.user) {
            /* FIXME
            *  Update to get from MongoStore
            */
            sessionStore.get(req.sessionID, function(err, data) {
                console.log('data',data);
                if (err) {
                    res.status(403).json({error:'No permission'});
                } else {
                    res.status(200).json(getSafeUserInfo(data.user));

                }
            });
        } else {
            res.status(403).json({error:'No permission'});
        }
    });

    app.get('/game', function (req, res) {
        res.sendFile(__dirname + '/public/game.html');
    });

    game = new Game(io).initGame();
}

function getSafeUserInfo(data) {
    return (data) ? {
        user:  data.user,
        score: data.score,
        '_id': data['_id']
    } : null;
}

init();
