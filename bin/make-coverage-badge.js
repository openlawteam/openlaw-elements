#!/usr/bin/env node

/* globals process */

/**
 * make-coverage-badge
 *
 * Copying because we needed some more control over the badge name and percentages.
 * Look for "$OVERRIDE" for areas where our code diverges.
 * https://github.com/tlvince/make-coverage-badge/blob/master/cli.js
 */

const { get } = require("https");
const { readFile, writeFile } = require("fs");

const getColour = coverage => {
  // $OVERRIDE 80
  if (coverage < 60) {
    return "red";
  }
  // $OVERRIDE 90
  if (coverage < 70) {
    return "yellow";
  }
  return "brightgreen";
};

const getBadge = report => {
  if (!(report && report.total && report.total.statements)) {
    throw new Error("malformed coverage report");
  }

  const coverage = report.total.statements.pct;
  const colour = getColour(coverage);

  // $OVERRIDE "Coverage-"
  return `https://img.shields.io/badge/Jest-Coverage%20${coverage}${encodeURI(
    "%"
  )}-${colour}.svg`;
};

const download = (url, cb) => {
  get(url, res => {
    let file = "";
    res.on("data", chunk => (file += chunk));
    res.on("end", () => cb(null, file));
  }).on("error", err => cb(err));
};

const [, , thirdArg, fourthArg] = process.argv;
const outputPath =
  (thirdArg === "--output-path" || thirdArg === "--outputPath") && fourthArg
    ? fourthArg
    : "./coverage/badge.svg";

readFile("./coverage/coverage-summary.json", "utf8", (err, res) => {
  if (err) throw err;
  const report = JSON.parse(res);
  const url = getBadge(report);
  download(url, (err, res) => {
    if (err) throw err;
    writeFile(outputPath, res, "utf8", err => {
      if (err) throw err;

      console.log("Wrote coverage badge to: " + outputPath);
    });
  });
});
