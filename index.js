const express = require("express");
const cheerio = require("cheerio");
const request = require("request");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(path.join("uploads")));

app.post("/getFile", (req, res) => {
  const { name } = req.body;
  const params = name[0].toUpperCase();
  const url = `https://en.wikipedia.org/wiki/${params}`;
  request(url, function (error, response, html) {
    console.error("error:", error); 
    file(html);
  });

  function file(html) {
    const $ = cheerio.load(html);
    var obj = [];
    const data = $(".mw-parser-output h2");
    const titleDescription = $(".sidebar.nomobile.nowraplinks")
      .next("p")
      .text();
    obj.push({
      Heading: params,
      Description: titleDescription,
    });
    for (let i = 1; i < 4; i++) {
      var heading = $(data[i]).text();
      var paragraph = $(data[i])
        .nextUntil(data[i + 1], "p,h3,ul")
        .text();
      obj.push({
        Heading: heading,
        Description: paragraph,
      });
    }
    obj = JSON.stringify(obj);
    writeToFile(obj);
  }
  function writeToFile(obj) {
    let newWorkbook = xlsx.utils.book_new();
    var myJsonString = JSON.parse(obj);
    let newSheet = xlsx.utils.json_to_sheet(myJsonString);
    xlsx.utils.book_append_sheet(newWorkbook, newSheet, "sheet-1");
    xlsx.writeFile(newWorkbook, "./uploads/scrapped.xlsx");
  }
  res.send({
    path: "uploads/scrapped.xlsx",
  });
});
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log("server started on port" + port);
});
