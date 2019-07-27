@deLinkDashboard
Feature: DE-Link Additional Cards from Standard Bank ID
  As a registered Online Banking User
  I want to de link a dashboard
  so that I am able to manage and reorganise my online banking profile products and accounts

  Scenario: Successfully delete a dashboard
    Given I have logged in
    When I click on Profile and Settings
    Then I should see "Profile and Settings" heading
    When I click delete My Personal Dashboard
    Then A modal saying "Delete dashboard? You will no longer be able to use this card for online transactions" should display
    When I click cancel button
    And I click delete My Personal Dashboard
    Then A modal saying "Delete dashboard? You will no longer be able to use this card for online transactions" should display
    When I click confirm button
    Then The dashboard should be removed
    And I should see success text notification header with "Activate Internet Banking Dashboard Successfully Deleted"

