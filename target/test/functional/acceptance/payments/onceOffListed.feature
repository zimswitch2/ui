Feature: Once off payment
  As registered Internet banking user
  I want to	make a once-off payment to a beneficiary in the CDI (company directory index)
  So that I can effect payment to a recipient

  Scenario: Once off payment of a listed beneficiary

    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Once-off payment" tile should be visible
    When I click on the "Once-off payment" tile
    Then I should see the "Once-off Payment" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I enter "TELKOM" as the listed beneficiary
    And I complete "Your reference" with "myref"
    And I complete "Beneficiary reference" with "herref"
    And I choose "No" for "Send a payment notification?"
    And I complete "Amount" with "100.00"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following payment confirmation details for the listed beneficiary:
      | From account          | ACCESSACC - 10-00-035-814-0 |
      | Available balance     | R 8 756.41                  |
      | Beneficiary name      | TELKOM                      |
      | Beneficiary reference | herref                      |
      | Your reference        | myref                       |
      | Payment date          | PRESENT_DATE                |
      | Amount                | R 100.00                    |
    When I click on the "Confirm" button
    Then I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see success notification with "Payment was successful"
    And I should see the following payment details for the listed beneficiary:
      | From account          | ACCESSACC - 10-00-035-814-0 |
      | Available balance     | R 8 656.41                  |
      | Beneficiary name      | TELKOM                      |
      | Beneficiary reference | herref                      |
      | Your reference        | myref                       |
      | Payment date          | PRESENT_DATE                |
      | Amount                | R 100.00                    |
    When I click on the "Back to transactions" button
    Then I should see the "Transact" page