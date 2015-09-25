'use strict';

var moment = require('moment');

exports.format = function (blob, n){
  var commits = JSON.parse(blob);
  var last_commits = commits.slice(0, n);
  var formatted_commits = [];

  for(var i in last_commits)
    {
      var record = last_commits[i];
      var formatted_commit = {
        name: record.commit.committer.name,
        email: record.commit.committer.email,
        date: moment(record.commit.committer.date).fromNow(),
        dateInt: moment(record.commit.committer.date).unix(),
        message: record.commit.message.trunc(55),
        commit_url: record.html_url,
        avatar: record.committer.avatar_url,
        committer_url: record.committer.html_url
      };
      formatted_commits.push(formatted_commit);
    }
    return formatted_commits;
};

String.prototype.trunc = function(n){
    if(this.length < n)
      return this;

    var truncStr = this.substr(0, n-1);
    truncStr = truncStr.substr(0, truncStr.lastIndexOf(' '));
    return truncStr + '...';
};