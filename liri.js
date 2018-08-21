// Requires
require("dotenv").config();
var fs = require('fs');
var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');

// Easy access to console.log
var log = console.log;

// Grab command line args
var cmd = process.argv[2];
var input = process.argv[3];
for (var i=4; i < process.argv.length; i++) {
  input += (" " + process.argv[i]);
};

// Switch to determine what to do
switch(cmd) {
  case "concert-this":
    concertThis();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;
  default:
    help();
    break;
};

// Function definitions
function help() {
  log("\n" + ("ACCEPTED COMMANDS:") + "\n\n" +
      "   " + ("concert-this") + "       artist name\n" +
      "   " + ("spotify-this-song") + "  song name\n" +
      "   " + ("movie-this") + "         movie name\n" +
      "   " + ("do-what-it-says") + "    random.txt\n");
      process.exit(1);
};

function concertThis() {
  if (!input) {
    log("\n" + ("ERROR: You did not provide an artist!\n"));
    log("Usage: node liri.js concert-this <artist-name>\n");
    return;
  } else {
    var artist = input.trim();
  };

  var queryUrl = "https://rest.bandsintown.com/artists/" + artist.replace(/ /g, "+") + "/events?app_id=" + keys.bandsintown;
  request(queryUrl, function(error, response, body){
    if (error) return console.log(error);
    if (!error && response.statusCode === 200) {
      if (body.length < 20) {
        return log("\nNo results found...\n");
      };
      var data = JSON.parse(body);
      for (var i=0; i<3; i++){
        log("#" + (i+1));
        log(("Venue:     ") + data[i].venue.name);
        log(("Location:  ") + data[i].venue.city + ", " + data[i].venue.country);
        log(("Date:      ") + moment(data[i].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY') + "\n");
        var logData =
          `Artist: ${artist}\n` +
          `Venue: ${data[i].venue.name}\n` +
          `Location: ${data[i].venue.city}, ${data[i].venue.country}\n` +
          "Date: " + moment(data[i].datetime, 'YYYY-MM-DD').format('MM/DD/YYYY') + "\n";
        logFile(logData);
        logFile("---------------\n");
      };
    };
  });
};

function spotifyThisSong() {
  var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret,
  });
  if (!input) {
    log("\nNo song specified. Defaulting to The Sign by Ace Of Base");
    var song = "The Sign Ace of base";
  } else {
    var song = input.trim();
  }
  spotify.search({ type: 'track', query: song }, function(err, data) {
    if (err) return log('\nSong not found...\n')
    var name = data.tracks.items[0].name;
    var artist = data.tracks.items[0].artists[0].name;
    var album = data.tracks.items[0].album.name;
    var preview = data.tracks.items[0].preview_url;
    log('');
    log(("Title:            ") + name);
    log(("Artist:           ") + artist);
    log(("Album:            ") + album);
    if (preview) {
      log("Preview (30 sec): ") + preview;
    } else {
      log("No preview available.");
    };
    log('');

    var logData =
    `Title: ${name}\n` +
    `Artist: ${artist}\n` +
    `Album: ${album}\n` +
    `Preview: ${preview}\n`;

    logFile(logData);
    logFile("---------------\n");
  });
};

function movieThis() {
  if (!input) {
    log("\nNo movie specified. Defaulting to 'The Terminator'")
    var movie = "the+terminator";
  } else {
    var movie = input.trim().replace(/ /g, "+");
  };

  var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=" + keys.omdb;
  request(queryUrl, function(error, response, body){
    if (error) return console.log(error);
    if (!error && response.statusCode === 200){
      var data = JSON.parse(body);
      if (data.Response == "False") return log("\nMovie not found...\n");
      var actors = data.Actors;
      var actorsArr = actors.split(',');
      log('');
      log(("Title:                  ") + data.Title);
      log(("Year:                   ") + data.Year);
      log(("IMDB rating:            ") + data.imdbRating);
      log(("Rotten Tomatoes rating: ") + data.Ratings[1].Value);
      log(("Produced in:            ") + data.Country);
      log(("Language:               ") + data.Language);
      log(("Plot: \n") + data.Plot);
      log("Actors:");
      for (var j=0; j<actorsArr.length; j++) {
        log('- ' + actorsArr[j].trim());
      };
      log('');

      var logData =
        `Title: ${data.Title}\n` +
        `Year: ${data.Year}\n` +
        `IMDB rating: ${data.imdbRating}\n` +
        `Rotten Tomatoes rating: ${data.Ratings[1].Value}\n` +
        `Produced in: ${data.Country}\n` +
        `Language: ${data.Language}\n` +
        `Plot: ${data.Plot}\n` +
        `Actors: ${actors}\n`;
      logFile(logData);
      logFile("---------------\n");
    };
  });
};

function doWhatItSays() {
  fs.readFile('random.txt', 'utf8', function(err, data){
    if (err) return console.log(err);

    if (data.trim().includes("do-what-it-says")) {
      log("\nError:") + " You can't call 'do-what-it-says' in random.txt. Choose another command.\n";
      return;
    };
    var arr = data.split(',');
    switch(arr[0]) {
      case "concert-this":
        input = arr[1].trim();
        concertThis();
        break;
      case "spotify-this-song":
        input = arr[1].trim();
        spotifyThisSong();
        break;
      case "movie-this":
        input = arr[1].trim();
        movieThis();
        break;
      default:
        help();
        break;
    };
  });
};

function logFile(appendThisToLog) {
  fs.appendFile('log.txt', appendThisToLog, function(err){
    if (err) return console.log(err);
  });
};
