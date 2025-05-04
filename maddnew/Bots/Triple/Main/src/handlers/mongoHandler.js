const mongoose = require("mongoose");
const allah = require("../../../../../config.json");

// Mongoose ayarları
mongoose.set('strictQuery', true);
mongoose.connect(allah.mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB bağlantı olayları
mongoose.connection.on("connected", () => {
  console.log("Database bağlantısı tamamlandı!");
});
mongoose.connection.on("error", () => {
  console.error("[HATA] Database bağlantısı kurulamadı!");
});

// Vote şeması tanımı
const voteSchema = new mongoose.Schema({
  user_id: String,
  vote_count: Number, // örnek alan
});

// Model oluştur
const Vote = mongoose.model("Vote", voteSchema, "vote_schemas");

// Kullanıcıya göre veri çek
Vote.find({ user_id: "348810453478277131" }).then((results) => {
  console.log("Bulunan Oylar:", results);
}).catch((err) => {
  console.error("Hata oluştu:", err);
});
