require('dotenv').config();
const request = require('request');
const fs = require('fs');

// destructure inputs from user
const [name, owner] = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

// Main function
function getRepoContributors(repoOwner, repoName, cb) {
  if (repoOwner === undefined || repoName === undefined) {
    console.error('Please enter owner-name and repo-name');
  } else {
    var options = {
      url: `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`,
      headers: {
        'User-Agent': 'request',
        Authorization: `token ${process.env.GITHUB_TOKEN}`
      }
    };
    request(options, (err, res, body) => {
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
      console.log(`downloading image to ${filePath}....`);
    })
    .pipe(fs.createWriteStream(filePath))
    // use finish event to print the last console.log
    .on('finish', () => {
      console.log(`Download complete in ${filePath}...`);
    });
};

// call the function
getRepoContributors(name, owner, logContributers);
