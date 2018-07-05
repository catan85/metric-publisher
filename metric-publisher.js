
var mongoose = require('mongoose');
var readline = require('readline');

var clock = 1000;



const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var processResponse = function processResponse (user) {
    
    send(user);
    rl.close();
  };

rl.question('Please enter the machine owner username: ', processResponse);


var send = function sendDataToUser(user){

    console.log('Selected user: ', user);

    var uri = 'mongodb://mongouser:mongouser123@ds247330.mlab.com:47330/unimi';

    console.log("connecting..");
    mongoose.connect(uri);

    var db = mongoose.connection;


    db.on('error', console.error.bind(console, 'connection error:'));

    db.once('open', function callback() {
    var measureSchema = mongoose.Schema({
        username: String,
        timestamp: Date,
        
        torque: Number,
        speed: Number,
        current: Number,
        power: Number,
        temperature: Number
    });

    // Store measure documents in a collection called "measures"
    var Measures = mongoose.model('measures', measureSchema);

    // Create seed data
    var messageSeed = {
            username: user,
            timestamp: '2018-06-14 00:00:00',

            torque: 11.22,
            speed: 1200.003,
            current: 4.03,
            power: 6.32,
            temperature: 20.3
        };


    function randomizeMessage(message)
    {
        message.speed = message.speed+(message.speed*0.1*(Math.random()-0.5));
        message.temperature = message.temperature + (message.temperature*0.1*(Math.random()-0.5));
        message.torque = message.torque + (message.torque*0.1*(Math.random()-0.5));
        message.power = message.power + (message.power*0.1*(Math.random()-0.5));
        message.current = message.current + (message.current*0.1*(Math.random()-0.5));
    }

    function delayFunct() {
        
        setTimeout(delayFunct, clock);

        randomizeMessage(messageSeed);

        messageSeed.timestamp =  new Date;

        console.log(messageSeed);
  
        var list = [messageSeed]
        Measures.insertMany(list).catch(err => {
            console.log(err)
        });
    }

    console.log("launching timer..");
    setTimeout(delayFunct, clock);

    });
};