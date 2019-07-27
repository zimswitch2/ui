@instantMoney
Feature: Send Instant money
  As an instant money user
  I need to be able to create instant money vouchers
  So that I can send instant money

  Scenario: Create instant money voucher positive scenario
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Instant Money" tile should be visible
    When I click on the "Instant Money" tile
    Then I should see the "Instant Money" page
    When I click on the "Back to transact" button
    Then I should see the "Transact" page
    When I click on the "Instant Money" tile
    And I click on the "Send money" button
    Then I should see the "Instant Money" "details" page
    And I complete "Cell phone number" with "0111111111"
    And I complete "Create cash collection PIN" with "9753"
    And I complete "Confirm cash collection PIN" with "9753"
    And I complete "Amount" with "60"
    And I click on the "terms and conditions" link
    Then I should see the "Disclaimer" modal window
    When I click on the "Close" button
    And I accept "You agree to the Instant Money terms and conditions"
    When I click on the "Next" button
    Then I should see the "Instant Money" "confirm" page
    And I should see the following send instant money confirm details
      | From Account                 | ACCESSACC - 10-00-035-814-0 |
      | Available Balance            | R 8 756.41                  |
      | Cell phone number            | 0111111111                  |
      | Amount                       | R 60                        |
    When I click on the "Modify" button
    Then I should see the "Instant Money" "details" page
    And the "Cell phone number" input field should be "0111111111"
    And the "Create cash collection PIN" input field should be "9753"
    And the "Confirm cash collection PIN" input field should be "9753"
    And the "Amount" input field should be "60"
    And the "You agree to the Instant Money terms and conditions" checkbox should be checked
    When I click on the "Next" button
    Then I should see the "Instant Money" "confirm" page
    When I click on the "Confirm" button
    Then I should see the OTP page with "Instant Money" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "Instant Money" "success" page
    And I should see success notification with "Instant Money transfer successful"
    And I should see the following send instant money successful details
      | From Account                 | ACCESSACC - 10-00-035-814-0 |
      | Available Balance            | R 8 756.41                  |
      | Cell phone number            | 0111111111                  |
      | Amount                       | R 60                        |
      | Voucher number               | 111111111123456789          |
      | Transaction date             | PRESENT_DATE                |


  Scenario: Create instant money voucher negative scenarios
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Instant Money" tile should be visible
    When I click on the "Instant Money" tile
    Then I should see the "Instant Money" page
    When I click on the "Send money" button
    Then I should see the "Instant Money" "details" page
    When I click on "CellNumber"
    And I click on "VoucherPin"
    And I click on "ConfirmVoucherPin"
    And I click on "amount"
    Then I should see "Please enter the recipient's cell phone number" error message at the "Cell phone number" input field
    And I should see "Please create a PIN which the recipient will use" error message at the "Create cash collection PIN" input field
    And I should see "Please re-enter the cash collection PIN" error message at the "Confirm cash collection PIN" input field
    When I complete "Cell phone number" with "a"
    Then I should see "Please enter a 10-digit cell phone number" error message at the "Cell phone number" input field
    When I complete "Create cash collection PIN" with "1234"
    Then I should see "Please do not use sequential numbers (e.g. 4321)" error message at the "Create cash collection PIN" input field
    When I complete "Create cash collection PIN" with "1446"
    Then I should see "Please do not repeat numbers (e.g. 1223)" error message at the "Create cash collection PIN" input field
    When I complete "Create cash collection PIN" with "&"
    Then I should see "Please enter a valid cash collection PIN" error message at the "Create cash collection PIN" input field
    When I complete "Create cash collection PIN" with "1919"
    And I complete "Confirm cash collection PIN" with "1818"
    Then I should see "The two PINs do not match" error message at the "Confirm cash collection PIN" confirmation input field
    When I complete "Amount" with "5500"
    Then I should see an amount error displaying "Please enter an amount from R 50 to R 5000"
    When I complete "Amount" with "310"
    Then I should see an amount error displaying "The amount exceeds your daily withdrawal limit"
    When I select "10-00-035-814-3" for "From account"
    And I complete "Amount" with "250"
    Then I should see an amount error displaying "The amount exceeds your available balance"
    When I complete "Amount" with "20"
    Then I should see an amount error displaying "Please enter an amount from R 50 to R 5000"
    When I complete "Amount" with "59"
    Then I should see an amount error displaying "Please enter an amount that is a multiple of R 10"
    When I click on the "Cancel" button
    Then I should see the "Instant Money" page

  Scenario: Create instant money voucher negative scenario amount exceeding monthly limit of 25000
    Given I have logged in as a "instant money" customer
    Then I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Instant Money" tile should be visible
    When I click on the "Instant Money" tile
    Then I should see the "Instant Money" page
    When I click on the "Send money" button
    Then I should see the "Instant Money" "details" page
    When I complete "Amount" with "4500"
    Then I should see an amount error displaying "The amount exceeds your monthly limit of R 25000"

  Scenario: Create instant money voucher negative scenarios, Cancel button on Confirm Instant Money and OTP Screen
    Given I have logged in
    When I click on the "Transact" link
    And I click on the "Instant Money" tile
    And I click on the "Send money" button
    And I complete "Cell phone number" with "0111111111"
    And I complete "Create cash collection PIN" with "9753"
    And I complete "Confirm cash collection PIN" with "9753"
    And I complete "Amount" with "60"
    And I accept "You agree to the Instant Money terms and conditions"
    And I click on the "Next" button
    And I click on the "Cancel" button
    Then I should see the "Instant Money" page
    When I click on the "Send money" button
    And I complete "Cell phone number" with "0111111111"
    And I complete "Create cash collection PIN" with "9753"
    And I complete "Confirm cash collection PIN" with "9753"
    And I complete "Amount" with "60"
    And I accept "You agree to the Instant Money terms and conditions"
    And I click on the "Next" button
    And I click on the "Confirm" button
    And I click on the "Cancel" button
    Then I should see the "Instant Money" page

  Scenario: Create instant money voucher positive scenarios, Back to transact and Make another transfer buttons
    Given I have logged in
    When I click on the "Transact" link
    And I click on the "Instant Money" tile
    And I click on the "Send money" button
    And I complete "Cell phone number" with "0111111111"
    And I complete "Create cash collection PIN" with "9753"
    And I complete "Confirm cash collection PIN" with "9753"
    And I complete "Amount" with "60"
    And I accept "You agree to the Instant Money terms and conditions"
    And I click on the "Next" button
    And I click on the "Confirm" button
    And I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    And I click on the "Back to Instant Money" button
    Then I should see the "Instant Money" page
    When I click on the "Send money" button
    And I complete "Cell phone number" with "0111111111"
    And I complete "Create cash collection PIN" with "9753"
    And I complete "Confirm cash collection PIN" with "9753"
    And I complete "Amount" with "60"
    And I accept "You agree to the Instant Money terms and conditions"
    And I click on the "Next" button
    And I click on the "Confirm" button
    And I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    And I click on the "Make another transfer" button
    Then I should see the "Instant Money" "details" page