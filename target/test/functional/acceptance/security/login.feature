@login
Feature: Login to Internet Banking
  As an internet banking customer
  I need to be able to login
  So that I can view my account information

  Scenario: Valid Digital ID
    Given I have logged in as a "credentials" customer
    Then I should see the "account summary" page

  Scenario: Tries to login with email address only
    Given I go to the login page
    When I complete "Email address" with "only@email.address"
    And The "Sign in" button is enabled
    And I click on the "Sign in" button
    Then "Password" should have a validation message of "Required"

  Scenario: Tries to login with password only
    Given I go to the login page
    When I complete "Password" with "password"
    And The "Sign in" button is enabled
    And I click on the "Sign in" button
    Then "Email address" should have a validation message of "Required"

  Scenario: Tries to login without credentials
    Given I go to the login page
    When The "Sign in" button is enabled
    And I click on the "Sign in" button
    Then "Email address" should have a validation message of "Required"
    And "Password" should have a validation message of "Required"

  Scenario: Tries to login with bad email address
    Given I go to the login page
    When I complete "Email address" with "bademailaddress"
    And I complete "Password" with "password"
    Then "Email address" should have a validation message of "Please enter a valid email address"

  Scenario: Tries to login when service is temporarily unavailable
    Given I have logged in as a "Service Unavailable" customer
    Then I should see error notification with "This service is not available at the moment. Please try again in a few minutes"
