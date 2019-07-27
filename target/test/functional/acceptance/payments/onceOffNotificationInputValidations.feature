Feature: Once off payment
  As a registered Internet banking user
  I want to	make a once-off payment to a private beneficiary
  So that I can pay individuals and companies that are not in my beneficiary listing

  Scenario:
  Field validations should fire correctly when a customer specifies payment notification details whilst
  attempting to set up once off payment

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
    And I choose "Yes" for "Send a payment notification?"
    And I complete "Recipient name" with "Ben"
    And I choose "Email" for "Payment notification method"
    And I complete "Recipient email address" with "user@standardbank.co.za"
    And I complete "Amount" with "100.00"
    Then I should see that the "Next" button is enabled

    When I complete "Recipient name" with "12345!"
    Then "Recipient name" should have a validation message of "Please enter a valid recipient name"
    And I should see that the "Next" button is disabled
    When I complete "Recipient name" with ""
    Then "Recipient name" should have a validation message of "Required"
    When I complete "Recipient name" with "Recipient name longer than 25 characters"
    Then "Recipient name" should have a validation message of "Cannot be longer than 25 characters"
    When I complete "Recipient name" with "Ben #.a-Z0-9/\,()&@?'""
    Then I should see that the "Next" button is enabled

    When I choose "Email" for "Payment notification method"
    And I complete "Recipient email address" with "user@standardbank"
    Then I should see "Please enter a valid email address" error message at the "Recipient email address" input field
    When I complete "Recipient email address" with "thisis@averylongemailaddressanditwillnotwork.co.za"
    Then I should see "Cannot be longer than 40 characters" error message at the "Recipient email address" input field

    When I choose "SMS" for "Payment notification method"
    And I complete "Recipient cell phone number" with "0112345678"
    Then I should see "Please enter a 10-digit cell phone number" error message at the "Recipient cell phone number" input field
    When I complete "Recipient cell phone number" with "07847573909759829047230875"
    Then I should see "Please enter a 10-digit cell phone number" error message at the "Recipient cell phone number" input field

    When I choose "Fax" for "Payment notification method"
    And I complete "Recipient fax number" with "012345678"
    Then I should see "Please enter a valid 10-digit fax number" error message at the "Recipient fax number" input field
    When I complete "Recipient fax number" with "01147573909759829047230875"
    Then I should see "Please enter a valid 10-digit fax number" error message at the "Recipient fax number" input field