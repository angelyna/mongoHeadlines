var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

var Note = mongoose.model("Note", NoteSchema);

module.exports = Note;