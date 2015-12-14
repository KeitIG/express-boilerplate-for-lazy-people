// Modules
var express  = require('express'),
    stylus   = require('stylus'),
    path     = require('path'),
    compress = require('compression'),
    force    = require('forcedomain'),
    minify   = require('express-minify');



// The app
var app = express();

// Views and view engine
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'jade');

// Stylus
app.use(stylus.middleware({
    src     : path.join(__dirname, 'src', 'styles'),
    dest    : path.join(__dirname, 'public', 'styles'),
    compile : function (str, path) {
        return stylus(str)
            .set('filename', path)
            .set('compress', true);
    }
}));

// Public pathes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'src', 'images')));

// Gzip
app.use(compress());

// Minify css and js
app.use(minify());

// forcedomain
app.use(force({
    hostname: 'mywebsite.com'
}));



// Routes
app.get('/*', function(req, res, next) {
    if (req.headers.host.match(/^www/) !== null ) {
        res.redirect(301, 'http://' + req.headers.host.replace(/^www\./, '') + req.url);
    } else {
        next();
    }
})

app.get('/', function (req, res) {
    res.render(
        'home',
        {
            title       : 'Hello world !',
            description : 'You nice description here',
            keywords    : 'one, two, three, FIVE !, got ya'
        }
    )
});

app.listen(3000);
