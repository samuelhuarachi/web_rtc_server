var mongoose = require("mongoose");
var credentials = require("./credentials");

mongoose.connect(`mongodb+srv://${credentials.usernameMongo}:${credentials.passwordMongo}@cluster0.2hkje.mongodb.net/webrtc_sandbox?retryWrites=true&w=majority`, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

var analistSchema = new mongoose.Schema({
    email: String,
    cellphone: String,
    name: String,
    lastname: String,
    description: String,
    isOnline: Boolean,
    slug: String,
    login: String,
    password: String,
    _token: String,
    _tokenDate: Date,
    pricePerHour: Number,
    gains: Number,
    photo: String,
    discountPercent: Number,
  }, {
    collection: "analistcollection",
  });

// controla os analistas, e suas sockets id
var chatControllerSchema = new mongoose.Schema({
    slug: String,
    socketID: String,
  }, {
    collection: "chatControllerSchema",
});

// anota a socket id do cliente, e fala em room ele esta
var roomClientSchema = new mongoose.Schema({
  socketID: String,
  nickname: String,
  created_at: Date,
  token: String,
  slug: String, // slug eh o room name
}, {
  collection: "roomClientCollection",
});


const AnalistCollection = mongoose.model(
    "analistcollection",
    analistSchema,
    "analistcollection"
);

const ChatControllerCollection = mongoose.model(
    "chatcontrollercollection",
    chatControllerSchema,
    "chatcontrollercollection"
  );

const RoomClientCollection = mongoose.model(
    "roomClientCollection",
    roomClientSchema,
    "roomClientCollection"
  );

  module.exports = {
    AnalistCollection,
    ChatControllerCollection,
    RoomClientCollection
  };
