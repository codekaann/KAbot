const Discord = require("discord.js");
const fetch = require("node-fetch");

exports.run = async (client, message, args) => {//hamzamertakbaba#3361

    const API = await fetch(`http://mcapi.tc/?play.risingnetwork.xyz/json`)
    const Data = await API.json();
    if (Data.status === "offline") {
        const embed2 = new Discord.MessageEmbed()
            .setColor("RED")
            .setDescription(`IP adresine bağlı olan sunucu aktif değil.`)
        message.channel.send(embed2)
    } else {
        const embed = new Discord.MessageEmbed()
            .setColor("BLURPLE")
            .setTitle("Rising Network")
            .addField(`<:risingnetwork:925348747427328010> Sunucu IP Adresi`, `play.risingnetwork.xyz`, true)
            .addField(`<:risingnetwork:925348747427328010> Ping`, Data.ping, true)
            .addField(`<:risingnetwork:925348747427328010> Oyuncu Sayısı`, `${Data.players}/${Data.max_players}`, true)
            .addField(`<:risingnetwork:925348747427328010> Versiyon`, Data.version, true)
            .setImage(`http://status.mclive.eu/KAbot/play.risingnetwork.xyz/25565/banner.png`)
        message.channel.send(embed)
    }

};
exports.conf = {// codare ♥
    enabled: true,
    guildOnly: false,
    aliases: ["risingnw", "risingnetwork"],
    permLevel: 0
};
exports.help = {// codare ♥
    name: 'minecraft-sunucu-bilgi',
};