const Discord = require('discord.js');
exports.run = async (app, message, client) => {
  
  const kinda = new Discord.MessageEmbed()

  .setColor("0x36393E")
  .setDescription('Sunucunun durumu ile ilgili bilgi toplanıyor...')
  
   let start = Date.now(); 
   let mesaj = await message.channel.send(kinda)
   let diff = (Date.now() - start); 
   let API = (app.ws.ping).toFixed(2)
    
    setInterval(() => {
  
   const only = new Discord.MessageEmbed()
  
   .setColor("RANDOM")
            .setTitle("Rising Network")
            .addField(`<:risingnetwork:925348747427328010> Sunucu IP Adresi`, `play.risingnetwork.xyz`, true)
            .setImage(`http://status.mclive.eu/KAbot/play.risingnetwork.xyz/25565/banner.png`)
   
    mesaj.edit(only);
   
    }, 5000)
  

 
 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['durum', 'risingdurum'],
  permLevel: 0
};

exports.help = {
  name: 'sunucudurum',
  description: 'Skorsky',
  usage: 'ping'
};