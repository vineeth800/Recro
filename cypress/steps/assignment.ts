const {
  Given,
  When,
  Then,
  And,
} = require("cypress-cucumber-preprocessor/steps");

// Clear cookies, session storage, and local storage before all tests
before(() => {
  cy.clearAllCookies();
  cy.clearAllSessionStorage();
  cy.clearAllLocalStorage();
});

Given("I navigate to the Care Validate portal", () => {
  const baseUrl = Cypress.env("baseUrl");
  cy.visit(baseUrl);
  cy.wait(7000); // Consider using cy.intercept for a more robust approach
});

When("I enter valid credentials", () => {
  cy.url({ timeout: 20000 }).then((url) => {
    if (!url.includes("/accommodations/request")) {
      cy.login(Cypress.env("userName"), Cypress.env("password"));
    } else {
      cy.log("Already logged in, continuing...");
    }
  });
});

Then("I am successfully logged in", () => {
  cy.url({ timeout: 20000 }).should("include", "/accommodations/request");
});

When(/^I go to Accommodations > (New Request|My Requests)$/, (tabName) => {
  cy.get('[aria-label="Menu"]').click();
  cy.get("div.q-item > .row > .q-item__label").should("be.visible");
  cy.contains("a .q-item__label", tabName).click();

  if (tabName === "New Request") {
    cy.get(".q-card__section h2").should("have.text", tabName);
  }
});

// Parameterized step definition for selecting options
And("I select {string}", (option) => {
  cy.get("div.q-item__label").contains(option).click({ force: true });
});

// Form submission step definition
And("I fill out the form and click the Submit button", () => {
  const record = [
    "Male",
    "25",
    "5.2",
    "82",
    "Fatty Liver Disease",
    "Active Cancer",
    "Lose over 50 for good",
    "Dieting",
    "12/02/1998",
    "abc@gmail.com",
    "9123659874",
    "xyz , abc 123",
    "pqr",
    "up",
    "28325",
    "No",
    "download.jpg",
  ];

  // Filling out each form element
  cy.get(".q-stepper__step").each(($el, index) => {
    handleFormElement($el, record, index);
  });

  // Submit the form
  cy.get('[data-testid="submit-button"]').click();
  cy.contains(
    ".q-card__section",
    "Are you sure you want to submit the form?"
  ).should("be.visible");
  cy.get('[data-testid="submit-form-dialog-submit-button"]').click();
});

// Validation of success message after form submission
And("I should see the success message confirming submission", () => {
  cy.contains(
    ".q-card__section",
    "Thank you for your submission. We have sent you a confirmation email for your records."
  ).should("be.visible");
});

// Placeholder for verifying submitted forms
Then("I should see the submitted form in the list of requests", () => {
  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);
  cy.contains("th span", "Created").click();
  cy.contains("th span", "Created").click();
  cy.get("a.text-black").eq(0).should("be.visible");
  cy.log(formattedCurrentDate);
  cy.get('[class="text-left text-weight-medium"]')
    .eq(0)
    .should("have.text", "Weight Loss Eligibility Intake Form ");
  cy.get('[data-testid="case-status-label"]')
    .eq(0)
    .should("have.text", "Submitted");
});

Then("I verified the performance metrics", () => {
  cy.lighthouse({
    performance: 0.8,
    accessibility: 0.8,
    seo: 0.9,
    pwa: 0.9,
  }).then((report) => {
    if (report && report.lhr && report.lhr.categories) {
      const performanceScore = report.lhr.categories.performance.score;
      expect(performanceScore).to.be.gte(0.9);
    } else {
      throw new Error("Lighthouse report or categories is undefined.");
    }
  });
});

// Utility functions for form handling
const fillTextInput = ($el, value) => {
  cy.wrap($el).find('[type="text"]').type(value);
};

const clickRadioButton = ($el, value) => {
  cy.wrap($el).contains(".q-radio__label", value).click();
};

const attachFileInput = ($el, fileName) => {
  cy.wrap($el).find('[type="file"]').attachFile(fileName);
};

const selectFromDropdown = ($el, value) => {
  cy.wrap($el).find(".q-select__dropdown-icon").click();
  cy.contains(value).click();
};

const clickCheckbox = ($el, value) => {
  cy.wrap($el).find('[role="checkbox"]').contains(value).click();
};

const selectFromCalendar = ($el, value) => {
  cy.selectDate($el, value);
};

const handleFormElement = ($el, record, index) => {
  cy.wrap($el).should("be.visible");
  cy.wrap($el)
    .find("input, .calendar-body")
    .then(($inputs) => {
      // Identify and handle different input types
      if ($el.find('[type="radio"]').length > 0) {
        clickRadioButton($el, record[index]);
      } else if ($el.find('[type="file"]').length > 0) {
        attachFileInput($el, record[index]);
      } else if ($el.find(".q-select__dropdown-icon").length > 0) {
        selectFromDropdown($el, record[index]);
      } else if ($el.find('[role="checkbox"]').length > 0) {
        clickCheckbox($el, record[index]);
      } else if ($el.find(".calendar-body").length > 0) {
        selectFromCalendar($el, record[index]);
      } else {
        fillTextInput($el, record[index]);
      }
      cy.wrap($el).contains('span[class="block"]', "Continue").click();
    });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  const formattedDate = date.toLocaleString("en-US", options);
  return formattedDate;
};
