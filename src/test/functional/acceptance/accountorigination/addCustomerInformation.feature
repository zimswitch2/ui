@customerOrigination
Feature: Edit existing customer details
  As a customer
  I need to be able to add my details
  So that I can transact

  Background:
    Given I want to apply for "Current" account as a customer "who only has basic information"
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

  @customerManagementV4
  Scenario: add new employment information
    Given I click on the link containing "Address" text
    And I choose "Yes" for "Same as home address"
    And I enter the following details
      | Street      | 7 Simmonds street |
      | Suburb      | Marshalltown      |
      | City/town   | Johannesburg      |
      | Postal Code | 2001              |
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    And I click on the link containing "Employment" text
    Then I should see the "current account product" "employment" "edit" page
    When I choose "No" for "Are you currently employed?"
    And I select "Unemployed" for "Reason for unemployment"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "employment" page
    When I click on the "+ Add new employer" link
    Then I should see the "current account product" "employment" "add" page
    When I complete "Employer name" in "Current Employment" section with "My employer"
    And I select the date "2016-01-05" as my "current-employment" "Start date *"
    And I select "Agriculture" for "Industry" in "Current Employment" section
    And I select "Director" for "Occupation level" in "Current Employment" section
    And I select "Full time" for "Status" in "Current Employment" section
    When I complete "Employer name" in "Previous Employment" section with "Previous employer"
    And I select the date "2013-01-31" as my "previous-employment" "Start date *"
    And I select the date "2015-12-31" as my "previous-employment" "End date *"
    And I select "Agriculture" for "Industry" in "Previous Employment" section
    And I select "Director" for "Occupation level" in "Previous Employment" section
    And I select "Full time" for "Status" in "Previous Employment" section
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "employment" page
    When I click on the link containing "Income and expenses" text
    Then I should see the "current account product" "income" "edit" page
    And I select last additional income item as "Wages"
    And I change the 1st income amount to "3000"
    And I complete "Total expenses" with "2050"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "income" page
    And I click on the link containing "Submit" text
    Then I should see the "current account product" "submit" "edit" page
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "current account product" "submit" page