const Discord = require("discord.js");

exports.run = (client, message, args) => {
  if (message.channel.type == "dm") return;
  if (message.channel.type !== "text") return;

  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`Bu komutu kullanabilmek için **Mesajları Yönet** iznine sahip olmalısın!`).then(m => m.delete({ timeout: 10000}));

  message.delete();

  let question = args.join(" ");

  let user = message.author.username;

  if (!question) return message.channel.send(new Discord.MessageEmbed().setTitle(`:x:yazı yazman gerek :x:`)).then(m => m.delete(({ timeout: 5000})));

  message.channel.send(new Discord.MessageEmbed()
        .setColor("BLURPLE")
        .setTitle('<:risingnetwork:925348747427328010> **Değerlendirme.** :face_with_monocle:')
        .setThumbnail(client.user.avatarURL())
        .setTimestamp()
        .setFooter("KAbot", client.user.avatarURL())
        .setDescription(`
        ${question}`)
    )
    .then(function(message) {
      message.react("✅");
      message.react("❌");
    message.channel.send('Oylayın :slight_smile: @everyone')
    });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["oy"],
  permLevel: 0
};

exports.help = {
  name: "oylama",
  description: "Oylama yapmanızı sağlar.",
  usage: ".oylama "
};
