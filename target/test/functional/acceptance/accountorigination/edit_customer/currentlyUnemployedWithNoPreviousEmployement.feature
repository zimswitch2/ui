@customerOrigination
Feature: Edit existing customer details who is unemployed
  As a customer
  I need to be able to modify my employment details

  Background:
    Given I want to apply for an account as a customer "who is unemployed"
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
    Then I should see the following details in "Current Employment" section:
      | label                   | value   |
      | Employed                | No      |
      | Reason for unemployment | Student |

  Scenario: A currently unemployed customer modifies her reason for unemployment
    When I click on the "Modify" button
#    Then I should not see the "Previous Employment" section
#    When I select "Retired" for "Reason for unemployment" in "Current Employment" section
#    And I click on the "Save" button
#    Then I should see the OTP page with "Your Details" title

  Scenario: A currently unemployed customer modifies her employment information and indicates that she is currently
            employed for less than 1 year. She specifies that she was previously unemployed
    When I click on the "Modify" button
#    And I choose "Yes" for "Are you currently employed?"
#    Then I should not see the "Previous Employment" section
#    And I complete "Employer name" with "My employer"
#    And I select a date 1 "month(s)" in the "past" as my "current-employment" "Start date *"
#    Then I should see the "Previous Employment" section
#    And I should see information notification with "Please enter your previous employment details, because you have been at your current job for less than a year"
#    And I click on the "I have not been previously employed" checkbox
#    Then I should not see "Employer name" in the "Previous Employment" section
#    And I should not see "Start date" in the "Previous Employment" section
#    And I should not see "End date" in the "Previous Employment" section
#    And I should not see "Industry" in the "Previous Employment" section
#    And I should not see "Occupation level" in the "Previous Employment" section
#    And I should not see "Status" in the "Previous Employment" section
#    And I click on the "Save" button
#    Then I should see the OTP page with "Your Details" title

  Scenario: A currently unemployed customer modifies her employment information and indicates she is currently employed
            for more than 1 year
    When I click on the "Modify" button
#    And I choose "Yes" for "Are you currently employed?"
#    Then I should not see the "Previous Employment" section
#    And I complete "Employer name" with "My employer"
#    And I select a date 14 "month(s)" in the "past" as my "current-employment" "Start date *"
#    And I select "Agriculture" for "Industry"
#    And I select "Director" for "Occupation level"
#    And I select "Full time" for "Status"
#    And I click on the "Save" button
#    Then I should see the OTP page with "Your Details" title

  Scenario: A currently unemployed customer adds a new employer for whom she has been working for more than 1 year
    When I click on the "+ Add new employer" link
    Then I should see the "Current Employment" section
    And I should see the "Previous Employment" section
#    And the "I have not been previously employed" checkbox should be checked
#    And the "I have not been previously employed" checkbox should be disabled
#    And I should not see "Employer name" in the "Previous Employment" section
#    And I should not see "Start date" in the "Previous Employment" section
#    And I should not see "End date" in the "Previous Employment" section
#    And I should not see "Industry" in the "Previous Employment" section
#    And I should not see "Occupation level" in the "Previous Employment" section
#    And I should not see "Status" in the "Previous Employment" section
#    When I complete "Employer name" with "My employer"
#    And I select a date 14 "month(s)" in the "past" as my "current-employment" "Start date *"
#    And I select "Agriculture" for "Industry"
#    And I select "Director" for "Occupation level"
#    And I select "Full time" for "Status"
#    And I click on the "Save" button
#    Then I should see the OTP page with "Your Details" title

  Scenario: A currently unemployed customer adds a new employer for whom she has been working for less than 1 year
    When I click on the "+ Add new employer" link
    Then I should see the "Current Employment" section
    And I should see the "Previous Employment" section
#    And the "I have not been previously employed" checkbox should be checked
#    And the "I have not been previously employed" checkbox should be disabled
#    And I should not see "Employer name" in the "Previous Employment" section
#    And I should not see "Start date" in the "Previous Employment" section
#    And I should not see "End date" in the "Previous Employment" section
#    And I should not see "Industry" in the "Previous Employment" section
#    And I should not see "Occupation level" in the "Previous Employment" section
#    And I should not see "Status" in the "Previous Employment" section
#    When I complete "Employer name" with "My employer"
#    And I select a date 1 "month(s)" in the "past" as my "current-employment" "Start date *"
#    Then the "I have not been previously employed" checkbox should be checked
