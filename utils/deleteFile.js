import fs from "fs";
import path from "path";

export const deleteFile = (filePath) => {
  if (!filePath) return;

  const absolutePath = path.join(process.cwd(), filePath);

  fs.unlink(absolutePath, (err) => {
    if (err) {
      console.error("File delete failed:", absolutePath, err.message);
    } else {
      console.error("Deleted file:", absolutePath);
    }
  });
};
