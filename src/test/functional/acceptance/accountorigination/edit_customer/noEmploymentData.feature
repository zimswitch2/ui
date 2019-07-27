@customerOrigination
Feature: Edit existing customer details with no employment data
  As a customer
  I need to be able to add my employment details
  So that I can transact

  Background:
    Given I want to apply for an account as a customer "who has no employment information"
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
    When I click on the link containing "Employment" text

  Scenario: A customer modifies employment information and indicates that she has been employed for more than a year
    And I choose "Yes" for "Are you currently employed?"
    And I complete "Employer name" with "My employer"
    And I select the date "2015-01-05" as my "current-employment" "Start date *"
    And I select "Agriculture" for "Industry"
    And I select "Director" for "Occupation level"
    And I select "Full time" for "Status"
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title

  Scenario: A customer modifies employment information and indicates that she has been employed for less than a year
            She specifies that she was previously employed
    And I choose "Yes" for "Are you currently employed?"
    And I complete "Employer name" with "My employer"
    And I select a date 1 "month(s)" in the "past" as my "current-employment" "Start date *"
    Then I should see the "Previous Employment" section
    And I should see information notification with "Please enter your previous employment details, because you have been at your current job for less than a year"
    When I select "Agriculture" for "Industry"
    And I select "Director" for "Occupation level"
    And I select "Full time" for "Status"
    And I complete "Employer name" in "Previous Employment" section with "Previous employer"
    And I select the date "2015-01-31" as my "previous-employment" "Start date"
    And I select a date 2 "month(s)" in the "past" as my "previous-employment" "End date"
    And I select "Agriculture" for "Industry" in "Previous Employment" section
    And I select "Director" for "Occupation level" in "Previous Employment" section
    And I select "Full time" for "Status" in "Previous Employment" section
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title

  Scenario: A customer modifies employment information and indicates that she has been employed for less than a year
            She specifies that she was previously unemployed
    And I choose "Yes" for "Are you currently employed?"
    And I complete "Employer name" with "My employer"
    And I select a date 1 "month(s)" in the "past" as my "current-employment" "Start date *"
    Then I should see the "Previous Employment" section
    And I should see information notification with "Please enter your previous employment details, because you have been at your current job for less than a year"
    When I select "Agriculture" for "Industry"
    And I select "Director" for "Occupation level"
    And I select "Full time" for "Status"
    And I click on the "I have not been previously employed" checkbox
#    Then I should not see "Employer name" in the "Previous Employment" section
#    And I should not see "Start date" in the "Previous Employment" section
#    And I should not see "End date" in the "Previous Employment" section
#    And I should not see "Industry" in the "Previous Employment" section
#    And I should not see "Occupation level" in the "Previous Employment" section
#    And I should not see "Status" in the "Previous Employment" section
#    And I click on the "Save" button
#    Then I should see the OTP page with "Your Details" title

  Scenario: A customer specifies that she is not employed
    And I choose "No" for "Are you currently employed?"
    Then I should see "Reason for unemployment" in the "Current Employment" section
    When I select "Disabled" for "Reason for unemployment" in "Current Employment" section
    And I click on the "Save" button
    Then I should see the OTP page with "Your Details" title