const urlRegex = require("url-regex");
const fetch = require("node-fetch");
const https = require('https');
const fs = require('fs');

if (process.argv.length <= 2) {
  console.log('Missing URL.');
  console.log('Usage: node index.js <tiktok-url> [output-folder]');
  console.log('(the default output folder is ./');
  console.log('Example: node index.js https://www.tiktok.com/@jrswab/video/6730698984664452357 ~/Videos');
  process.exit(0);
}

let url = process.argv[2];

if (url.endsWith('/')) url = url.substring(0, url.length - 1);

const urlParts = url.split("/");
let id = urlParts[urlParts.length - 1];

if(id.includes("?")) id = id.split("?")[0];

var outputFolder = './';

if (process.argv.length >= 4) outputFolder = process.argv[3];

if (!outputFolder.endsWith('/')) outputFolder += '/';

console.log(`Output folder > ${outputFolder}`);
console.log(`URL > ${url}`);

fetch(url)
  .then(res => {
    return res.text();
  })
  .then(body => {
    const urls = body.match(urlRegex());
    const mediaUrl = urls.find(url => url.includes("muscdn.com") && url.includes("https://v"));
    console.log(`Found Media URL: ${mediaUrl}`);

    const file = fs.createWriteStream(`${id}.mp4`);
    const request = https.get(mediaUrl, function(response) {
      response.pipe(file);
    });
  });
