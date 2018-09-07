const csv = require("csvtojson");
const fs = require("fs");
const csvFilePath = "./data.csv";

csv()
  .fromFile(csvFilePath)
  .then(data => {
    const santitized = data.map(point => {
      const latLong = point.Location.match(
        /(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/g
      );

      if (latLong) {
        point.Location = latLong[0];
      } else {
        point.Location = null;
      }

      return point;
    });

    const hasLatLong = data.filter(point => point.Location);
    console.log(`${hasLatLong.length} points with lat/long`);
    const noLatLong = data.filter(point => !point.Location);
    console.log(`${noLatLong.length} points without lat/long`);

    fs.writeFile(
      "points_with_coords.json",
      JSON.stringify(hasLatLong),
      "utf8",
      () => {}
    );
    fs.writeFile(
      "points_without_coords.json",
      JSON.stringify(noLatLong),
      "utf8",
      () => {}
    );
  });
