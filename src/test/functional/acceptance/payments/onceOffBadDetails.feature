Feature: Once off payment
  As a registered Internet banking user
  I want to	make a once-off payment to a private beneficiary
  So that I can pay individuals and companies that are not in my beneficiary listing

  Scenario:
  Should fail to process payment when a customer attempts to perform a once off payment with bad
  beneficiary details

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
    And I click on the "Submit" button
    Then I should see error notification with "Could not process payment: Bad Beneficiary Details"
    And I should see "Bad Beneficiary" in the "Name" input
    And I should see "STANDARD BANK" in the "Bank" input
    And I should see "51001 - SINGL IBT SBSA" in the "Branch" input
    And I should see "421884606" in the "Account number" input
    And I should see "Sister" in the "Your reference" input
    And I should see "Invoice 123" in the "Beneficiary reference" input
    And I should see "101.00" in the "Amount" input