import fs from "fs";
import path from "path";

const SourceDirectory = "./nfts/";
const DestinationDirectory = "./assets/";

const RequiredImages = [];
const RequiredJsons = [];

fs.readdirSync(SourceDirectory).forEach((file) => {
  let fileType = path.extname(file);
  if (fileType == ".png") {
    RequiredImages.push("./nfts/" + file);
    RequiredJsons.push("./nfts/" + file.replace(fileType, ".json"));
  }
});

for (let assetsIndex = 0; assetsIndex < RequiredImages.length; assetsIndex++) {
  let jsonFile = fs.readFileSync(RequiredJsons[assetsIndex], {
    encoding: "utf8",
  });
  jsonFile = JSON.parse(jsonFile)
  let imageFile = RequiredImages[assetsIndex];

  let jsonObj = {
    name: jsonFile.name,
    symbol: "SOL",
    description: jsonFile.description,
    image: `${assetsIndex}.png`,
    attributes: jsonFile.attributes ? jsonFile.attributes : [],
    properties: {
      files: [
        {
          uri: `${assetsIndex}.png`,
          type: "image/png",
        },
      ],
    },
  };
  fs.writeFileSync(DestinationDirectory+assetsIndex+".json", JSON.stringify(jsonObj), {encoding: "utf8"})
  fs.copyFileSync(imageFile, DestinationDirectory+assetsIndex+".png")
}
