import "cypress-file-upload";
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
const yearSelected = (targetyear) => {
  cy.get('.q-date__years [class="block"]').then((years) => {
    debugger;
    const firstYear = Cypress.$(years[0]).text().trim();
    const lastYear = Cypress.$(years[years.length - 1])
      .text()
      .trim();
    const firstYearNum = parseInt(firstYear);
    const lastYearNum = parseInt(lastYear);
    const targetYearNum = parseInt(targetyear);

    if (firstYearNum >= targetYearNum) {
      // Navigate to previous years if the first visible year is greater than target year
      cy.get(".q-date__years button").first().click();
      cy.wait(2000);
      yearSelected(targetYearNum.toString());
    } else if (lastYearNum <= targetYearNum) {
      // Navigate to next years if the last visible year is less than target year
      cy.get(".q-date__years button").last().click();
      cy.wait(2000);
      yearSelected(targetYearNum.toString());
    } else {
      // If target year is within the visible range, click on it
      cy.contains(
        '.q-date__years [class="block"]',
        targetYearNum.toString()
      ).click();
    }
  });
};
Cypress.Commands.add("selectDate", ($el, value) => {
  let [targetday, targetmonth, targetyear] = value.split("/");
  cy.get('[class="q-date__view q-date__calendar"] button')
    .eq(4)
    .then(($year) => {
      if ($year.text() !== targetyear) {
        cy.get('[class="q-date__view q-date__calendar"] button').eq(4).click();
        yearSelected(targetyear);
      }
    });

  cy.get('[class="q-date__view q-date__calendar"] button')
    .eq(1)
    .then(($month) => {
      const months = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        10: "October",
        11: "November",
        12: "December",
      };
      if ($month.text() !== months[targetmonth]) {
        cy.get('[class="q-date__view q-date__calendar"] button').eq(1).click();
        cy.contains(
          ".q-date__months-item button",
          months[targetmonth].slice(0, 3)
        ).click();
      }
    });

  cy.wrap($el)
    .contains(".q-date__calendar-days-container span", targetday)
    .click();
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
