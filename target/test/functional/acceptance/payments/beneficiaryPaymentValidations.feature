Feature: Payment beneficiary
  As a Standard Bank customer
  I want to	pay a single beneficiary
  So that I can pay my debt to a friend

  Scenario: Input validations should correctly fire when a customer attempts to pay a beneficiary
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
    When I choose "No" for "Send a payment notification for this transaction?"

    And I complete "Amount" with "100.00"
    Then I should see that the "Next" button is enabled
    When I complete "Amount" with "@@$$"
    Then The "Amount" input field should have a validation message of "Please enter the amount in a valid format"
    And I should see that the "Next" button is disabled
    When I complete "Amount" with "100.00"
    And I should see that the "Next" button is enabled

    When I complete "Beneficiary reference" with "Ben ref $"
    Then "Beneficiary reference" should have a validation message of "Please enter a valid beneficiary reference"
    And I should see that the "Next" button is disabled
    When I complete "Beneficiary reference" with "Beneficiary reference too long"
    Then "Beneficiary reference" should have a validation message of "Cannot be longer than 25 characters"
    When I complete "Beneficiary reference" with ""
    Then "Beneficiary reference" should have a validation message of "Required"
    When I complete "Beneficiary reference" with "Ben ref"
    And I should see that the "Next" button is enabled

    When I complete "Your reference" with "Your ref $"
    Then "Your reference" should have a validation message of "Please enter a valid reference"
    And I should see that the "Next" button is disabled
    When I complete "Your reference" with "Your reference too long"
    Then "Your reference" should have a validation message of "Cannot be longer than 12 characters"
    When I complete "Your reference" with ""
    Then "Your reference" should have a validation message of "Required"
    When I complete "Your reference" with "Your ref"
    And I should see that the "Next" button is enabled