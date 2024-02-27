const copyfiles = require("copyfiles");

const ddd = [
  { inputFolder: './schematics/*/schema.json', outputFolder: './dist/hex-angular/' },
  { inputFolder: './schematics/*/files/**', outputFolder: './dist/hex-angular/' },
  { inputFolder: './schematics/collection.json', outputFolder: './dist/hex-angular/' },
]

for (const { inputFolder, outputFolder } of ddd) {
  copyfiles([inputFolder, outputFolder], {}, (err) => {
    if (err) {
      console.log("Error occurred while copying", err);
    }
    console.log("folder(s) copied to destination");
  });
}