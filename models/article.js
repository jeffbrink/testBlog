const mongoose = require("mongoose");
const { marked } = require("marked");
const slug = require("slugify");
// this is how you get just the JSDOM portion of the npm package
const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const purify = createDOMPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  markdown: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  slug: {
    type: String,
    required: true,
    // Will make this unique per article
    unique: true,
  },

  sanitizedHTML: {
    type: String,
    required: true,
  },
});

articleSchema.pre("validate", async function (next) {
  if (this.title) {
    this.slug = await slug(this.title, { lower: true, strict: true });
  }
  // next()
  
  if (this.markdown) {
    // this converts markdown to html then purifies it
    this.sanitizedHTML = purify.sanitize(marked(this.markdown));
  }
});

module.exports = mongoose.model("Article", articleSchema);
