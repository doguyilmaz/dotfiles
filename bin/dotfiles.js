#!/usr/bin/env node
const { execFileSync } = require("child_process");
const { join } = require("path");

execFileSync("bash", [join(__dirname, "..", "setup", "collect-machine-config.sh")], { stdio: "inherit" });
