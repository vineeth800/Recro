import 'cypress-file-upload';
import "@cypress-audit/lighthouse/commands";

Cypress.Commands.add("login", (username, password) => {
  cy.get('[data-testid="email"]').click().type(username);
  cy.get("body").then(($body) => {
    if ($body.find('[data-testid="password"]').length > 0) {
      cy.get('[data-testid="password"]').click().type(password);
    } else {
      cy.get('[data-testid="login-with-password"]').click();
    }
  });
  cy.get('[data-testid="password"]').click().type(password);
  cy.get('[data-testid="continue"]').click();
});

afterEach(() => {
  try {
    cy.window().then((win) => win.gc);

    let screenshotPath = "";
    if (window.cucumberJson?.generate) {
      const testState = window.testState;
      const stepResult =
        testState.runTests[testState.currentScenario.name][
          testState.currentStep
        ];

      if (stepResult?.status === "failed") {
        const screenshotFileName = `${Cypress.spec.name}_${Date.now()}`;
        cy.screenshot(screenshotFileName, {
          capture: "runner",
          onAfterScreenshot($el, props) {
            // Get relative path from screenshots folder
            screenshotPath = `cypress/screenshots/${Cypress.spec.name}/${screenshotFileName}.png`;
          },
        }).then(() => {
          // Wait to ensure the screenshot file is completely written
          cy.wait(1000); // Adjust as needed

          // Use relative path instead of absolute path
          cy.readFile(screenshotPath, "base64").then((imgData) => {
            if (imgData) {
              stepResult.attachment = {
                data: imgData,
                media: { type: "image/png" },
                index: testState.currentStep,
                testCase: testState.formatTestCase(testState.currentScenario),
              };
            }
          });
        });
      }
    }
  } catch (e) {
    console.log(e);
  }
});
