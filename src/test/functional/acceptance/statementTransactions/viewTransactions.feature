@viewTransactions
Feature: View Transactions
  As a registered Online Banking User
  I want to be able to view a history of the transactions on my accounts
  so that I can view all the transactions posted to my account in this period

  Scenario: viewing transactions
    Given I have logged in as a "credentials" customer
    Then I should see the "Account Summary" page
    When I click on a specific account in account summary
    Then I should see the "Transactions" page heading
    Then I should see balance of "R 8 756.41"
    Then I should see four buttons on the screen
    Then I should see "30" as an active button
    Then I should see the following view transactions
      | Date | Description                                        | Amount (R)      | Balance (R)  |
      | 2014   |                                                    |                 |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004253    | - 1.20          | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004253    | - 1.01          | 1 224 388.35 |
    When I click on the "60" button
    Then I should see "60" as an active button
    Then I should see the following view transactions
      | Date | Description                                        | Amount (R)     | Balance (R)  |
      | 2014   |                                                    |                |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004254    | - 1.20         | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004256    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004258    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042510   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042512   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042514   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042516   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042518   | - 1.01         | 1 224 388.35 |
    When I click on the "90" button
    Then I should see "90" as an active button
    Then I should see information notification with "You have reached the maximum number of transactions that can be displayed."
    Then I should see the following view transactions
      | Date | Description                                         | Amount (R)     | Balance (R)  |
      | 2014   |                                                    |                |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004254    | - 1.20         | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004256    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004258    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042510   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042512   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042514   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042516   | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042518   | - 1.01         | 1 224 388.35 |
    When I click on the "180" button
    Then I should see "180" as an active button
    Then I should see the following view transactions
      | Date | Description                                         | Amount (R)     | Balance (R)  |
      | 2014   |                                                     |                |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004254     | - 1.20         | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004256     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004258     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042510    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042512    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042514    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042516    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042518    | - 1.01         | 1 224 388.35 |
    When I click on Load more transactions
    Then I should see the following view transactions
      | Date | Description                                         | Amount (R)     | Balance (R)  |
      | 2014   |                                                     |                |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004254     | - 1.20         | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004256     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004258     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042510    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042512    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042514    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042516    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042518    | - 1.01         | 1 224 388.35 |
      | 2014   |                                                     |                |              |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004254     | - 1.20         | 1 224 389.36 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004256     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 410004258     | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042510    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042512    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042514    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042516    | - 1.01         | 1 224 388.35 |
      | 12     | IB FUTURE-DATED PAYMENT TO IB REFRESH 4100042518    | - 1.01         | 1 224 388.35 |
