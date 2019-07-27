@instantMoney
Feature: Instant money
  As an instant money user
  I need to be able to view send and view instant money vouchers
  So that I can send instant money

  Scenario: View uncollected instant money transactions
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
    # Search
    When I search for uncollected vouchers by "1 September"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
    When I search for uncollected vouchers by "677778"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20   |
    When I search for uncollected vouchers by "0721111111"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
    When I search for uncollected vouchers by "814-0"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
    When I search for uncollected vouchers by ""
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |
    #Sort
    When I sort the uncollected vouchers by "From account"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
    When I sort the uncollected vouchers by "Date"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |
    When I sort the uncollected vouchers by "Cell phone"
    Then the following uncollected vouchers should be displayed
      | Date             | From account                | Voucher number     | Cell phone | Amount  |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-3 | 111111111677778888 | 0722222222 | R 20    |
      | 1 September 2015 | ACCESSACC - 10-00-530-418-2 | 111111111233334444 | 0721111111 | R 1 000 |
      | 2 September 2015 | ACCESSACC - 10-00-035-814-0 | 111111111233334444 | 0721111111 | R 2 000 |
    When I click on the "Back to transact" button
    Then I should see the "Transact" page
