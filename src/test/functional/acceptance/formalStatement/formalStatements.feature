@viewFormalStatementList
Feature: Formal statements
  As a registered Internet Banking User
  I want to view a list of my formal statement for my current account
  So that I can view my transactions
  
  Scenario: Access "View formal statements"
    Given I have logged in as a "credentials" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "View formal statements" tile should be visible
    When I click on the "View formal statements" tile
    Then I should see the "Formal Statement" page
    And the following formal statements should be displayed
      | Statement period | Statement from                        | File size |
      | September 2015   | 1 September 2015 to 30 September 2015 | 32.0 Bytes|
      | August 2015      | 1 August 2015 to 31 August 2015       | 3.1 KB    |
      | July 2015        | 1 July 2015 to 31 July 2015           | 3.1 MB    |
    And the search should have analytics "Request specific Formal Statements.search"
    #Search with positive results
    When I search for formal statements by "July"
    Then the following formal statements should be displayed
      | Statement period | Statement from                        | File size |
      | July 2015        | 1 July 2015 to 31 July 2015           | 3.1 MB    |
    #Search returns no results
    When I search for formal statements by "January"
    Then the following formal statements should be displayed
      | Statement period | Statement from | File size |
    When I click on the "Back" button
    Then I should see the "Transact" page




