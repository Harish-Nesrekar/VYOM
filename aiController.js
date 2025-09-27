import fs from "fs";
import path from "path";
import { exec } from "child_process";

// Function to process image + optional question
export const processImage = async (imageFile, question = "") => {
  return new Promise((resolve, reject) => {
    const imagePath = imageFile.path;

    // Call your Python script in AI folder
    let cmd = `python ai_script.py --image "${imagePath}"`;
    if (question) cmd += ` --question "${question}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Python script error:", stderr);
        return reject(error);
      }

      try {
        const result = JSON.parse(stdout); // make sure your Python script prints JSON
        resolve(result);
      } catch (err) {
        reject(err);
      } finally {
        // Clean up uploaded file
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Failed to delete file:", err);
        });
      }
    });
  });
};
