@currentAccount
Feature: Current Account product with pending offer
  As a standard bank customer
  I want to continue my application for a current account
  So that I can take time to think about an offer

  Scenario: View pending offer with overdraft about to expire
    Given I want to apply for "Current" account as a customer "with a pending offer"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    And I should see "Offer expires soon" in the "Current account" section
    When I click on the "Complete Now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    And I should see the "Before You Continue with Your Application" title
    And I should see the following pre-screening questions:
      | question                              |
      | Are you under debt review?            |
    When I click on the "Next" button
    Then I should see the "Our Banking Solution for You" title
    And I should see the "current account product" "offer" page
    And I should see "Offer" as the current step in the breadcrumb
    And I should see the "Congratulations you also qualify for an overdraft" title

  Scenario: View pending offer not about to expire
    Given I want to apply for "Current" account as a customer "with a pending offer that is not about to expire"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    And I should see "Applied on" in the "Current account" section
    And I should see "Complete Now" in the "Current account" section

  Scenario: View pending offer when under debt review
    Given I want to apply for "Current" account as a customer "with a pending offer"
    When I click on the "Apply for Account" link
    Then I should see the "Available Products" page
    When I click on the "Complete Now" button in "Current account" section
    Then I should see the "current account product" "pre-screen" page
    When I choose "Yes" for "Are you under debt review?"
    When I click on the "Next" button
    Then I should see the "current account product" "offer" page
    And I should not see the "Congratulations you also qualify for an overdraft" title
