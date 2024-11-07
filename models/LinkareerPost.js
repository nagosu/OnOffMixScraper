const { default: mongoose } = require('mongoose');

const linkareerPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  'LinkareerPost',
  linkareerPostSchema,
  'linkareer'
);
