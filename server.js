const express = require("express");
const mongoose = require("mongoose");
const articleRouter = require("./routes/articles");
const Article = require("./models/article");
const methodOverride = require("method-override");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://mercury2768:1UDSMuCc2ixEwf6R@cluster0.4pgrxq0.mongodb.net/newDB?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("database connection successful, Jeff");
  } catch (err) {
    console.log(err);
  }
}


app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
main();

app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: -1 });

  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(port, () => console.log(`Blog app listening on port ${port}!`));
