const { ContextMenuCommandBuilder, hyperlink, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, IntegrationApplication, AttachmentBuilder } = require("discord.js");
const { ApplicationCommandType } = require('discord-api-types/v10');
const allah = require("../../../../../../config.json");
const Canvas = require("canvas");
const conf = require("../../../../src/configs/sunucuayar.json");
const voiceUserParent = require("../../../../src/schemas/voiceUserParent");
const messageUser = require("../../../../src/schemas/messageUser");
const voiceUser = require("../../../../src/schemas/voiceUser"); 
const toplams = require("../../../../src/schemas/toplams");
const inviterSchema = require("../../../../src/schemas/inviter");
const moment = require('moment');
require("moment-duration-format");
moment.locale('tr');

const { registerFont } = require("canvas");
registerFont('./MarlinGeo-Black.otf', { family: 'Marlin Geo Black' })

const axios = require('axios');
const fetch = require('node-fetch')

module.exports = {
    data: new ContextMenuCommandBuilder()
    .setName('İstatistik Bilgileri')
    .setType(ApplicationCommandType.User),

    async execute(interaction, client) {

        const member = await client.guilds.cache.get(allah.GuildID).members.fetch(interaction.targetId)
        const messageData = await messageUser.findOne({ guildID: interaction.guild.id, userID: interaction.targetId });
        const voiceData = await voiceUser.findOne({ guildID: interaction.guild.id, userID: interaction.targetId });
        const messageWeekly = messageData ? messageData.weeklyStat : 0;
        const messageDaily = messageData ? messageData.dailyStat : 0;
     
        const toplamData = await toplams.findOne({ guildID: interaction.guild.id, userID: interaction.targetId });
    
    
    const inviterData = await inviterSchema.findOne({ guildID: interaction.guild.id, userID: interaction.targetId });
        const total = inviterData ? inviterData.total : 0;
    
            const category = async (parentsArray) => {
            const data = await voiceUserParent.find({ guildID: interaction.guild.id, userID: interaction.targetId });
            const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
            let voiceStat = 0;
            for (var i = 0; i <= voiceUserParentData.length; i++) {
              voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
            }
            return moment.duration(voiceStat).format("H [saat], m [dk]");
          };
          
           
      const applyText = (canvas, text) => {
        const ctx = canvas.getContext('2d');
    
        let fontSize = 70;
    
        do {
            ctx.font = `${fontSize -= 10}px sans-serif`;
        } while (ctx.measureText(text).width > canvas.width - 300);
    
        return ctx.font;
    };
    const canvas = Canvas.createCanvas(600, 700);
    const ctx = canvas.getContext('2d');
    
     let Jaylen = ['https://media.discordapp.net/attachments/938786568175513660/938786691202830386/Untitled_design.png?width=405&height=473','https://media.discordapp.net/attachments/938786568175513660/938786691559358474/Untitled_design_1.png?width=405&height=473','https://media.discordapp.net/attachments/938786568175513660/938786703093694464/Untitled_design_3.png?width=405&height=473','https://media.discordapp.net/attachments/938786568175513660/938786703362097172/Untitled_design_4.png?width=405&height=473']
     let ozi = Math.floor((Math.random() * Jaylen.length));
    
        const background = await Canvas.loadImage(Jaylen[ozi]);  
        ctx.save();
        roundedImage(ctx, 0, 0, 600, 700, 50);
        ctx.clip();
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.closePath();
    
        ctx.strokeStyle = '#ffffff';
        ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
      const yazı = [] 
      if(member.user.username.length > 8) {
        let yarrak = member.user.username.slice(0, 8)
         yazı.push(`${yarrak}...`)  
            } else {
        yazı.push(`${member.user.username}`)
                }
     
    
        ctx.font = '34px "Marlin Geo Black"',
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`${yazı} Sunucu Verileri`, canvas.width / 6.7, canvas.height / 3.7);
    
        ctx.font = '30px "Marlin Geo Black"',
        ctx.fillStyle = '#e0e0e0';
        ctx.fillText(`Ses & Yazı İstatistikleri`, canvas.width / 4.6, canvas.height / 3.05);
    
        ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`◂ Toplam: ${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dk]")}.Ses & ${messageData ? messageData.topStat : 0} Yazı ▸`, canvas.width / 6.7, canvas.height / 2.67);
        ////////////////bitiş////////////////////////////////////////////////
      //////////////////public odalar////////////////
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Public Kanallar:`, canvas.width / 15, canvas.height / 2.30);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Streamer Odalar:`, canvas.width / 15, canvas.height / 2.03);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Kayıt Odaları:`, canvas.width / 15, canvas.height / 1.82);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Secret of Immortal:`, canvas.width / 15, canvas.height / 1.65);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Alone of Immortal:`, canvas.width / 15, canvas.height / 1.50);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Terapi/Sorun Çözme Odaları:`, canvas.width / 15, canvas.height / 1.37);
    
      ctx.font = '24px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`   Yazı İstatistiği:`, canvas.width / 15, canvas.height / 1.24);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Haftalık Yazı:`, canvas.width / 15, canvas.height / 1.16);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`  ▸ Günlük Yazı:`, canvas.width / 15, canvas.height / 1.10);
    
      /////////////////////////////////////////////////////////////////////
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.publicParents)}.`, canvas.width / 1.45, canvas.height / 2.30);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.funParents)}.`, canvas.width / 1.45, canvas.height / 2.05);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.registerParents)}.`, canvas.width / 1.45, canvas.height / 1.82);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.privateParents)}.`, canvas.width / 1.45, canvas.height / 1.65);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.aloneParents)}.`, canvas.width / 1.45, canvas.height / 1.50);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${await category(conf.solvingParents)}.`, canvas.width / 1.45, canvas.height / 1.37);
     
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${Number(messageWeekly).toLocaleString()} Yazı`, canvas.width / 1.45, canvas.height / 1.16);
    
      ctx.font = '20px "Marlin Geo Black"',
      ctx.fillStyle = '#e0e0e0';
      ctx.fillText(`${Number(messageDaily).toLocaleString()} Yazı`, canvas.width / 1.45, canvas.height / 1.10);
    
      ////////////////bitiş////////////////////////////////////////////////  
    const avatar = await Canvas.loadImage(member.displayAvatarURL({ extension: 'png' }));
      ctx.save();
      roundedImage(ctx, 235, 25, 125, 125, 25);
      ctx.clip();
      ctx.drawImage(avatar, 235, 25, 125, 125);
      ctx.closePath();
    
        // Clip off the region you drew on
        ctx.clip();
     
      function roundedImage(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
      
      const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'cyr0nix-Stats.png'});
      interaction.reply({ content:`> **[** \`${member.user.tag}\` **]** kullanıcısının sunucu veri kartı!`, files:  [attachment], ephemeral: true })
    
    },
};