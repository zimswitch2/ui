@downloadTransactionsCsv
Feature: Download Transactions
  As a registered Online Banking User
  I want to	download my transaction history for a particular account
  so that I have an offline copy

  Scenario: CSV
    Given I have logged in as a "credentials" customer
    Then I should see the "Account Summary" page
    When I click on a specific account in account summary
    Then I should see the "Transactions" page heading
    Then I should see that the "Download" button is enabled
    When I click on the "Download" button
    And "CSV" button should be available for click
    And "CSV" button should have "Download CSV Format" analytics tags

