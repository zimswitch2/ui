@rcp @ao
Feature: RCP product
  As a standard bank customer
  I need to be able to apply for rcp
  So that I can manage my finances

  @excludeWhen_newCaptureCustomerInformation
  Scenario: A customer that can apply for rcp with transactional account without a preferred branch
    Given I want to apply for "RCP" account as a customer "without a specified preferred branch"
    And I click on the "Apply for Account" link
    And I click on the "Apply now" button in "Revolving credit plan" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "rcp product" "profile" page
    When I click on the link containing "Submit" text
    And I click on the "Get offer" button
    And I select "Rosebank" as my "preferred branch" from the list
    And I click on the "Accept quote" button
    Then I should see the "Confirm" title
    And I should see the "Rcp Product" "confirm" page

  @excludeWhen_newCaptureCustomerInformation
  Scenario: A customer that can apply for rcp with transactional account with a preferred branch
    Given I want to apply for "RCP" account as a customer "who does not have an existing RCP account"
    When I click on the "Apply for Account" link
    Then I should see the "Banking Solutions for You" title
    When I click on the "Details" button in "Revolving credit plan" section
    Then I should see the "Apply for Loan" title
    And I should see the "Rcp Product" page
    When I click on the "Apply now" button
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "rcp product" "profile" page
    When I click on the link containing "Submit" text
    And I click on the "Get offer" button
    Then I should see the "Your Revolving Credit Plan" title
    And I should see the "Rcp Product" "offer" page
    When I update the loan amount to "9000"
    Then the minimum monthly repayment should be "R 324.11"
    And I should see the following rcp offer details
      | Minimum monthly repayment | R 324.11  |
      | Interest rate             | 21%       |
      | Repayment term            | 54 months |
    And I should see information text notification with "Please enter an amount between R 8000 and R 120000"
    When I click on the "View quote" button
    Then I should see the rcp quote "displayed"
    When I click on the close quote icon
    Then I should see the rcp quote "not displayed"
    When I click on the "Accept quote" button
    Then I should see the "Confirm" title
    And I should see the "Rcp Product" "confirm" page
    And I should see the following rcp confirmed offer details
      | Account type                 | Revolving Credit Plan Loan |
      | Revolving Credit Plan amount | R 9 000.00                 |
      | Interest rate                | 21%                        |
      | Loan disbursement account    | 30-249-044-2               |  
      | Repayment account            | 30-249-044-2               |
      | Repayment term               | 54 months                  |
      | Repayment date               | 1st day of every month     |
      | Monthly repayment amount     | R 324.11                   |
    And I accept "You have read, understood"
    When I click on the "Confirm" button
    Then I should see the "Application Successful" title
    And I should see the "Rcp Product" "finish" page
    And I should see the following rcp finish offer details
      | Account type             | REVOLVING CREDIT PLAN LOAN |
      | Account number           | 32569017001                |
      | RCP amount               | R 9 000.00                 |
      | Interest rate            | 21%                        |
      | Monthly repayment amount | R 324.11                   |
      | Preferred branch         | Ballito                    |
      | Date accepted            | 13 September 2014          |
      | Time accepted            | 09:08:40                   |
    When I click on the "Back" button
    Then I should see the "Account Summary" page

  @excludeWhen_newCaptureCustomerInformation
  Scenario: A customer that can apply for rcp without transactional account
    Given I want to apply for "RCP" account as a customer "without a transactional account"
    When I click on the "Apply for Account" link
    Then I should see the "Banking Solutions for You" title
    When I click on the "Details" button in "Revolving credit plan" section
    Then I should see the "Apply for Loan" title
    And I should see the "Rcp Product" page
    When I click on the "Apply now" button
    Then I should see the "Before You Start Your Application" title
    And I should see the "Rcp Product" "pre-screen" page
    When I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "Your Details" title
    And I should see the "Rcp Product" "profile" page
    Then I should see the "rcp product" "profile" page
    When I click on the link containing "Submit" text
    Then I should see the "Your Details" title
    And I should see the "Rcp Product" "submit" page
    When I click on the "Get offer" button
    Then I should see the "Your Revolving Credit Plan" title
    And I should see the "Rcp Product" "offer" page
    And I select "ABSA" as my "Bank" from the list
    And I select "63200500" as my "Branch" from the list
    And I complete "Account number" with "123456789"
    And I click on the "Accept quote" button
    Then I should see the "Confirm" title
    And I should see the "Rcp Product" "confirm" page
    And I should see the following rcp confirmed offer details
      | Account type                 | Revolving Credit Plan Loan |
      | Revolving Credit Plan amount | R 120 000.00               |
      | Interest rate                | 21%                        |
      | Loan disbursement account    | 123456789                  |
      | Repayment account            | 123456789                  |
      | Repayment term               | 54 months                  |
      | Repayment date               | 1st day of every month     |
      | Monthly repayment amount     | R 3 543.02                 |
    And I accept "You have read, understood"
    When I click on the "Confirm" button
    Then I should see the "Application Successful" title
    And I should see the "Rcp Product" "finish" page
    When I click on the "Back" button
    Then I should see the "Account Summary" page

  @excludeWhen_newCaptureCustomerInformation
  Scenario: A customer that with an RCP product but not linked to card
    Given I want to apply for "RCP" account as a customer "with an RCP product that is not linked to a card"
    And I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Apply now" button in "Revolving credit plan" section
    Then I should see the "Before You Start Your Application" title
    And I should see the "Rcp Product" "pre-screen" page
    When I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "Your Details" title
    And I should see the "Rcp Product" "profile" page
    Then I should see the "rcp product" "profile" page
    When I click on the link containing "Submit" text
    And I click on the "Get offer" button
    Then I should see the "Application Result" title
    And I should see the "Rcp Product" "declined" page
    And I should see information text notification with "You already have a Revolving Credit Plan (RCP)"
    When I click on the "Back" button
    Then I should see the "Account Summary" page

  @excludeWhen_viewTransactions
  Scenario: A customer that with an RCP product but linked to card
    Given I want to apply for "RCP" account as a customer "with an RCP product that is linked to a card"
    And I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "5592-0070-1204-1590" link
    Then I should see the "Statements" "5592-0070-1204-1590" page
    And I should see the "Transaction History" title
    When I click on the "Back" button
    Then I should see the "Available Products" page
    When I click on the "Details" button in "Revolving credit plan" section
    Then I should see the "Rcp Product" page
    And I should see information notification with "You already have a Revolving Credit Plan (RCP)"

  @viewTransactions
  Scenario: A customer that with an RCP product but linked to card
    Given I want to apply for "RCP" account as a customer "with an RCP product that is linked to a card"
    And I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "5592-0070-1204-1590" link
    Then I should see the "Transactions" page heading
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Details" button in "Revolving credit plan" section
    Then I should see the "Rcp Product" page
    And I should see information notification with "You already have a Revolving Credit Plan (RCP)"

  @customerManagementV4, @excludeWhen_newCaptureCustomerInformation
  Scenario: When a customer already has an RCP product linked to their ID
    Given I want to apply for "RCP" account as a customer "with an existing RCP product"
    And I click on the "Open an account" button
    Then I should see the "Banking Solutions for You" title
    When I click on the "Details" button in "Revolving credit plan" section
    Then I should see the "Apply for Loan" title
    And I should see the "Rcp Product" page
    When I click on the "Apply now" button
    Then I should see the "Before You Start Your Application" title
    And I should see the "Rcp Product" "pre-screen" page
    When I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the "Your Details" title
    When I select "Sir" for "Title"
    And I enter the following details
      | Surname     | Hmmm          |
      | First names | Oh My --      |
      | Initials    | OM            |
      | ID number   | 8203235277086 |
    And I select "South Africa" as my "Nationality" from the list
    And I select "South Africa" as my "Country of residence" from the list
    And I select "South Africa" as my "Country of birth" from the list
    And I select "Single" for "Marital status"
    And I select "simmonds" as my "branch" from the list
    And I change the 1st contact detail to "0712345678"
    And I click on the "Next" button
    And I enter the following details
      | Street      | 7 Simmonds street |
      | Suburb      | Marshalltown      |
      | City/town   | Johannesburg      |
      | Postal Code | 2001              |
    And I select "Tenant" for "Residential Status *"
    And I choose "Yes" for "Same as home address"
    And I click on the "Save" button
    Then I should see the "Application Result" title
    And I should see the "Rcp Product" "declined" page

  Scenario: When an existing customer that has accepted an rcp offer
    Given I want to apply for "RCP" account as a customer "who has accepted an RCP offer"
    And I click on the "Apply for Account" link
    Then I should see the "Banking Solutions for You" title
    And I should see the "Available Products" page
    And I should see "40-012-322-1" in the "Revolving credit plan" section
    And I should see "Application being processed" in the "Revolving credit plan" section
    And I should see "11 September 2014" in the "Revolving credit plan" section

  Scenario: When a new to bank customer that has accepted an rcp offer
    Given I want to apply for "RCP" account as a customer "who is new to bank and has accepted an RCP offer"
    And I click on the "Open an account" link
    Then I should see the "Banking Solutions for You" title
    And I should see the "Available Products" page
    And I should see "40-012-322-1" in the "Revolving credit plan" section
    And I should see "Application being processed" in the "Revolving credit plan" section
    And I should see "11 September 2014" in the "Revolving credit plan" section

  Scenario: When an existing customer has a pending offer not expiring soon
    Given I want to apply for "RCP" account as a customer "who has a pending RCP offer and a transactional account"
    And I click on the "Apply for Account" link
    Then I should see the "Banking Solutions for You" title
    And I should see the "Available Products" page
    And I should see "Offer expires soon" in the "Revolving credit plan" section
    When I click on the "Complete Now" button in "Revolving credit plan" section
    Then I should see "4" steps
    And I should see the current step as "Offer"

  Scenario: When an existing customer has a pending offer expiring soon
    Given I want to apply for "RCP" account as a customer "who has a pending RCP offer that is not about to expire and a transactional account"
    And I click on the "Apply for Account" link
    Then I should see the "Banking Solutions for You" title
    And I should see the "Available Products" page
    And I should see "Applied on" in the "Revolving credit plan" section
    When I click on the "Complete Now" button in "Revolving credit plan" section
    Then I should see "4" steps
    And I should see the current step as "Offer"

  Scenario: When a new customer has a pending offer expiring soon
    Given I want to apply for "RCP" account as a customer "who is new to bank and has a pending RCP offer that is about to expire"
    And I click on the "Open an account" link
    Then I should see the "Banking Solutions for You" title
    And I should see the "Available Products" page
    And I should see "Offer expires soon" in the "Revolving credit plan" section
    When I click on the "Complete Now" button in "Revolving credit plan" section
    Then I should see "4" steps
    And I should see the current step as "Offer"
    And I select "Rosebank" as my "preferred branch" from the list
    And I select "ABSA" as my "Bank *" from the list
    And I select "63200500" as my "Branch *" from the list
    And I complete "Account number" with "123456789"
    And I click on the "Accept quote" button
    Then I should see the current step as "Confirm"
    And I should see the "Rcp Product" "confirm" page
    And I should see the following rcp confirmed offer details
      | Account type                 | Revolving Credit Plan Loan |
      | Revolving Credit Plan amount | R 120 000.00               |
      | Interest rate                | 21%                        |
      | Loan disbursement account    | 123456789                  |
      | Repayment account            | 123456789                  |
      | Repayment term               | 54 months                  |
      | Repayment date               | 1st day of every month     |
      | Monthly repayment amount     | R 3 543.02                 |
    And I accept "You have read, understood"
    When I click on the "Confirm" button
    Then I should see the "Application Successful" title
    And I should see the "Rcp Product" "finish" page
    And I should see the following rcp finish offer details
      | Account type             | REVOLVING CREDIT PLAN LOAN |
      | Account number           | 32569017001                |
      | RCP amount               | R 120 000.00               |
      | Interest rate            | 21%                        |
      | Monthly repayment amount | R 3 543.02                 |
      | Preferred branch         | Rosebank                   |
      | Date accepted            | 13 September 2014          |
      | Time accepted            | 09:08:40                   |
