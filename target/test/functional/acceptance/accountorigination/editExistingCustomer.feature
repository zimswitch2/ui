@customerOrigination
Feature: Edit existing customer details
  As a customer
  I need to be able to edit my details
  So that I can transact

  Background:
    Given I want to apply for "Current" account as a customer "who does not have an existing current account"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Apply now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    And I should see the "Before You Start Your Application" title
    And I accept "You agree to a credit and fraud check"
    When I click on the "Next" button
    Then I should see the "Your Details" title
    And I should see the "current account product" "profile" page
    And I should see "Details" as the current step in the breadcrumb
    And I should see information notification with "Please visit your nearest branch to update your basic information"

  Scenario: Edit address details
    Given I click on the link containing "Address" text
    When I click on the "Modify" button
    And I enter the following details in "Home Address" section:
      | Street      | 7 Simmonds street |
      | Suburb      | Marshalltown      |
      | City/town   | Johannesburg      |
      | Postal Code | 2001              |
    And I choose "Yes" for "Same as home address"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "address" page
    When I click on the "Modify" button
    And I complete "Street" with "8 Simmonds street"
    And I click on the "Cancel" button
    Then I should see the "Cancel changes?" modal window

  Scenario: Edit employment details
    Given I click on the link containing "Employment" text
    When I click on the "+ Add new employer" link
    When I complete "Employer name" with "My employer"
    And I select the date "2016-01-05" as my "current-employment" "Start date *"
    And I select "Agriculture" for "Industry"
    And I select "Director" for "Occupation level"
    And I select "Full time" for "Status"
    And I select the date "2015-12-31" as my "previous-employment" "End date *"
    And I select "Bachelor" for "Qualification level"
    And I select "B compt" for "Qualification type"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "employment" page

  Scenario: Edit income and expenses
    Given I click on the link containing "Income and expenses" text
    When I click on the "Modify" button
    Then I should see the "current account product" "income" "edit" page
    When I click on the "+ Add additional income" link
    And I change the 1st income amount to "2000"
    And I select last additional income item as "Wages"
    And I change the 2nd income amount to "2000"
    And I complete "Total expenses" with "2050"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "income" page