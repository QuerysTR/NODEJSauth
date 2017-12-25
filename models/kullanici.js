var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var kullaniciSchema = new mongoose.Schema({
    username:String,
    password:String
});

kullaniciSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Kullanici', kullaniciSchema);

