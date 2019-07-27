@instantMoney
Feature: Change Instant Money cash collection pin
  As an instant money user
  I need to be able to change existing cash collection pin

 Scenario: Change Instant Money cash collection pin successfully
   Given I have logged in
   When I click on the "Transact" link
   Then I should see the "Transact" page
   And the "Instant Money" tile should be visible
   When I click on the "Instant Money" tile
   Then I should see the "Instant Money" page
   When I click on the "modify" button of row "1" from the "instantMoney in instantMoneyHistory" table
   Then I should see the "Instant Money" "change-pin" page
   And I should see the following change instant money pin details
       | From Account                 | ACCESSACC - 10-00-530-418-2 |
       | Available Balance            | - R 23.98                   |
       | Cell phone number            | 0721111111                  |
       | Amount                       | R 1 000                     |
   And I complete "Create cash collection PIN" with "1919"
   And I complete "Confirm cash collection PIN" with "1919"
   When I click on the "Next" button
   Then I should see the "Instant Money" "change-pin/confirm" page
   And I should see the following change instant money pin confirm details
       | From Account                 | ACCESSACC - 10-00-530-418-2 |
       | Available Balance            | - R 23.98                   |
       | Cell phone number            | 0721111111                  |
       | Amount                       | R 1 000                     |
       | Voucher number               | 111111111233334444          |
    When I click on the "Confirm" button
    Then I should see the "Instant Money" "change-pin/success" page
    And I should see success notification with "Cash collection PIN for the following transaction has been changed successfully"
    And I should see the following change instant money pin successful details
        | From Account                 | ACCESSACC - 10-00-530-418-2 |
        | Available Balance            | - R 23.98                   |
        | Cell phone number            | 0721111111                  |
        | Amount                       | R 1 000                     |
        | Voucher number               | 111111111233334444          |
    When I click on the "Back to Instant Money" button
    Then I should see the "Instant Money" page

 Scenario: Change Instant Money cash collection pin negative scenarios
   Given I have logged in
   When I click on the "Transact" link
   Then I should see the "Transact" page
   And the "Instant Money" tile should be visible
   When I click on the "Instant Money" tile
   Then I should see the "Instant Money" page
   When I click on the "modify" button of row "1" from the "instantMoney in instantMoneyHistory" table
   Then I should see the "Instant Money" "change-pin" page
   And I should see the following change instant money pin details
       | From Account                 | ACCESSACC - 10-00-530-418-2 |
       | Available Balance            | - R 23.98                   |
       | Cell phone number            | 0721111111                  |
       | Amount                       | R 1 000                     |
    When I click on "VoucherPin"
    And I click on "ConfirmVoucherPin"
    Then I should see "Please create a PIN which the recipient will use" error message at the "Create cash collection PIN" input field

    When I complete "Create cash collection PIN" with "1919"
    And I complete "Confirm cash collection PIN" with "1818"
    Then I should see "The two PINs do not match" error message at the "Confirm cash collection PIN" confirmation input field

    When I complete "Create cash collection PIN" with "1234"
    Then I should see "Please do not use sequential numbers (e.g. 4321)" error message at the "Create cash collection PIN" input field

    When I complete "Create cash collection PIN" with "1446"
    Then I should see "Please do not repeat numbers (e.g. 1223)" error message at the "Create cash collection PIN" input field

    When I click on the "Cancel" button
    Then I should see the "Instant Money" page
    When I click on the "modify" button of row "1" from the "instantMoney in instantMoneyHistory" table
     Then I should see the "Instant Money" "change-pin" page
     When I complete "Create cash collection PIN" with "1919"
     When I complete "Confirm cash collection PIN" with "1919"

   When I click on the "Next" button
   Then I should see the "Instant Money" "change-pin/confirm" page
   And I click on the "Cancel" button
   Then I should see the "Instant Money" page