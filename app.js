var app = require('express')();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport = require('passport');
var Kullanici = require('./models/kullanici');
var passportLocal = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');


mongoose.connect("mongodb://localhost/auth_demo2",{useMongoClient:true});
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(require('express-session')({
    secret: "Node JS Öğreniyorum",
    resave: false,
    saveUninitialized:false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(Kullanici.authenticate()));
passport.serializeUser(Kullanici.serializeUser());
passport.deserializeUser(Kullanici.deserializeUser());


app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/kayitol', (req,res)=>{
    res.render('kayitol');
});

app.post('/kayitol', (req,res)=>{    
    Kullanici.register(new Kullanici({username: req.body.username}), req.body.password, (err,data)=>{
        if(err){
            console.log(err);
            return res.render('kayitol');
        } else {
            passport.authenticate('local')(req,res,()=>{
                  res.redirect('profil');
            });
        }
    });
});

app.get('/giris', (req,res)=>{
    res.render('giris');
});

app.post('/giris', passport.authenticate('local', {
    successRedirect: "/profil",
    failureRedirect: "/giris"
}), (req,res)=>{
   
});

function girisKontrol(req,res,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        res.redirect('giris');
    }
}

app.get("/cikis", (req, res) => {
    req.logOut();
    res.redirect("/");
});

app.get('/profil', girisKontrol, (req,res)=>{
    res.render('profil');
});


app.listen(3000, ()=>{
    console.log("Sunucu AKtif");
})