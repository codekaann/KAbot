const Discord = require(`discord.js`);

exports.run = (client, message, args) => {
 let mesaj = args.slice(0).join(' ');
 let member = message.mentions.members.first();
 let body = 'https://mc-heads.net/body/' + mesaj
 if (mesaj.length < 1) return message.reply('bir oyuncu adı belirtmelisin.');
 if (mesaj == member) {
    message.reply('kullanıcı değil, bir oyuncu adı belirtmelisin :/')
 } else {
 const mcbody = new Discord.MessageEmbed()
   .setColor('BLURPLE')
   .setTitle('<:risingnetwork:925348747427328010> Oyuncu: ' + mesaj)
   .setImage(body)
 message.channel.send(mcbody);
 }
};

exports.conf = {
 enabled: true,
 guildOnly: false,
 aliases: ["mcskin"],
 permLevel: 0
};

exports.help = {
 name: 'mcbody',
 description: 'Belirtilen oyuncunun kostümünü gösterir.',
 usage: 'mcbody '
};