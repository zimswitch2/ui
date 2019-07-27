@e2edeLinkDashboard
Feature: DE-Link Additional Cards from Standard Bank ID
  As a registered Online Banking User
  I want to de link a dashboard
  so that I am able to manage and reorganise my online banking profile products and accounts



  Scenario: Successfully delete a dashboard
    Given I have logged in as a "delinksit" customer
    When I click on Profile and Settings
    Then I should see "Profile and Settings" heading
    When I click delete My Personal Dashboard
    Then A modal saying "Delete dashboard? You will no longer be able to use this card for online transactions" should display
    When I click cancel button
    And I click delete My Personal Dashboard
    Then A modal saying "Delete dashboard? You will no longer be able to use this card for online transactions" should display
    When I click confirm button
    #Then The dashboard should be removed
    And I should see success text notification header with "My Personal Dashboard Successfully Deleted" 
    When I click on the "Add Dashboard" button
    Then I should see the "Add dashboard" page
    And I should see that the "Next" button is disabled
    When I enter "sitCardDetails" into the card details form
    And I click on the "Next" button
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    #Then I should see "New dashboard name" heading
    And I click on the "Save" button
