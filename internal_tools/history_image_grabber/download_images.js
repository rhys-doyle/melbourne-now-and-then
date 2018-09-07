const fs = require("fs");
const request = require("request");
const data = require("./points_with_coords.json");

const download = async (uri, filename) =>
  new Promise((resolve, reject) => {
    request.head(uri, (err, res, body) => {
      console.log(
        "content-type:",
        res.headers["content-type"],
        "content-length:",
        res.headers["content-length"]
      );

      if (err) {
        reject();
      }

      request(uri)
        .pipe(fs.createWriteStream(filename))
        .on("close", () => {
          resolve();
        });
    });
  });

const starter = async () => {
  for (i = 0, j = data.length; i < j; i += 1) {
    const point = data[i];

    await download(
      point["Digital URI"],
      `./src/assets/historic_images/${point.PID}.jpg`
    );
    console.log(`${(i / data.length) * 100}%`);
  }
};

starter();
