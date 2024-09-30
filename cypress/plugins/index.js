const cucumber = require("cypress-cucumber-preprocessor").default;
const { lighthouse, prepareAudit } = require("@cypress-audit/lighthouse");
const { pa11y } = require("@cypress-audit/pa11y");

module.exports = (on, config) => {
  on("file:preprocessor", cucumber());

  on("before:browser:launch", (browser = {}, launchOptions) => {
    prepareAudit(launchOptions);
  });

  on("task", {
    lighthouse: lighthouse(),
    pa11y: pa11y(console.log.bind(console)),
  });
};