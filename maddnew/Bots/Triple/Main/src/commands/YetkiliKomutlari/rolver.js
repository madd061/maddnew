const { PermissionsBitField } = require("discord.js");
const conf = require("../../../../src/configs/sunucuayar.json")
const { maddxRed, maddxTik } = require("../../../../src/configs/emojis.json")
const ayar = require("../../../../src/configs/ayarName.json");
module.exports = {
  conf: {
    aliases: ["rolver","rol-ver","r"],
    name: "rolver",
    help: "rolver <madd/ID> <Role/ID>",
    category: "yetkili",
  },

  run: async (client, message, args, embed) => {
    let kanallar = ayar.KomutKullanımKanalİsim;
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && !kanallar.includes(message.channel.name)) return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.`}).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
    if(!conf.rolverici.some(oku => message.member.roles.cache.has(oku)) && !conf.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {
    message.reply({ content:`Malesef yetkin bulunmamakta dostum.`}).then((e) => setTimeout(() => { e.delete(); }, 5000));
    return }

    if (!args[0]) return message.reply({ content:`${maddxRed} Kullanımı: !r al/ver Kullanıcı Rol`})
    if (args[0] != "al") {
        if (args[0] != "ver") {
            return message.reply({ content:`${maddxRed} Kullanımı: !r al/ver Kullanıcı Rol`})
        }
    }

    if (!args[1]) return message.reply({ content:`${maddxRed} Bir üye etiketle ve tekrardan dene!`})
    let rMember = message.mentions.members.first() || message.guild.members.cache.get(args[1])
    if (!rMember) return message.reply({ content:`${maddxRed} Bir üye etiketle ve tekrardan dene!`})

    if (!args[2]) return message.reply({ content:`${maddxRed} Rolü belirtmelisin.`})
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2])
        if (!role) return message.reply({ content:`${maddxRed} Belirtmiş olduğun rolü bulamadım ! Düzgün bir rol etiketle veya ID belirtip tekrar dene.`})
        if (message.member.roles.highest.rawPosition <= role.rawPosition) return message.reply({ content:`${maddxRed} Kendi rolünden yüksek veya eşit bir rolle işlem yapamazsın.`})
       

        if (args[0] == "al") {
          if (rMember.roles.cache.has(role.id)) {
            rMember.roles.remove(role.id)
            message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinden ${role} rolünü aldım.`)]})
          } else {
            message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinde ${role} rolü mevcut değil.`)]})
          }
      }
      if (args[0] == "ver") {
          if (!rMember.roles.cache.has(role.id)) {
            rMember.roles.add(role.id)
            message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisine ${role} rolünü ekledim.`)]})
          } else {
            message.reply({ embeds: [embed.setThumbnail(message.author.avatarURL({dynamic: true, size: 2048})).setDescription(`${rMember} Kişisinde ${role} rolü zaten mevcut.`)]})
          }
      }
   },
 };
