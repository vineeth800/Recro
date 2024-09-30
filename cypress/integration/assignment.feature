Feature: Recro Assignment

    Background: End-to-End Flow for Login
        Given I navigate to the Care Validate portal
        When I enter valid credentials
        Then I am successfully logged in

    Scenario: Navigate to Accommodations and submit a request
        When I go to Accommodations > New Request
        And I select "Weight Loss Eligibility Intake Form"
        And I fill out the form and click the Submit button
        Then I should see the success message confirming submission

    Scenario: Verify the form submission in "My Requests"
        When I go to Accommodations > My Requests
        Then I should see the submitted form in the list of requests

    Scenario:  varify performance metrics using Lighthouse
        Then I verified the performance metrics   