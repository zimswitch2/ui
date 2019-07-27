@changePassword
Feature: Change Password
  As an internet banking customer
  I need to be able to change my password
  So that I can prevent other people from signing in with my digital ID

  Background:
    Given I have logged in as a "credentials" customer
    When I click on Change Password

  Scenario: Form validations
    When I complete "Old password" with ""
    And I complete "New password" with ""
    Then "Old password" should have a validation message of "Required"
    And I should see that the "Save" button is disabled
    When I complete "Old password" with "wrongpassword"
    Then "New password" should have a validation message of "Required"
    And I should see that the "Save" button is disabled
    When I complete "New password" with "Pro1234"
    Then "New password" should have a validation message of "Must be at least 8 characters long"
    And I should see that the "Save" button is disabled
    When I complete "New password" with "Pro123456789012345678"
    Then "New password" should have a validation message of "Cannot be longer than 20 characters"
    And I should see that the "Save" button is disabled
    When I complete "New password" with "pro12345678901234567"
    And I should see that the "Save" button is disabled
    Then "New password" should have a validation message of "Please enter a valid password"
    When I complete "onfirm new password" with ""
    And I complete "New password" with "Pro12345"
    Then "Confirm new password" should have a validation message of "Required"
    And I should see that the "Save" button is disabled
    When I complete "Confirm new password" with "Pro1234"
    Then "Confirm new password" should have a validation message of "The two passwords do not match"
    And I should see that the "Save" button is disabled
    When I complete "Confirm new password" with "Pro12345"
    Then I should see that the "Save" button is enabled
    And I click on the "Save" button
    And I should see error notification with "The old password is invalid."
    When I complete "Old password" with "password"
    And I click on the "Save" button
    Then I should see the "account summary" page
    And I should see success notification with "Password was successfully changed."