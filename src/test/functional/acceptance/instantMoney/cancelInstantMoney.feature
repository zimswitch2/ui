@instantMoney
Feature: Cancel Instant money
  As an instant money user
  I need to be able to cancel uncollected instant money vouchers

  Scenario: Cancel instant money voucher
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Instant Money" tile should be visible
    When I click on the "Instant Money" tile
    Then I should see the "Instant Money" page
    And the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |
    When I click the "delete" action on the first row
    Then I should see the "Delete Instant Money" modal window
    When I click on the "Cancel" button
    Then I should not see the "Delete Instant Money" modal window
    When I click the "delete" action on the first row
    And enter "1357" as the cancel voucher PIN
    And I click on the "Confirm" button
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |