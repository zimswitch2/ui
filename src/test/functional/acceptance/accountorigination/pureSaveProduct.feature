@pureSaveProduct

Feature: pureSave product

  Scenario: Should show the PureSave product page when I click on the details button
    Given I have logged in
    When I click on the "Apply for Account" link
    Then I should see that the "Browse" button is enabled
    When I click on the "Browse" button
    Then I should see the "Savings and Investments" page
    And I should see "Simple savings with instant access to your money" in the "PureSave" section
    When I click on the "Details" button in "PureSave" section
    Then I should see the "Apply for Savings Account" page
    And I should see the product description as "PureSave is an easy means to saving. Save what you can - and gain instant access to your money when you need it." on the pureSave page
    And I should see the "Highlights" heading on the pureSave page
    And I should see the "How to qualify" heading on the pureSave page
    And I should see the "What it costs" panel heading on the pureSave page
    And I should see the "What you'll need" panel heading on the pureSave page
    And I should see that the "Back to Savings and Investments" button is enabled
    And I should see "PureSave pricing (PDF)" link
    And I should see that the "Apply now" button is enabled
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    And I should see that the "Next" button is disabled
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "PureSave Account Details" page
    And I should see information text notification with "Minimum opening balance: R 50"
    And I should see "Transfer" as the current step in the breadcrumb
    When I select the "ACCESSACC - 10-00-530-418-2" option of the "Transfer opening amount from" dropdown
    And I should see an amount error displaying "The amount exceeds your available balance"
    When I select the "ACCESSACC - 10-00-035-814-0" option of the "Transfer opening amount from" dropdown
    And I complete "Amount" with "50.998"
    And I should see an amount error displaying "Please enter the amount in a valid format"
    And I complete "Amount" with "12"
    Then I should see an amount error displaying "Enter an amount of at least R50"
    And I complete "Amount" with "00"
    Then I should see an amount error displaying "Please enter an amount greater than zero"
    And I complete "Amount" with "60"
    When I click on the "Next" button
    Then I should see the "Confirm" page
    And I should see the "Your PureSave Account" sub heading
    And I should see the "Transfer opening amount from" label
    And I should see the "Amount" label
    And I should see the value "ACCESSACC - 10-00-035-814-0"
    And I should see the value "R 60.00"
    And I should see that the "Confirm" button is disabled
    When I click on the "You have read, understood and agree to the" checkbox
    Then I should see that the "Confirm" button is enabled
    When I click on the "Confirm" button
    Then I should see the "Application Successful" page

  Scenario: Canceling an application of a pureSave account
    Given I have logged in
    When I click on the "Apply for Account" link
    Then I should see that the "Browse" button is enabled
    When I click on the "Browse" button
    Then I should see the "Savings and Investments" page
    When I click on the "Details" button in "PureSave" section
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "Cancel" button
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "PureSave Account Details" page
    When I click on the "Cancel" button
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "PureSave Account Details" page
    When I click on the "Next" button
    Then I should see the "Confirm" page
    When I click on the "Cancel" button
    Then I should see the "Apply for Savings Account" page

  Scenario: should display 'PureSave Account Details' screen after clicking the Back button in Confirm screen
    Given I have logged in
    When I click on the "Apply for Account" link
    Then I should see that the "Browse" button is enabled
    When I click on the "Browse" button
    Then I should see the "Savings and Investments" page
    When I click on the "Details" button in "PureSave" section
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "PureSave Account Details" page
    When I click on the "Next" button
    Then I should see the "Confirm" page
    When I click on the "Back" button
    Then I should see the "PureSave Account Details" page

  Scenario: applying for an account as a customer who has incomplete country of birth
    Given I want to apply for an account as a customer "who has incomplete country of birth"
    When I click on the "Apply for Account" link
    Then I should see that the "Browse" button is enabled
    When I click on the "Browse" button
    Then I should see the "Savings and Investments" page
    When I click on the "Details" button in "PureSave" section
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "Your Details" page
    And I should see that the "Title" is "Mr"
    And I should see that the "Surname" is "Devtwo"
    And I should see that the "First names" is "Testing"
    And I should see that the "Initials" is "T"
    And I should see that the "Gender" is "Male"
    And I should see that the "ID number" is "*********6082"
    And I should see that the "Date of birth" is "23 September 1976"
    And I should see that the "Marital status" is "Single"
    And I should see that the "Your branch" is "Ballito"
    And I select "South Africa" as my "Country of birth" from the list
    Then I should see that the "Save" button is enabled
    When I click on the "Save" button
    And I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I should see that the "Submit" button is enabled
    When I click on the "Submit" button
   # Then I should see the "Your Details" page
    And I should see that the "Country of birth" is "South Africa"
    And I should see that the "Cell phone" is "******5887"
    And I should see that the "E-mail address" is "i***********@s***********.c*.z*"
    And I should see that the "E-mail address" is "J****.S*******@s***********.c*.z*"
    And I should see that the "Preferred communication language" is "English"
    When I click on the "Next section" link
    Then I should see that the "Street" is "5 Simmonds St"
    And I should see that the "Suburb" is "Marshalltown"
    And I should see that the "City/town" is "Johannesburg"
    And I should see that the "Postal code" is "2001"
    And I should see that the "Residential Status" is "Owner"
    And I should see that the "Street/PO Box" is "52 Anderson St"
    When I click on the "Next section" link
    Then I should see that the "Employed" is "Yes"
    And I should see that the "Employer name" is "SBSA"
    And I should see that the "Start date" is "1 February 2004"
    And I should see that the "Industry" is "Construction"
    And I should see that the "Occupation level" is "Supervisor"
    And I should see that the "Status" is "Contractor"
    And I should see that the "Level of education" is "B compt"
    When I click on the "Next section" link
    Then I should see that the "Gross salary" is "R 60 000.00"
    And I should see that the "Total income" is "R 60 000.00"
    And I should see that the "Total expenses" is "R 60 000.00"
    When I click on the "Next section" link
    #Then I should see the "Your Detials" page
    When I click on the "Submit" button
    Then  I should see the "PureSave Account Details" page


  Scenario: Canceling an application as a customer "who has incomplete country of birth"
    Given I want to apply for an account as a customer "who has incomplete country of birth"
    When I click on the "Apply for Account" link
    Then I should see that the "Browse" button is enabled
    When I click on the "Browse" button
    Then I should see the "Savings and Investments" page
    When I click on the "Details" button in "PureSave" section
    Then I should see the "Apply for Savings Account" page
    When I click on the "Apply now" button
    Then I should see a popup with the header "Before We Start"
    When I click on the "You agree to us doing a fraud check and sharing this information with the South African Fraud Prevention Service." checkbox
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "Your Details" page
    And I select "South Africa" as my "Country of birth" from the list
    When I click on the "Back" button
    Then I should see a popup with the header "Cancel changes?"
    When I click on the "Confirm" button
    Then I should see the "Apply for Savings Account" page