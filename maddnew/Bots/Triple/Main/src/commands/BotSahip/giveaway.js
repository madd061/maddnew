const { PermissionsBitField, ButtonStyle, Discord, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const allah = require("../../../../../../config.json");
const giveaway = require('../../../../src/schemas/giveaway.js')
const { maddxTik, maddxRed, maddxCekilis, maddxOk, maddxRevu, maddxTac, maddxSaat } = require("../../../../src/configs/emojis.json")
const moment = require("moment");
const ms = require("ms")

module.exports = {
  conf: {
    aliases: ["giveaway", "gstart", "ç"],
    name: "çekiliş",
    help: "çekiliş 10m 1 Netflix",
    category: "sahip"
  },

  run: async (client, message, args) => {
    // İzin kontrolü
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages) &&
        !message.member.roles.cache.some(r => r.name === "Sponsor")) {
        return message.reply({ content: "Çekiliş başlatmak için gerekli izinlere sahip değilsiniz." });
    }

    let user = message.author;

    let zaman = args[0]
    let kazanan = args[1]
    let odul = args.slice(2).join(" ");
    if (!zaman || !kazanan || isNaN(kazanan) || kazanan < 1 || !odul) {
        return message.reply({ content: "Komutu doğru şekilde kullanın: `.çekiliş 10m 1 Netflix`" });
    }

    client.giveawaysManager.start(message.channel, {
        duration: ms(zaman),
        prize: `Ödül: ${odul}`,
        winnerCount: parseInt(kazanan),
        hostedBy: message.author,
        messages: {
            giveaway: `${maddxCekilis} **ÇEKİLİŞ** ${maddxCekilis}`,
            giveawayEnded: `${maddxCekilis} **ÇEKİLİŞ SONLANDI** ${maddxCekilis}`,
            drawing: `${maddxSaat} Kalan süre: **{timestamp}**! \n`,
            inviteToParticipate: `${maddxOk} Çekilişe Katılmak için ${maddxCekilis} emojisine tıklayın! \n`,
            winMessage: `${maddxRevu} **Tebrikler**, {winners} **__{this.prize}__ Kazandın!**`,
            embedFooter: `{this.winnerCount} kazanan`,
            noWinner: "Çekiliş iptal edildi, geçerli katılım yok.",
            hostedBy: `${maddxTac} Başlatan: ${user} \n`,
            winners: `${maddxCekilis} kazananlar \n`,
            endedAt: "Çekiliş Süresi Doldu!"
        }
    }).catch((err) => {
        console.error(err);
        message.channel.send("Çekilişi başlatırken bir hata oluştu.");
    });
},
};
