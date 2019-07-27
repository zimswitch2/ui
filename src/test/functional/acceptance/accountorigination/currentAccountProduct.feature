@currentAccount @ao
Feature: Current Account product
  As a standard bank customer
  I need to be able to apply for current account
  So that I can manage my finances

  @excludeWhen_viewTransactions
  Scenario: A customer with an existing current account cannot apply for another
    Given I have logged in
    When I click on the "Apply for Account" link
    And I should see the "Available Products" page
    And I should see "10-00-035-814-0" in the "Accessacc" section
    And I should not see "Apply now" in the "Accessacc" section
    When I click on the "10-00-035-814-0" link
    Then I should see the "Statements" "10-00-035-814-0" page
    And I should see the "Transaction History" title
    When I click on the "Back" button
    Then I should see the "Available Products" page
    When I click on the "Details" button in "Accessacc" section
    Then I should see the "Current Account Product" page
    And I should see information notification with "You already have a current account"
    And I should not see "Apply now"

  @viewTransactions
  Scenario: A customer with an existing current account cannot apply for another
    Given I have logged in
    When I click on the "Apply for Account" link
    And I should see the "Available Products" page
    And I should see "10-00-035-814-0" in the "Accessacc" section
    And I should not see "Apply now" in the "Accessacc" section
    When I click on the "10-00-035-814-0" link
    Then I should see the "Transactions" page heading
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Details" button in "Accessacc" section
    Then I should see the "Current Account Product" page
    And I should see information notification with "You already have a current account"
    And I should not see "Apply now"

  Scenario: A customer with an accepted offer for current account
    Given I want to apply for "Current" account as a customer "with an accepted offer"
    When I click on the "Apply for Account" link
    And I should see the "Available Products" page
    And I should see "Application being processed" in the "Elite" section
    And I should see "40-012-322-1" in the "Elite" section
    And I should see "11 September 2014" in the "Elite" section

  Scenario: A customer without an existing current account who is declined
    Given I want to apply for "Current" account as a customer "with a profile that will be rejected"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Apply now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    And I should see the "Before You Start Your Application" title
    And I accept "You agree to a credit and fraud check"
    When I click on the "Next" button
    Then I should see the "Your Details" title
    And I should see the "current account product" "profile" page
    When I click on the link containing "Submit" text
    And I click on the "Get offer" button
    Then I should see the "Application Declined" title
    And I should see the "current account product" "declined" page
    And I should see information text notification with "We regret to inform you that your application was declined."

  Scenario: A customer without an existing current account who can apply
    Given I want to apply for "Current" account as a customer "who does not have an existing current account"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Apply now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    And I should see the "Before You Start Your Application" title
    And I accept "You agree to a credit and fraud check"
    When I click on the "Next" button
    Then I should see the "Your Details" title
    And I should see the "current account product" "profile" page
    And I should see "Details" as the current step in the breadcrumb
    When I click on the link containing "Address" text
    Then I should see the "current account product" "address" page
    When I click on the link containing "Employment" text
    Then I should see the "current account product" "employment" page
    When I click on the link containing "Income and expenses" text
    Then I should see the "current account product" "income" page
    When I click on the link containing "Submit" text
    Then I should see the "current account product" "submit" page
    When I click on the "Get offer" button
    Then I should see the "current account product" "offer" page
    And I should see the "Our Banking Solution for You" title
    And I should see "Offer" as the current step in the breadcrumb
    And I should see the "We are pleased to offer you our Elite Banking solution" title
    And I should see the "Elite" title
    And I should see the "Elite Plus" title
    And I should see the "Congratulations you also qualify for an overdraft" title
    When I click on the "Choose" button in "Elite Plus" section
    And I accept "Add an overdraft to your account"
    Then I should see information notification with "Note that this overdraft offer is valid for 5 days"
    And I should see the following overdraft offer details
      | Maximum overdraft limit | R 6 000.00 |
      | Interest rate           | 22.5%      |
    And I should see information text notification with "Enter in 100s or 1000s, e.g. R 600, R 5700"
    And I should see the "Want to speed things up?" title
    When I complete "Amount" with "5000"
    And I select "ABSA" as my "Bank *" from the list
    And I select "63200500" as my "Branch *" from the list
    And I complete "Account number" with "123456789"
    And I select "SAVINGS" as my "Account type" from the list
    Then I should see that the "Accept offer" button is enabled
    When I click on the "Accept offer" button
    Then I should see the "current account product" "accept" page
    And I should see "Accept" as the current step in the breadcrumb
    And I should see the "Your current account" title
    And I should see the "Your overdraft" title
    Then I should see information text notification with "Note that this overdraft offer is valid for 5 days"
    And I accept "You have read, understood and agree to the"
    When I click on the "Confirm" button
    Then I should see the "current account product" "debit-order-switching" page
    And I should see the "Simple Debit Order Switching" title
    When I click on the "No thanks" button
    Then I should see the "current account product" "accept/card" page
    And I should see the "Your Cheque Card" title
    And I accept "MasterCard Gold Cheque Card"
    When I click on the "Finish" button
    And I should see the "Application Successful" title
    Then I should see the "current account product" "finish" page
    And I should see "Finish" as the current step in the breadcrumb
    And I should see the "Summary" title
    When I click on the "Back" button
    Then I should see the "Account Summary" page

  Scenario: A customer without an existing current account who can apply requests debit order switching
    Given I want to apply for "Current" account as a customer "who does not have an existing current account"
    When I click on the "Apply for Account" link
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    And I click on the link containing "Submit" text
    And I click on the "Get offer" button
    And I click on the "Choose" button in "Elite Plus" section
    And I click on the "Accept offer" button
    And I accept "You have read, understood and agree to the"
    And I click on the "Confirm" button
    Then I should see the "Simple Debit Order Switching" title
    When I click on the "Switch for free" button
    Then I should see the "Your Cheque Card" title
    And I accept "Visa Gold Cheque Card"
    When I click on the "Finish" button
    Then I should see the "Application Successful" title
    And I should see the "current account product" "finish" page
    And I should see "Finish" as the current step in the breadcrumb
    And I should see the "Summary" title
    When I click on the "Back" button
    Then I should see the "Account Summary" page

  Scenario: A customer without an existing current account who cannot apply via Internet banking
    Given I want to apply for "Current" account as a customer "with an offer of a product that is not supported by IBR"
    When I click on the "Apply for Account" link
    And I click on the "Apply now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    And I accept "You agree to a credit and fraud check"
    When I click on the "Next" button
    Then I should see the "Your Details" title
    Then I should see the "current account product" "profile" page
    When I click on the link containing "Submit" text
    Then I should see the "current account product" "submit" page
    And I click on the "Get offer" button
    And I should see the "Application Result" title
    And I should see the "current account product" "unsupported" page
    And I should see information text notification with "Your application cannot be completed via Internet banking"
    When I click on the "Back" button
    Then I should see the "Account Summary" page