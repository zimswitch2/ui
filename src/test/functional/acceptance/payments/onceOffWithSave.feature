Feature: Once off payment
  As a registered Internet banking user
  I want to	make a once-off payment to a private beneficiary
  So that I can pay individuals and companies that are not in my beneficiary listing

  Scenario: A customer pays a beneficiary once off whilst saving the beneficiary

    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Once-off payment" tile should be visible
    When I click on the "Once-off payment" tile
    Then I should see the "Once-off Payment" page
    And I should see "R 8 756.41" as the Available Balance
    And I should see "R 10 000.00" as the Monthly Payment Limit
    And I should see "R 4 000.01" as the Used limit
    And I should see "R 5 999.99" as the Available limit
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Danielle Ward"
    And I complete "Bank" with "Standard Bank"
    And I complete "Branch" with "51001 - SINGL IBT SBSA"
    And I complete "Account number" with "421884606"
    And I complete "Your reference" with "Sister"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I choose "No" for "Send a payment notification?"
    And I choose "Yes" for "Save as a beneficiary"
    And I complete "Amount" with "100.00"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following payment confirmation details:
      | From account                                 | ACCESSACC - 10-00-035-814-0 |
      | Available balance                            | R 8 756.41                  |
      | Bank                                         | STANDARD BANK               |
      | Branch                                       | SINGL IBT SBSA (51001)      |
      | Account number                               | 421884606                   |
      | Beneficiary name                             | Danielle Ward               |
      | Danielle Ward will be saved as a beneficiary |                             |
      | Beneficiary reference                        | Invoice 123                 |
      | Your reference                               | Sister                      |
      | Payment date                                 | PRESENT_DATE                |
      | Amount                                       | R 100.00                    |
    When I click on the "Confirm" button
    Then I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see success notification with "Payment was successful. New beneficiary was added"
    And I should see the following payment details:
      | From account                             | ACCESSACC - 10-00-035-814-0 |
      | Available balance                        | R 8 656.41                  |
      | Beneficiary name                         | Danielle Ward               |
      | Danielle Ward was saved as a beneficiary |                             |
      | Bank                                     | STANDARD BANK               |
      | Branch                                   | SINGL IBT SBSA (51001)      |
      | Account number                           | 421884606                   |
      | Your reference                           | Sister                      |
      | Beneficiary reference                    | Invoice 123                 |
      | Payment date                             | PRESENT_DATE                |
      | Amount                                   | R 100.00                    |
    When I click on the "Back to transactions" button
    Then I should see the "Transact" page