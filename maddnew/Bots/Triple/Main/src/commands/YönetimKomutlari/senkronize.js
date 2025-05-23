const coin = require("../../../../src/schemas/coin");
const { maddxRed } = require("../../../../src/configs/emojis.json")
const { MessageEmbed, PermissionsBitField } = require("discord.js");
module.exports = {
  conf: {
    aliases: ["senkron"],
    name: "senkronize",
    help: "senkronize [user] [kullanıcı] / [role] [rol]",
    category: "yönetim",
  },

  run: async (client, message, args, embed) => {
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.react(maddxRed)
    if (args[0] === "kişi" || args[0] === "user") {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]);
      if (!member) return message.channel.send({ embeds: [embed.setDescription("Bir kullanıcı belirtmelisin!")]})

      if (client.ranks.some(x => member.hasRole(x.role))) {
        let rank = client.ranks.filter(x => member.hasRole(x.role));
        rank = rank[rank.length-1];
        await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
        message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinde <@&${rank.role}> rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)]})
      } else return message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)]})
    } else if (args[0] === "role" || args[0] === "rol") {
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
      if (!role) return message.channel.send({ embeds: [embed.setDescription("Bir rol belirtmelisin!")]})
      if (role.members.length === 0) return message.channel.send({ embeds: [embed.setDescription("Bu rolde üye bulunmuyor!")]})
      role.members.forEach(async member => {
        if (member.user.bot) return;
        if (client.ranks.some(x => member.hasRole(x.role))) {
          let rank = client.ranks.filter(x => member.hasRole(x.role));
          rank = rank[rank.length-1]; 
          await coin.findOneAndUpdate({ guildID: message.guild.id, userID: member.user.id }, { $set: { coin: rank.coin } }, { upsert: true });
          message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinde <@&${rank.role}> rolü bulundu ve coini ${rank.coin} olarak değiştirildi!`)]})
        } else return message.channel.send({ embeds: [embed.setDescription(`${member.toString()} üyesinde sistemde ayarlı bir rol bulunamadı!`)]})
      });
    } else return message.channel.send({ embeds: [embed.setDescription("Bir argüman belirtmelisin!")]})
  }
};
