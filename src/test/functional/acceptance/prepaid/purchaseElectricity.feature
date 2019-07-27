Feature: Purchase prepaid
  As Living the Life Linda
  I want to	buy electricity vouchers
  so that I may have access to electricity

  Scenario: Purchase prepaid electricity
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Prepaid" tile should be visible
    When I click on the "Prepaid" tile
    Then I should see the "Prepaid" page
    And the Prepaid Electricity tile should be visible
    When I click on the Prepaid Electricity tile
    Then I should see "Enter details" as the current step in the breadcrumb
    And I should see "ACCESSACC - 10-00-035-814-0" selected from the "From account" input
    And I should see "R 8 756.41" as the Available Balance
    And I should see "R 300.00" as the Available daily withdrawal limit
    And I should see "Electricity" selected from the "Provider" input
    And I should see that the Transaction date is the current date
    And I should see that the "Next" button is disabled
    When I complete "Meter number" with "0"
    Then I should see "Please enter a valid meter number" error message at the "Meter number" input field
    When I complete "Meter number" with "01060029402"
    Then I should not see an error message at the "Meter number" input field
    When I complete "Meter number" with "010600294020"
    Then I should see "Please enter a valid meter number" error message at the "Meter number" input field
    When I complete "Meter number" with "01060029402"
    And I complete "Amount" with "300"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following electricity recharge confirmation details:
      | From account      | ACCESSACC - 10-00-035-814-0 |
      | Available balance | R 8 756.41                  |
      | Provider          | Electricity                 |
      | Voucher type      | Electricity                 |
      | Recharge amount   | R 300.00                    |
      | Meter number      | 01060029402                 |
      | Transaction date  | PRESENT_DATE                |
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the following electricity recharge details:
      | From account                | ACCESSACC - 10-00-035-814-0 |
      | Available balance           | R 8 756.41                  |
      | Provider                    | Electricity                 |
      | Voucher type                | Electricity                 |
      | Recharge amount (incl. VAT) | R 300.00                    |
      | Meter number                | 01060029402                 |
      | Reference number            | Some reference              |
      | Voucher number              | 7987-2340-123               |
      | Quantity purchased          | kWh                         |
      | VAT registration number     | 12345                       |
      | Transaction date            | PRESENT_DATE                |
    And I should see success notification with "Prepaid purchase was successful"
    And I should see "R 1 000.00" as the Available daily withdrawal limit