@updateBeneficiaryReferencesOnPay
Feature: Payment beneficiary
  As a Standard Bank customer
  I want to	pay a single beneficiary
  So that I can pay my debt to a friend

  Scenario: A customer pays a beneficiary without sending a payment notification and requests references to be permanently updated
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And the following beneficiaries should be displayed:
      | Beneficiary name | Your reference | Group       | Last payment date | Last amount paid |
      | Angela Bowman    | Roommate       |             |                   |                  |
      | Danielle Ward    | Sister         | Alegtest    | 12 November 2013  | R 21.00          |
      | Edgars           | Fancy shoes    |             | 9 November 2013   | R 12.00          |
      | Hannah Walters   | Mother         | Test 3      |                   |                  |
      | Paris McGlashan  | Neighbour      | Alegtest    | 4 February 2014   | R 56.00          |
      | Woolworths       | Groceries      | Groups Test |                   |                  |
      | ze demo          | CAN NOT EDIT   |             | 12 November 2013  | R 21.00          |
    When I click the "pay" action on the first row
    Then I should see "Enter details" as the current step in the breadcrumb
    And I should see "R 8 756.41" as the Available Balance
    And I complete "Beneficiary reference" with "Something else"
    Then I should see "Always use this reference" checkbox
    When I click on the "Always use this reference" checkbox
    And I complete "Your reference" with "My other"
    Then I should see 2nd "Always use this reference" checkbox
    When I choose "No" for "Send a payment notification for this transaction?"
    And I complete "Amount" with "100.00"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the OTP page with "Pay single beneficiary" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following payment confirmation details:
      | From account          | ACCESSACC - 10-00-035-814-0 |
      | Available balance     | R 8 756.41                  |
      | Beneficiary name      | Angela Bowman               |
      | Beneficiary reference | Something else              |
      | Your reference        | My other                    |
      | Payment date          | PRESENT_DATE                |
      | Amount                | R 100.00                    |
    When I click on the "Confirm" button
    Then I should see success notification with "Payment was successful"
    And I click on the "Back to beneficiaries" button
    Then I should see the "List of Beneficiaries" page