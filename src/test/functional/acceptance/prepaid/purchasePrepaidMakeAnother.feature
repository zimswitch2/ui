Feature: Purchase prepaid
  As a registered internet banking user
  I want to	purchase prepaid products from MTN or Vodacom
  so that I can recharge these facilities

  Scenario: Make another prepaid purchase after completing one
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Prepaid" tile should be visible
    When I click on the "Prepaid" tile
    Then I should see the "Prepaid" page
    And the MTN tile should be visible
    When I click on the MTN tile
    Then I should see "Enter details" as the current step in the breadcrumb
    And I should see "ACCESSACC - 10-00-035-814-0" selected from the "From account" input
    And I should see "R 8 756.41" as the Available Balance
    And I should see "R 300.00" as the Available daily withdrawal limit
    And I should see "MTN" selected from the "Provider" input
    And the "Airtime" radio button should be checked
    And I should see information text notification with "Enter an amount from R 5 to R 500"
    And I should see that the "Next" button is disabled
    When I complete "Amount" with "20"
    And I complete "Cell phone number" with "0832190005"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following airtime recharge confirmation details:
      | From account      | ACCESSACC - 10-00-035-814-0 |
      | Available balance | R 8 756.41                  |
      | Provider          | MTN                         |
      | Voucher type      | Airtime                     |
      | Recharge amount   | R 20.00                     |
      | Cell phone number | 0832190005                  |
      | Transaction date  | PRESENT_DATE                |
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the following airtime recharge details:
      | From account      | ACCESSACC - 10-00-035-814-0 |
      | Available balance | R 8 756.41                  |
      | Provider          | MTN                         |
      | Voucher type      | Airtime                     |
      | Recharge amount   | R 20.00                     |
      | Cell phone number | 0832190005                  |
      | Transaction date  | PRESENT_DATE                |
    And I should see success notification with "Prepaid purchase was successful"
    And I should see "R 1 000.00" as the Available daily withdrawal limit
    When I click on the "Make another recharge" button
    Then I should see "Enter details" as the current step in the breadcrumb
    And I should see "ACCESSACC - 10-00-035-814-0" selected from the "From account" input
    And I should see "R 8 756.41" as the Available Balance
    And I should see "R 300.00" as the Available daily withdrawal limit
    And I should see "MTN" selected from the "Provider" input
    And the "Airtime" radio button should be checked
    And I should see information text notification with "Enter an amount from R 5 to R 500"