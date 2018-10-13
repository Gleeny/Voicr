const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true });

const channelSchema = mongoose.Schema({
  channelid: String,
  roleid: String
}, { minimize: false })

const Channel = mongoose.model("Channel", channelSchema);

module.exports = {
  getChannel: function(channelid) {
    return new Promise(function(resolve, reject) {
      Channel.findOne({
        channelid: channelid
      }, (err, channel) => {
        if (err) return reject(err);
        if (!channel) {
          let newChannel = new Channel({
            channelid: channelid,
            roleid: ""
          });
          
          return resolve(newChannel);
        } else return resolve(channel);
      })
    })
  },
  getChannelCount: function() {
    return new Promise(function(resolve, reject) {
      Channel.find({}, (err, channels) => {
        if (err) return reject(err);
        let count = 0;
        channels.forEach(channel => { if (channel.roleid) count += 1; })
        
        return resolve(count);
      })
    });
  }
}