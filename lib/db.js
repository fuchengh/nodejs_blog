const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
    Username: String,
    Password: String
});

let Blog = new Schema({
    Username: String,
    Article: String,
    CreatedAt: Date
});

let Comment = new Schema({
    Visitor: String,
    Comment: String,
    MessageId: Schema.Types.ObjectId,
    CreatedAt: Date
});

mongoose.model("User", User);
mongoose.model("Blog", Blog);
mongoose.model("Comment", Comment);
mongoose.connect("mongodb://localhost/blog");