const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const moment = require('moment');
var Jimp = require('jimp');
const { Client, Util } = require('discord.js');
const fs = require('fs');
const db = require('quick.db');
const http = require('http');
const express = require('express');
require('./util/eventLoader.js')(client);
const path = require('path');
const snekfetch = require('snekfetch');

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + "7/24 AKTİF TUTMA İŞLEMİ BAŞARILI");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
    console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
    if (err) console.error(err);
    log(`${files.length} komut yüklenecek.`);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        log(`Yüklenen komut: ${props.help.name}.`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });
});


client.reload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.load = command => {
    return new Promise((resolve, reject) => {
        try {
            let cmd = require(`./komutlar/${command}`);
            client.commands.set(command, cmd);
            cmd.conf.aliases.forEach(alias => {
                client.aliases.set(alias, cmd.help.name);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};




client.unload = command => {
    return new Promise((resolve, reject) => {
        try {
            delete require.cache[require.resolve(`./komutlar/${command}`)];
            let cmd = require(`./komutlar/${command}`);
            client.commands.delete(command);
            client.aliases.forEach((cmd, alias) => {
                if (cmd === command) client.aliases.delete(alias);
            });
            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

client.elevation = message => {
    if (!message.guild) {
        return;
    }
    let permlvl = 0;
    if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
    if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
    if (message.author.id === ayarlar.sahip) permlvl = 4;
    return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on('warn', e => {
    console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
    console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

client.login(process.env.token);

// -------KOMUTLAR------- //

const database = require("quick.db");

const logs = require('discord-logs');
logs(client);

client.on("guildMemberOnline", (member, newStatus) => {
  if(member.user.bot) return
  database.set(`Member.${member.user.id}`, Date.now())
});

client.on("guildMemberOffline", (member, oldStatus) => {
  if(member.user.bot) return
  database.set(`Member2.${member.user.id}`, Date.now())
});

//uarı
const { MessageEmbed } = require('discord.js');
var prefix = "!";
var moment_tz = require('moment-timezone');
var { JsonDatabase } = require('quick.db');

client.on("message", message => {
    let cmd = message.content.split(" ")[0].slice(prefix.length);
    let args = message.content.split(" ").slice(1);
    var yetki = message.member.permissions.has("ADMINISTRATOR");

    const embed = new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL());
    const LOG_EMBED = new MessageEmbed().setAuthor(message.author.tag, message.author.displayAvatarURL()).setColor("YELLOW").setThumbnail("https://cdn.glitch.com/69e450d8-a7a3-438c-900f-bb67ebdbdb9d%2Fmail.png?v=1623432905977");

    if (cmd == "uyarı") {

        // OTOMATIK KURULUM
        if (!db.fetch(`uyari_sistemi.${message.guild.id}`)) {
            db.set(`uyari_sistemi.${message.guild.id}`, {
                log: null,
                max: 5,
                users: {}
            });
        }

        if (args[0] == "log") {
            if (!yetki) return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, bu işlemi yapmak için gerekli yetkin yok!`));

            var kanal = message.mentions.channels.first();
            if (!kanal) return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, bir kanal etiketlemen gerekli!`));
            db.set(`uyari_sistemi.${message.guild.id}.log`, kanal.id);
            return message.channel.send(embed.setColor("GREEN").setDescription(`<@${message.author.id}>, log kanalı <#${kanal.id}> olarak ayarlandı!`));
        } else if (args[0] == "ban" && args[1] == "limit") {
            if (!yetki) return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, bu işlemi yapmak için gerekli yetkin yok!`));

            var limit = db.fetch(`uyari_sistemi.${message.guild.id}.max`);
            var new_limit = Number(args[2]);
            if (!new_limit || typeof new_limit != "number") return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, limit ayarlamak için bir rakam girmen gerekli!`));
            db.set(`uyari_sistemi.${message.guild.id}.max`, new_limit);
            return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, uyası sistemi ban limiti ${limit} uyarıdan ${new_limit} uyarıya yükseltildi!`));
        } else if (args[0] == "uyar") {
            if (!yetki) return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, bu işlemi yapmak için gerekli yetkin yok!`));

            var user = message.mentions.users.first();
            if (!user) return message.channel.send(embed.setColor("RED").setDescription(`<@${message.author.id}>, bir kullanıcı etiketlemen gerekli!`));
            db.push(`uyari_sistemi.${message.guild.id}.users.${user.id}`, {
                reason: args.length >= 3 ? args.slice(2).join(' ') : 'SEBEP BELIRTILMEMIS',
                moderator: {
                    id: message.author.id,
                    tag: message.author.tag
                },
                date: moment_tz.tz('ASIA/ISTANBUL').format('DD/MM/YYYY HH:mm:ss')
            });
            var limit = db.fetch(`uyari_sistemi.${message.guild.id}.max`) || 0;
            var warns = (db.fetch(`uyari_sistemi.${message.guild.id}.users.${user.id}`) || []).length;
            message.channel.send(embed.setColor("GREEN").setDescription(`<@${message.author.id}>, <@${user.id}> kişisini uyardım! (${warns}${limit == 0 ? '' : `/${limit}`})`));

            var log = db.fetch(`uyari_sistemi.${message.guild.id}.log`);
            if (log) log = client.channels.cache.get(log);
            if (log) log.send(LOG_EMBED.setDescription(`<@${user.id}> kullanıcısı <@${message.author.id}> tarafından uyarıldı, toplam ${warns} uyarısı var${warns >= limit ? ', kullanıcı limiti aştığı için banlandı' : ''}!`));

            if (warns >= limit) return message.guild.members.cache.get(user.id).ban({ reason: "ardaiisteaq @ Uyarı Sistemi ile limit aşıldığı için otomatik banlandı!" });
        } else if (args[0] == "liste") {
            var user = message.mentions.users.first() || message.author;
            var warns = (db.fetch(`uyari_sistemi.${message.guild.id}.users.${user.id}`) || []);
            return message.channel.send(embed.setColor("GREEN").setDescription(`<@${message.author.id}>, <@${user.id}> kullanıcısının uyarıları: (${warns.length})\n\`\`\`\n${warns.length > 0 ? warns.map((e, i) => `${i + 1}. ${e.reason} (${e.moderator.tag} ~ ${e.date})`).join('\n') : "Hiç uyarın yok!"}\n\`\`\``));
        } else {
            return message.channel.send(embed.setColor("GREEN").setDescription(`<@${message.author.id}>, işte uyarı komutları:\n\`\`\`\n${prefix}uyarı ban limit <limit>\n${prefix}uyarı log <#kanal>\n${prefix}uyarı uyar <@kullanıcı>\n${prefix}uyarı liste <@kullanıcı>\n\`\`\``));
        }

    }
});
//uarı
//radyo

async function RadioRepeater() {//hamzamertakbaba#3575
  let Channel = client.channels.cache.get("925337027627601931");
  var streamURL = "http://fenomen.listenfenomen.com/fenomen/256/icecast.audio";
  if(!Channel) return;
   await Channel.leave();
   Channel.join().then(connection => {
    const dispatcher = connection.play(streamURL);
    dispatcher.setVolume(100/100) //Radyonun sesini ayarlarsınız. Değiştirmek isterseniz en soldakini değiştirin. Örnek olarak: dispatcher.setVolume(50/100)

});
};

client.on('ready', () => {//hamzamertakbaba#3575
  RadioRepeater()
  setInterval(RadioRepeater, Math.max(3600000))
  let Channel = client.channels.cache.get("925337027627601931")
  if(!Channel) return;
    var streamURL = "http://fenomen.listenfenomen.com/fenomen/256/icecast.audio";
     
    
           Channel.join().then(connection => {
              const dispatcher = connection.play(streamURL);
              dispatcher.setVolume(75/100) //Radyonun sesini ayarlarsınız. Değiştirmek isterseniz en soldakini değiştirin. Örnek olarak: dispatcher.setVolume(50/100)
      
          });
  });

//radyo
//girişcikis
let kanal = "911966446874161183"
let sunucu = "837424140155093004"

client.on('guildMemberAdd', async member  => {
  if(member.guild.id!= sunucu) return false;
  const embed = new Discord.MessageEmbed()
  .setTitle(`Hoş Geldiniz!`)
  .setColor(`BLURPLE`)
  .setDescription(`Sunucumuza hoş geldin ${member}`)
  client.channels.cache.get(kanal).send(embed)
  });

  client.on('guildMemberRemove', async member  => {
    if(member.guild.id!= sunucu) return false;
    const embed = new Discord.MessageEmbed()
    .setTitle(`Güle Güle!`)
    .setColor(`BLURPLE`)
    .setDescription(`${member} aramızdan ayrıldı`)
    client.channels.cache.get(kanal).send(embed)
    });
//girişcikis
client.on('ready', () => require('quick.db').set('start', Date.now()))
//
client.on("guildMemberAdd", member => {

const kevzyy = new kevzyy.MessageEmbed()
.setColor('BLURPLE')
.setTitle('Hoşgeldin')
.setDescription('Ben **KAbot** RisingNetwork minecraft sunucusunda yardımcı botum.\n Sunucumuzun ipsi: __play.risingnetwork.xyz__ \n Sunucunun durumunu görüntülemek için: __!risingnetwork__')//buraya ne yazmasını istiyorsanız onu yazın
member.send(kevzyy)
})

client.on('message', async msg => {
  if(msg.content == `<@!789069072637231105>`) return msg.channel.send(`> <:risingnetwork:925348747427328010> Selam, ben **KAbot** RisingNetwork minecraft sunucusunda yardımcı bot olarak <@!545651586559377410> tarafından kodlandım.\n > <:risingnetwork:925348747427328010> Sunucumuzun ipsi: __play.risingnetwork.xyz__ \n > <:risingnetwork:925348747427328010> Sunucunun durumunu görüntülemek için: __!risingnetwork__`);
});
//
