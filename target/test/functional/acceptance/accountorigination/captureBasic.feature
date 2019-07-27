@customerOrigination @customerManagementV4
Feature: Capture basic details
  As a new to bank customer
  I need to be able to capture my basic details
  So that I can apply for an account

  Scenario: South African Citizen
    Given I have logged in as a "new to bank" customer
    When I click on the "Open an account" button
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "current account product" "profile" "new" page
    When I select "Ms" for "Title"
    And I enter the following details
      | Surname     | Hmmm          |
      | First names | Oh My --      |
      | Initials    | OM            |
      | ID number   | 5203012786088 |
    #And I select the date "1983-01-01" as my "Date of birth"
    And I select "South Africa" as my "Nationality" from the list
    And I select "South Africa" as my "Country of residence" from the list
    And I select "South Africa" as my "Country of citizenship" from the list
    And I select "South Africa" as my "Country of birth" from the list
    And I select "Single" for "Marital status"
    And I select "simmonds" as my "branch" from the list
    And I change the 1st contact detail to "0712345678"
    And I click on the "Next" button
    Then I should see the "current account product" "address" "edit" page


  Scenario: Non-South African Permanent Residence
    Given I have logged in as a "new to bank" customer
    When I click on the "Open an account" button
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "current account product" "profile" "new" page
    When I select "Ms" for "Title"
    And I enter the following details
      | Surname     | Hmmm          |
      | First names | Oh My --      |
      | Initials    | OM            |
      | ID number   | 8301010247181 |
    And I select the date "1983-01-01" as my "Date of birth"
    And I select "Albania" as my "Nationality" from the list
    And I select "Albania" as my "Country of residence" from the list
    And I select "Albania" as my "Country of birth" from the list
    And I select "Albania" as my "Country of citizenship" from the list
    And I select "Single" for "Marital status"
    And I select "simmonds" as my "branch" from the list
    And I change the 1st contact detail to "0712345678"
    And I click on the "Next" button
    Then I should see the "current account product" "address" "edit" page

  Scenario: Non-South African With Passport
    Given I have logged in as a "new to bank" customer
    When I click on the "Open an account" button
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "current account product" "profile" "new" page
    When I select "Ms" for "Title"
    And I enter the following details
      | Surname     | Hmmm     |
      | First names | Oh My -- |
      | Initials    | OM       |
    And I select "Passport" for "ID type"
    And I select a date 18 "year(s)" in the "past" as my "Date of birth"
    And I complete "Passport number" with "B05544332"
    And I select "Albania" as my "Nationality" from the list
    And I select "Albania" as my "Country of residence" from the list
    And I select "Albania" as my "Passport origin" from the list
    And I select "Albania" as my "Country of birth" from the list
    And I select "Albania" as my "Country of citizenship" from the list
    And I select a date 4 "month(s)" in the "future" as my "Passport expiry date"
    And I select "General work visa" for "Permit type"
    And I complete "Permit number" with "2255447"
    And I select a date 3 "month(s)" in the "past" as my "Permit issue date"
    And I select a date 18 "month(s)" in the "future" as my "Permit expiry date"
    And I select "Single" for "Marital status"
    And I select "simmonds" as my "branch" from the list
    And I change the 1st contact detail to "0712345678"
    And I click on the "Next" button
    Then I should see the "current account product" "address" "edit" page
