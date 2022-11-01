import * as dejs from "https://deno.land/x/dejs@0.10.3/mod.ts";

const GITHUB_PREFIX = "https://github.com/";

// Load list.txt file
const listTxt = await Deno.readTextFile("list.txt");
const lines = listTxt.split("\n");

// Fetch GitHub repo info
const repos = [];
for (const url of lines) {
  if (!url.startsWith(GITHUB_PREFIX)) {
    continue;
  }

  console.log(url);
  const repoPath = url.slice(GITHUB_PREFIX.length);
  const repoApiUrl = `https://api.github.com/repos/${repoPath}`;
  const repoRes = await fetch(repoApiUrl);
  const repo = await repoRes.json();

  repos.push(repo);
}

// Write to README.md
const readmeTpl = await Deno.readTextFileSync("README.ejs");
const readme = await dejs.renderToString(readmeTpl, { repos, time: new Date().toUTCString() });
await Deno.writeTextFile("README.md", readme);
