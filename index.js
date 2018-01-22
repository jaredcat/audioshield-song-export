const fs = require('fs');
const stream = require('stream');
const es = require('event-stream');

const dir = 'YOUR_AUDIOSHIELD_DIR\\Audioshield_Data\\';
let previousSong = '';
let currentSong = '';

console.log('Running Audioshield song watcher...');

setInterval(() => readFromLogFile(dir), 5000);

function readFromLogFile(readDir) {
  let s = fs
    .createReadStream(readDir + 'output_log.txt')
    .pipe(es.split())
    .pipe(es.mapSync(line => readLine(line)))
    .on('error', err => handleError(err))
    .on('end', () => handleEnd(currentSong));
}

function readLine(line) {
  if (line.indexOf('current song name') > -1) {
    currentSong = line.slice(18);
  }
}

function handleError(err) {
  console.error(err);
}

function handleEnd(currentSong) {
  writeToOutputFile(dir, currentSong);
}

function writeToOutputFile(outputDir, currentSong) {
	if (currentSong !== previousSong) console.log(`Current song: ${currentSong}`);
	previousSong = currentSong;
  fs.writeFileSync(outputDir + 'audioshield_song.txt', currentSong);
}
