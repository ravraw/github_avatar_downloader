require('dotenv').config();
//const dotenv = require('dotenv');
const request = require('request');
const fs = require('fs');
//const KEYS = require('./secrets');

const [name, owner] = process.argv.slice(2);
console.log(name, owner);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (repoOwner === undefined || !repoName === undefined) {
    console.log('Please enter owner-name and repo-name');
  } else {
    var options = {
      url:
        'https://api.github.com/repos/' +
        repoOwner +
        '/' +
        repoName +
        '/contributors',
      headers: {
        'User-Agent': 'request',
        Authorization: `token ${process.env.GITHUB_TOKEN}`
        //Authorization: `token ${KEYS.GITHUB_TOKEN}`
      }
    };
    request(options, function(err, res, body) {
      let result = JSON.parse(body);
      cb(err, result);
    });
  }
}

// get contributers and save avatar_url for each,

const logContributers = (err, result) => {
  if (err) {
    console.log(err);
  } else {
    result.map(contributer => {
      downloadImageByURL(
        `${contributer.avatar_url}`,
        `avatars/${contributer.login}.png`
      );
    });
  }
};

// fetch all avatars using avatars_array links

const downloadImageByURL = (url, filePath) => {
  request
    .get(url)
    .on('error', err => {
      throw err;
    })
    .on('end', () => {
      console.log('downloading image ....');
    })
    .pipe(fs.createWriteStream(filePath))
    // use finish event to print the last console.log
    .on('finish', () => {
      console.log('Download complete.......');
    });
};

getRepoContributors(name, owner, logContributers);
