import { FileSystem } from "./fileSystem";

const fileSystem = new FileSystem();

fileSystem.mkdir("/projects/typescript");
fileSystem.addContentToFile("/projects/typescript/notes.txt", "LLD patterns");
fileSystem.addContentToFile("/projects/typescript/notes.txt", " are useful");

console.log("Root:", fileSystem.ls("/"));
console.log("/projects/typescript:", fileSystem.ls("/projects/typescript"));
console.log(
  "File content:",
  fileSystem.readContentFromFile("/projects/typescript/notes.txt"),
);