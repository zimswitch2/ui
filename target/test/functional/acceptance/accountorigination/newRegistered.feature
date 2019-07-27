@rcp, @newRegisteredPage
Feature: Newly Registered Customer
  As a newly registered customer
  I want to be able to open an account
  And link a card
  So that I can transact online

  Background:
    Given I go to the login page
    And I click on the "Register" button
    And I enter the following details
      | Email address           | happy@smoke.com |
      | Enter your new password | Zxcvbnm123      |
      | Confirm password        | Zxcvbnm123      |
      | Preferred name          | Happy User      |
    And I accept "You accept the"
    And I click on the "Register now" button
    And I enter the following details
      | Email verification code | 12345 |
    When I click on the "Submit" button
    Then I should see success notification with "Hello User. Your profile was successfully created. What do you want to do next?"

  Scenario: Newly Registered Customer should be able to open an account
    When I click on the "Open an account" button
    Then I should see the "Available Products" page

  Scenario: Newly Registered Customer should be able to link card
    And I click on the "Link your card" button
    And I should see the "Link Card" page

 Scenario: Newly Registered Customer should be able to copy their old profile
    And I click on the "Copy your profile" button
    And I should see the "Copy Your Profile" page

