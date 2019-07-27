@emailTunleyFormalStatement
Feature: Formal statements
  As a registered Internet Banking User
  I want to request that a specific formal statement for my current account to be emailed to me
  So that I can have a record of my statements in my email inbox
    
  Scenario: Request Specific Formal Statement (Email)
    Given I have logged in as a "credentials" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "View formal statements" tile should be visible
    When I click on the "View formal statements" tile
    Then I should see the "Formal Statement" page
    When I click on the "email" icon
    Then I should see the "Email formal statement" modal window
    When I click on the "Cancel" button
    Then I should not see the "Email formal statement" modal window
    When I click on the "email" icon
    Then I should see the "Email formal statement" modal window
    And the Continue button should have analytics "Request specific Formal Statements.email"
    And I should see "ibrefresh@standardbank.co.za" in "Email address" textbox
    When I click on the "Continue" button
    Then I should not see the "Email formal statement" modal window
    And I should see success notification with "Formal statement successfully sent to ibrefresh@standardbank.co.za"


