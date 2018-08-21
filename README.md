# LIRI
Liri is a Node command line app that allows you to search for songs, movies, and upcoming concerts.

## Installation
To install and run Liri, type the following in your terminal:
```bash
git clone https://www.github.com/adnanyousef/liri-node-app.git
cd liri-node-app
npm install
mv .env_example .env
node liri.js <subcommand> <option>
```
Make sure to fill in your API keys in the `.env` file! To see available subcommands, simply type `node liri.js` or scroll down this page.

### Usage
Available subcommands include:
- `concert-this <artist name>` - searches for upcoming concerts for your specified artist.
- `spotify-this-song <search query>` - searches Spotify for your query and returns the top song name, artist name, album name, and a 30 second MP3 preview.
- `movie-this <movie name>` - searches for your specified movie and returns many details, such as the release year, ratings, and actors.
- `do-what-it-says` - if a file called "random.txt" exists in your current working directory, Liri will execute any of its commands found in that file. Example contents of random.txt:
```
spotify-this-song,"I Saw The Sign"
```

### Log
A history of all output is saved in the file `log.txt`.

### Demo
![demo](./images/demo.gif)

## To do:
- [x] Colorize terminal output using chalk
- [x] Format time output of `concert-this` to a readable format
- [x] Add log.txt
