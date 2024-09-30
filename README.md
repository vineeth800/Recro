## Recro Cypress Assignment ##
This project uses Cypress for testing entire processes from start to finish. It is integrated with Cucumber. This setup allows you to write tests in plain language (called Gherkin, using .feature files) and then automatically run these tests with Cypress.

* Prerequisites *
Before setting up the project, ensure you have the following installed:

  Node.js (version 12 or higher)
  npm or yarn
  Git

Setup Instructions
1. Clone the Repository by a gitBash

  git clone <repository-url>

2. Install Dependencies once in the project directory, install the necessary npm packages:

   npm install

3. Configure Cypress
In the root directory, you'll find the cypress.config.ts file. This file contains Cypress configurations:

4. Cucumber Configuration
Cucumber .feature files should be placed inside the cypress/integration folder. Feature files are written in Gherkin syntax and should follow the following structure:

5. Folder Structure
The typical folder structure for this project is as follows:

├── cypress
│   ├── fixtures
│   ├── integration
│   │   └── [feature files].feature
│   ├── plugins
│   ├── screenshots
│   ├── videos
│   ├── steps
│   └── support
│       ├── commands.js
│       └── index.js
├── node_modules
│   e2e ├── reports
├── cypress.config.ts
├── reportHtmlGenerator.js
├── package.json
└── README.md

6. Running the Tests
You can run the tests in either headless mode or with the Cypress GUI.

Headless Mode
To run all tests in headless mode:
  npx cypress run
  npx cypress run --browser chrome
Open Cypress in GUI to open Cypress and run tests interactively:
  npx cypress open

7. Running Specific Feature Files, you can also run specific .feature files:
  npx cypress run --spec "cypress/integration/[your-feature-file].feature"

8. Generating Reports after running the tests, a multi-cucumber HTML report will be generated.

To generate the report:
  npm run generate-report

This will output the report to e2e/reports.

9. Viewing Test Artifacts
If there are failures during the test run, Cypress automatically captures screenshots and videos of the failures.

Screenshots: Located in cypress/screenshots/
Videos: Located in cypress/videos/

Scripts
The package.json includes several useful scripts:

Run ui: npx cypress run
Generate report: npm run generate-report

Conclusion
This project is designed in cypress with cucumber for recro assignment.
