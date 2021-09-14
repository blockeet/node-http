const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const modelSchema = new Schema(
  {
    username: String,
    email: String,
    password: String,
    create_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date'},
  }
);

module.exports = db.model('User', modelSchema)
