const mongoose = require("mongoose");
const cheerio = require("cheerio");
const request = require("request-promise");
const RedditArticle = require("./RedditArticle");

async function connectToMongoDB() {
  console.log("here");
  await mongoose.connect(
    "mongodb+srv://<username>:<password>@redditscraper-kjt5z.mongodb.net/test?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  );

  console.log("mongoDB is connected");
}

async function scrapeReddit() {
  const html = await request.get("https://www.reddit.com/");
  const $ = await cheerio.load(html);
  //   const title = $("h2");
  const title = $(" div > div > div > a > div > h3");

  title.each(async (i, element) => {
    try {
      const title = $(element).text();
      console.log("title", title);
      const redditArticle = new RedditArticle({
        title
      });
      await redditArticle.save();
    } catch (err) {
      console.log(err);
    }
  });
}

async function main() {
  await connectToMongoDB();
  await scrapeReddit();
}

main();
