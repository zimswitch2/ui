Feature: Payment beneficiary
  As a Standard Bank customer
  I want to	pay a single beneficiary
  So that I can pay my debt to a friend

  Scenario: A customer attempts to pay a beneficiary
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And the following beneficiaries should be displayed:
      | Beneficiary name | Your reference | Group        | Last payment date | Last amount paid |
      | Angela Bowman    | Roommate       |              |                   |                  |
      | Danielle Ward    | Sister         | Alegtest     | 12 November 2013  | R 21.00          |
      | Edgars           | Fancy shoes    |              | 9 November 2013   | R 12.00          |
      | Hannah Walters   | Mother         | Test 3       |                   |                  |
      | Paris McGlashan  | Neighbour      | Alegtest     | 4 February 2014   | R 56.00          |
      | Woolworths       | Groceries      | Groups Test  |                   |                  |
      | ze demo          | CAN NOT EDIT   |              | 12 November 2013  | R 21.00          |
    When I click the "pay" action on the first row
    Then I should see "Enter details" as the current step in the breadcrumb
    And I should see "R 8 756.41" as the Available Balance
    When I select "ACCESSACC - 10-00-530-418-2" for "account"
    Then I should see "- R 23.98" as the Available Balance
    Then I should see that the "Next" button is disabled
    When I select "ACCESSACC - 10-00-035-814-0" for "account"
    Then I should see that the "Next" button is disabled
    When I complete "Amount" with "9000.00"
    Then The "Amount" input field should have a validation message of "The amount exceeds your available balance"
    And I should see that the "Next" button is disabled