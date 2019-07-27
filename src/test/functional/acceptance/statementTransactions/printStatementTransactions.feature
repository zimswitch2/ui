@printTransactions
Feature: Download Transactions
  As a registered Online Banking User
  I want to	print only transactions that have been returned to my tablet or computer based on my filters
  so that I have a hard-copy of the transaction history for my perusal and usage

  Scenario: PRINT A STATEMENT
    Given I have logged in as a "credentials" customer
    Then I should see the "Account Summary" page
    When I click on a specific account in account summary
    Then I should see the "Transactions" page heading
    Then I should see that the "PRINT" button is enabled