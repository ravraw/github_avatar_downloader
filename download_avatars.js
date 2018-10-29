var request = require('request');
const KEYS = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url:
      'https://api.github.com/repos/' +
      repoOwner +
      '/' +
      repoName +
      '/contributors',
    headers: {
      'User-Agent': 'request',
      Authorization: `Authorization: token ${KEYS.GITHUB_TOKEN}`
    }
  };
  request(options, function(err, res, body) {
    let result = JSON.parse(body);
    cb(err, result);
  });
}

const logContributers = (err, result) => {
  if (err) {
    console.log(err);
  }
  let avatars_array = result.map(contributer => contributer.avatar_url);
  console.log(avatars_array);
};

getRepoContributors('jquery', 'jquery', logContributers);
