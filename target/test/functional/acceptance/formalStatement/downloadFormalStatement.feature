@downloadTunleyFormalStatement
Feature: Formal statements
  As a registered Internet Banking User
  I want to download a formal statement for my current account
  So that I can save my statement for my personal records
    
  Scenario: Download Formal Statement for Current Account
    Given I have logged in as a "credentials" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "View formal statements" tile should be visible
    When I click on the "View formal statements" tile
    Then I should see the "Formal Statement" page
    When I click on the "download" icon
    Then I should see the "Download Encrypted PDF" modal window
    And the Download PDF button should have analytics "Download List of Formal Statements.download"
    When I click on the "Cancel" button
    Then I should not see the "Download Encrypted PDF" modal window



