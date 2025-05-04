const { ozi } = require('./Voices.Global.Client');
const { ActivityType } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const mongoose = require('mongoose');
const allah = require('./../../config.json');

mongoose.set("strictQuery", true);
mongoose.connect(allah.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("[MongoDB] Bağlantı kuruldu."))
  .catch((err) => console.error("[MongoDB] Bağlantı hatası:", err));

const cron = require('node-cron');
const children = require("child_process");
const Database = require("./WelcomeMode");

for (let index = 0; index < allah.Welcome.Tokens.length; index++) {
    let token = allah.Welcome.Tokens[index];
    let channel = allah.Welcome.Channels < 1 ? allah.Welcome.Channels[0] : allah.Welcome.Channels[index];

    if (channel) {
        let client = new ozi();

        client.login(token).catch(err => {
            console.log(`${index + 1}. Satırdaki Token Arızalı!`);
        });

        client.on("voiceStateUpdate", async (oldState, newState) => {
            if (oldState.member.id === client.user.id && oldState.channelId && !newState.channelId) {
                let activities = allah.BotDurum, i = 0;
                setInterval(() => client.user.setActivity({
                    name: `${activities[i++ % activities.length]}`,
                    type: ActivityType.Watching
                }), 10000);
                client.user.setStatus("idle");

                let guild = client.guilds.cache.get(allah.GuildID);
                if (!guild) return console.log("sunucu yok!");
                let Channel = global.Voice = guild.channels.cache.get(channel);
                if (!Channel) return console.log("channel yok");

                client.voiceConnection = joinVoiceChannel({
                    channelId: Channel.id,
                    guildId: Channel.guild.id,
                    adapterCreator: Channel.guild.voiceAdapterCreator,
                    group: client.user.id
                });
            }
        });

        client.on('ready', async () => {
            console.log(`${client.user.tag}`);
            let activities = allah.BotDurum, i = 0;
            setInterval(() => client.user.setActivity({
                name: `${activities[i++ % activities.length]}`,
                type: ActivityType.Listening
            }), 10000);
            client.user.setStatus("online");

            let guild = client.guilds.cache.get(allah.GuildID);
            if (!guild) return console.log("sunucu yok!");
            let Channel = global.Voice = guild.channels.cache.get(channel);
            if (!Channel) return console.log("channel yok");

            client.voiceConnection = joinVoiceChannel({
                channelId: Channel.id,
                guildId: Channel.guild.id,
                adapterCreator: Channel.guild.voiceAdapterCreator,
                group: client.user.id
            });

            const connection = getVoiceConnection(allah.GuildID);
            if (!connection) {
                setInterval(() => {
                    joinVoiceChannel({
                        channelId: Channel.id,
                        guildId: Channel.guild.id,
                        adapterCreator: Channel.guild.voiceAdapterCreator,
                        group: client.user.id
                    });
                }, 5000);
            }

            while (mongoose.connection.readyState !== 1) {
                console.log("Mongo bağlantısı bekleniyor...");
                await new Promise(r => setTimeout(r, 500));
            }

            const data = await Database.findOne({ guildID: allah.GuildID });
            const xd = "./src/sesler/cuma.mp3";
            const xd2 = "./src/sesler/hosgeldin.mp3";

            cron.schedule('* * * * 5', async () => {
                const today = new Date().getDay();
                const isFriday = today === 5;

                const newSesMod = isFriday ? xd : xd2;
                if (data && data.SesMod === newSesMod) return;

                await Database.findOneAndUpdate(
                    { guildID: allah.GuildID },
                    { SesMod: newSesMod },
                    { upsert: true }
                );

                console.log(`Ses modu ${isFriday ? "Cuma" : "Hoş geldin"} olarak ayarlandı.`);
                children.exec(`pm2 restart ${allah.GuildName}_Welcomes`);
            });

            if (!Channel.hasStaff()) await client._start(channel);
            else {
                client.staffJoined = true;
                client.playing = false;
                await client._start(channel);
            }
        });

        client.on('voiceStateUpdate', async (oldState, newState) => {
            if (
                newState.channelId &&
                (oldState.channelId !== newState.channelId) &&
                newState.member.isStaff() &&
                newState.channelId === channel &&
                !newState.channel.hasStaff(newState.member)
            ) {
                client.staffJoined = true;
                client.player.stop();
                return;
            }

            if (
                oldState.channelId &&
                (oldState.channelId !== newState.channelId) &&
                newState.member.isStaff() &&
                oldState.channelId === channel &&
                !oldState.channel.hasStaff()
            ) {
                client.staffJoined = false;
                client._start(channel, true);
                return;
            }
        });
    }
}