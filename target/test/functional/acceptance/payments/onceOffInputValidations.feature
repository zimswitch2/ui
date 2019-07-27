Feature: Once off payment
  As a registered Internet banking user
  I want to	make a once-off payment to a private beneficiary
  So that I can pay individuals and companies that are not in my beneficiary listing

  Scenario: Field validations should fire correctly when a customer attempts to perform a once off payment

    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Once-off payment" tile should be visible
    When I click on the "Once-off payment" tile
    Then I should see the "Once-off Payment" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Danielle Ward"
    And I complete "Bank" with "Standard Bank"
    And I complete "Branch" with "51001 - SINGL IBT SBSA"
    And I complete "Account number" with "421884606"
    And I complete "Your reference" with "Sister"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I choose "No" for "Send a payment notification?"
    And I complete "Amount" with "100.00"
    Then I should see that the "Next" button is enabled

    When I complete "Name" with "12345!"
    Then "Name" should have a validation message of "Please enter a valid beneficiary name"
    And I should see that the "Next" button is disabled
    When I complete "Name" with ""
    Then "Name" should have a validation message of "Required"
    When I complete "Name" with "Beneficiary Name longer than 20 characters"
    Then "Name" should have a validation message of "Cannot be longer than 20 characters"
    When I complete "Name" with "N #.a-Z0-9/\,()&@?'""
    Then I should see that the "Next" button is enabled

    When I complete "Bank" with "Not a bank"
    Then I should see "No matches found" error message at the Bank input field
    And I should see that the "Next" button is disabled
    When I complete "Bank" with "Standard Bank"
    Then I should see that the "Next" button is enabled

    When I complete "Branch" with "20091zzz"
    Then I should see "No matches found" error message at the Branch input field
    And I should see that the "Next" button is disabled
    When I complete "Branch" with "51001 - SINGL IBT SBSA"
    Then I should see that the "Next" button is enabled

    When I complete "Account number" with "abcdefg"
    Then I should see "Please enter a number" error message at the "Account number" input field
    And I should see that the "Next" button is disabled
    When I complete "Account number" with ""
    Then I should see "Required" error message at the "Account number" input field
    When I complete "Account number" with "40472641204047264120"
    Then I should see "Cannot be longer than 16 characters" error message at the "Account number" input field
    When I complete "Account number" with "421884606"
    Then I should see that the "Next" button is enabled

    When I complete "Your reference" with "12345!"
    Then "Your reference" should have a validation message of "Please enter a valid reference"
    And I should see that the "Next" button is disabled
    When I complete "Your reference" with ""
    Then "Your reference" should have a validation message of "Required"
    When I complete "Your reference" with "My reference longer than 12 characters"
    Then "Your reference" should have a validation message of "Cannot be longer than 12 characters"
    When I complete "Your reference" with "My #.a-Z0-9/"
    Then I should see that the "Next" button is enabled
    When I complete "Your reference" with "My \,()&@?'""
    Then I should see that the "Next" button is enabled

    When I complete "Beneficiary reference" with "12345!"
    Then "Beneficiary reference" should have a validation message of "Please enter a valid reference"
    And I should see that the "Next" button is disabled
    When I complete "Beneficiary reference" with ""
    Then "Beneficiary reference" should have a validation message of "Required"
    When I complete "Beneficiary reference" with "Reference longer than 25 characters"
    Then "Beneficiary reference" should have a validation message of "Cannot be longer than 25 characters"
    When I complete "Beneficiary reference" with "BenRef #.a-Z0-9/\,()&@?'""
    Then I should see that the "Next" button is enabled

    And I should not see an amount error displaying
    When I complete "Amount" with "1."
    Then I should see an amount error displaying "Please enter the amount in a valid format"
    And I should see that the "Next" button is disabled