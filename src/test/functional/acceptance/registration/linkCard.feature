@registration
Feature: Link Card Functionality
  As an internet banking customer
  I need to be able to link my card to my profile
  So that I can transact on that card

  Scenario: New Registration with incorrect cellphone number
    Given I go to the login page
    When I click on the "Register" button
    Then I should see the "Create Digital Id" page
    And I should see that the "Register now" button is disabled
    When I complete the register form with "User Details"
    Then I should see the OTP page with "Register User" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see success notification with "Hello User. Your profile was successfully created. What do you want to do next?"
    When I click on the "Link your card" button
    Then I should see the "Link Card" page
    And I should see that the "Next" button is disabled
    When I enter "incorrectCardDetails" into the card details form
    And I click on the "Next" button
    Then I should see error notification with "The details you entered do not match those we have on record. Please try again, or contact your branch"

  Scenario: Add Dashboard with incorrect cellphone number
    Given I have logged in
    When I click on Profile and Settings
    Then I should see "Profile and Settings" heading
    When I click on the "Add Dashboard" button
    Then I should see the "Add dashboard" page
    And I should see that the "Next" button is disabled
    When I enter "incorrectCardDetails" into the card details form
    And I click on the "Next" button
    Then I should see error notification with "The details you entered do not match those we have on record. Please try again, or contact your branch"

  Scenario: New Registration with service temporarily unavailable
    Given I go to the login page
    When I click on the "Register" button
    Then I should see the "Create Digital Id" page
    And I should see that the "Register now" button is disabled
    When I complete the register form with "User Details"
    Then I should see the OTP page with "Register User" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see success notification with "Hello User. Your profile was successfully created. What do you want to do next?"
    When I click on the "Link your card" button
    Then I should see the "Link Card" page
    And I should see that the "Next" button is disabled
    When I enter "serviceErrorCardDetails" into the card details form
    And I click on the "Next" button
    Then I should see error notification with "This service is not available at the moment. Please try again in a few minutes"

  Scenario: Add Dashboard with service temporarily unavailable
    Given I have logged in
    When I click on Profile and Settings
    Then I should see "Profile and Settings" heading
    When I click on the "Add Dashboard" button
    Then I should see the "Add dashboard" page
    And I should see that the "Next" button is disabled
    When I enter "serviceErrorCardDetails" into the card details form
    And I click on the "Next" button
    Then I should see error notification with "This service is not available at the moment. Please try again in a few minutes"




