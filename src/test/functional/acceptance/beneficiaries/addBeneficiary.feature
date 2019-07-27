@addBeneficiary
Feature: Add a beneficiary

  Scenario: Add a private beneficiary with correct details
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I click on the "Add beneficiary" button
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Danielle Ward"
    And I complete "Bank" with "STANDARD BANK"
    And I complete "Branch" with "51001 - SINGL IBT SBSA"
    And I complete "Account number" with "421884606"
    And I complete "Your reference" with "Sister"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I accept "Fax"
    And I complete "Recipient name" with "ben"
    And I complete "Recipient fax number" with "0123456789"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the Add Beneficiary confirmation page with the following private beneficiary details
      | Beneficiary name                                  | Danielle Ward                   |
      | Bank                                              | STANDARD BANK                   |
      | Branch                                            | SINGL IBT SBSA (51001)          |
      | Account number                                    | 421884606                       |
      | Your reference                                    | Sister                          |
      | Beneficiary reference                             | Invoice 123                     |
    And the add beneficiary notification confirmation method should be "ben will receive payment notifications by fax on"
    And the add beneficiary notification confirmation fax should be "0123456789"
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "List of Beneficiaries" page

  Scenario: Add a beneficiary with bad data
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Add beneficiary" tile should be visible
    When I click on the "Add beneficiary" tile
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    And I should see that the "Next" button is disabled
    And I should see that the "Add beneficiary to an existing group (optional)" dropdown has "-- No group --" selected
    When I complete "Name" with "12345!"
    And I complete "Bank" with "Not a bank"
    And I complete "Branch" with "20091zzz"
    And I complete "Account number" with "abcdefg"
    And I complete "Your reference" with "12345!"
    And I complete "Beneficiary reference" with "12345!"
    Then the "Recipient name" input field should be ""
    When I complete "Name" with "Bad Beneficiary"
    And I complete "Bank" with "ABSA"
    And I complete "Branch" with "63200500 - DURBAN CENTRAL FOREX OPS"
    And I complete "Account number" with "4047264120"
    And I complete "Your reference" with "Mother"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I accept "Email"
    And I complete "Recipient name" with "ben"
    And I complete "Recipient email address" with "user@standardbank.co.za"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    And I should see error notification with "An error has occurred"
    And the "Email" radio button should be checked
    And the "Recipient email address" input field should be "user@standardbank.co.za"


  Scenario: When a beneficiary has no groups
    Given I have logged in as a "Credentials With Zero Beneficiaries" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Add beneficiary" tile should be visible
    When I click on the "Add beneficiary" tile
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    And I should not see the "Add beneficiary to an existing group (optional)" input field

  Scenario: Listed beneficiary
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Add beneficiary" tile should be visible
    When I click on the "Add beneficiary" tile
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I enter "TELKOM" as the listed beneficiary
    And I complete "Your reference" with "myref"
    And I complete "Beneficiary reference" with "herref"
    And I accept "No"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the Add Beneficiary confirmation page with the following listed beneficiary details
      | Beneficiary name                                  | TELKOM                   |
      | Your reference                                    | myref                    |
      | Beneficiary reference                             | herref                   |
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "Transact" page

  Scenario: Cancelling adding of a beneficiary from the otp page
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I click on the "Add beneficiary" button
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Tammy Diaz"
    And I complete "Bank" with "ABSA"
    And I complete "Branch" with "63200500 - DURBAN CENTRAL FOREX OPS"
    And I complete "Account number" with "4047264120"
    And I complete "Your reference" with "Mother"
    And I complete "Beneficiary reference" with "Invoice 123"
    And I accept "No"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    And I click on the "Cancel" button
    Then I should see the "List of Beneficiaries" page

  @verifyCompanyDepositIdentifier
  Scenario: Confirming the use of a public beneficiary on submit
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I click on the "Add beneficiary" button
    Then I should see the "Add Beneficiary" page
    And I should see "Enter details" as the current step in the breadcrumb
    When I complete "Name" with "Thabo Khuzwayo"
    And I complete "Bank" with "STANDARD BANK"
    And I complete "Branch" with "51001 - SINGL IBT SBSA"
    And I complete "Account number" with "554433221"
    And I complete "Your reference" with "Mashonisa"
    And I complete "Beneficiary reference" with "Repayment"
    And I accept "No"
    And I click on the "Next" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the Add Beneficiary confirmation page with the following listed beneficiary details
      | Beneficiary name                                  | ALLAN GRAY UNIT TRUST   |
      | Your reference                                    | Mashonisa               |
      | Beneficiary reference                             | Repayment               |
    And I should see information text notification with "We recognised this account number and filled in the correct details for you"
    When I click on the "Confirm" button
    Then I should see "Enter OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "List of Beneficiaries" page
