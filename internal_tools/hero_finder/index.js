const fetch = require("node-fetch");
const prompt = require("prompt");
let data = require("../history_image_grabber/points_with_coords.json");

data = data.reverse();

const flickrKey = "87647f3d2d34efc07c027860cba76938";

prompt.start();

const request = point =>
  new Promise((resolve, reject) => {
    console.log(
      point.PID,
      "|",
      `./src/assets/historic_images/${point.PID}.jpg`,
      "|",
      `https://www.google.com.au/search?as_st=y&tbm=isch&hl=en&as_q=${encodeURIComponent(
        point.Title
      )}&as_epq=&as_oq=&as_eq=&cr=&as_sitesearch=&safe=images&tbs=sur:f
      
      
      
      `
    );

    prompt.get(["continue?"], function(err, result) {
      resolve();
    });
  });

const starter = async () => {
  for (i = 0; i < data.length; i++) {
    const point = data[i];

    await request(point);
  }
};

starter();
