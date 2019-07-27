Feature: Once off payment
  As a registered Internet banking user
  I want to	make a once-off payment to a private beneficiary
  So that I can pay individuals and companies that are not in my beneficiary listing

  Scenario: Should return to dashboard when a customer attempts to perform a once off payment but cancel during OTP

    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Once-off payment" tile should be visible
    When I click on the "Once-off payment" tile
    Then I should see the "Once-off Payment" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Bad Beneficiary"
    And I complete "Bank" with "Standard Bank"
    And I complete "Branch" with "51001 - SINGL IBT SBSA"
    And I complete "Account number" with "421884606"
    And I complete "Your reference" with "Sister"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I choose "No" for "Send a payment notification?"
    And I complete "Amount" with "101.00"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following payment confirmation details:
      | From account          | ACCESSACC - 10-00-035-814-0 |
      | Available balance     | R 8 756.41                  |
      | Bank                  | STANDARD BANK               |
      | Branch                | SINGL IBT SBSA (51001)      |
      | Account number        | 421884606                   |
      | Beneficiary name      | Bad Beneficiary             |
      | Beneficiary reference | Invoice 123                 |
      | Your reference        | Sister                      |
      | Payment date          | PRESENT_DATE                |
      | Amount                | R 101.00                    |
    When I click on the "Confirm" button
    Then I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Cancel" button
    Then I should see the "Transact" page