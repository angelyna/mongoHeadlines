var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  category: {
    type: String,
    required: true
  },
  timeStamp: {
    type: String,
    required: true
  },
  summary: {
    type: String,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },

  link: {
    type: String,
    required: true
  },
  saved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  // `note` is an object that stores a Note id
  // The ref property links the ObjectId to the Note model
  // This allows us to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;



