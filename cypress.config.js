const { defineConfig } = require("cypress");

module.exports = defineConfig({
  videoCompression: true,
  video: true,
  screenshotOnRunFailure: false,
  env : {
    baseUrl: "https://careglp-staging.carevalidate.com/login",
    userName: "qa+employee@carevalidate.com",
    password: "bLPgk5tr7D3ZqpXvV@aNKz"
  },
  e2e: {
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    
    specPattern: "cypress/integration/*{.feature,.cy.js}",
    // specPattern: "cypress/integration/*.feature",
    defaultCommandTimeout: 10000
  },
});
