'use strict'
var rp = require('request-promise');
var errors = require('request-promise/errors');

var cache = {
  etag : '',
  names : []
};

exports.getRepoNames = function (req, res) {
  console.log('Getting repos');

  console.log('cache etag: ' + cache.etag + ' cache names: ' + cache.names);

  var getRepos = function () {

    var options = getReposOptions();
    return rp.get(options)
    .then(function(repoNames) {
      res.status(200).json(repoNames);
    })
    .catch(errors.StatusCodeError, function (reason) {
      if(reason.statusCode == '304') {
        console.log('repo names havent changed, using values from cache: ' + cache.names);
        res.status(200).json(cache.names);
      }
      else {
        res.status(400).json({
          success: false,
          reason: reason
        });
      }
    })
    .catch(errors.RequestError, function (reason) {
      res.status(500).json({
        success: false,
        reason: reason
      });
    });

  };
  getRepos();
};

var getReposTransform = function (body, response) {
    var repoNames = [];
    var repos = JSON.parse(body);
    repos.forEach( function (element, index, array) {
      var repo = element;
      repoNames.push(repo.name);
    });

    console.log('response etag is ' + response.headers.etag);
    cache.etag = response.headers.etag;
    cache.names = repoNames;

    return repoNames;
};


function getReposOptions() {
  return {
    uri: 'https://api.github.com/users/johnBartos/repos',
    method: 'GET',
    headers: {'user-agent': 'node.js', 'If-None-Match': cache.etag},
    transform: getReposTransform,
    resolveWithFullResponse: true,
  };
}

function getRepoNamesFromCache(eTag) {
  return new Promise (function (resolve, reject) {
    try {
      resolve();
    }
    catch (exception) {
      reject();
    }
  });
}

function saveRepoNamesToCache() {
  return new Promise ( function(resolve, reject) {

  });
}
