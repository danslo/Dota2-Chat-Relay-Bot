var steam = require('steam'),
  steamClient = new steam.SteamClient(),
  steamUser = new steam.SteamUser(steamClient),
  dota2 = require('dota2'),
  dotaClient = new dota2.Dota2Client(steamClient, true),
  prompt = require('prompt'),
  config = require('config'),
  util = require('util');

module.exports = function(io) {
  this.connect = function(two_factor_code) {
    steamClient.connect();
    steamClient.on('connected', function() {
      this.onConnect(two_factor_code);
    }.bind(this));
    steamClient.on('logOnResponse', this.onLogon);
    steamClient.on('error', this.onError);
  }

  this.onError = function(err) {
    console.log(err);
  }

  this.onLogon = function(resp) {
    if (resp.eresult == steam.EResult.OK) {
      dotaClient.launch();
      dotaClient.on('ready', function() {
        dotaClient.joinChat(config.dota2.channel, config.dota2.channel_type);
      });
      dotaClient.on('chatMessage', function(channel, person, message) {
        io.emit('message', { person: person, message: message });
      });
      dotaClient.on('chatJoin', function(channel, person, steamId, obj) {
        console.log(person);
      });
    }
  }

 this.onConnect = function(two_factor_code) {
    steamUser.logOn({
      account_name: config.steam.username,
      password: config.steam.password,
      two_factor_code: two_factor_code
    });
  }

  this.sendMessage = function(person, msg) {
    var message = util.format(config.dota2.message_format, person, msg);
    dotaClient.sendMessage(config.dota2.channel, message);
  }

  this.start = function() {
    if (config.steam.two_factor) {
      prompt.start();
      prompt.get(['two_factor_code'], function(err, result) {
        this.connect(result.two_factor_code);
      }.bind(this));
    } else {
      this.connect(null);
    }
  }
}
