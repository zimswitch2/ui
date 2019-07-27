@internationalPayment
Feature: International Payment
  As an international payment user
  I need to be able to make an international payment
  So that I can send money to a beneficiary

  Scenario: Make an international payment to a beneficiary
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "International Payment" tile should be visible
    When I click on the "International Payment" tile
    Then I should see the "International Payment" page
    When I accept "You agree to the terms and conditions"
    And I click on the "Get Started" button
    Then I should see "Personal details" as the current step in the breadcrumb
    And I should see the following international payment personal details for the South African resident
      | Contact first name  | Vaftest          |
      | Contact last name   | Sitone           |
      | Gender              | Female           |
      | ID number           | 850104 5570 09 9 |
      | Date of Birth       | 04 January 1985  |
      | Contact             | 078 854 1141     |
      | Home Address Street | 5 Simmonds St    |
      | Home Suburb         | Marshalltown     |
      | Home City           | Johannesburg     |
      | Home Province       | Gauteng          |
      | Home Postal Code    | 2001             |
      | Postal Box          | 52 Anderson St   |
      | Postal Suburb       | Marshalltown     |
      | Postal City         | Johannesburg     |
      | Postal Province     | Gauteng          |
      | Postal Code         | 2001             |
    When I accept "You confirm your details are correct"
    And I click on the "Next" button
    Then I should see "Beneficiary details" as the current step in the breadcrumb
    And I should see "Their details" as the current step in the beneficiary tabs
    And I complete "First name" with "Jackline"
    And I complete "Last name" with "Smith"
    And I accept "Female"
    And I complete "Address line 1" with "75 Simmonds St"
    And I complete "Country" with "Albania"
    And I complete "City" with "Johannesburg"
    And I click on the "Next" button
    Then I should see "Their bank details" as the current step in the beneficiary tabs
    And I complete "Country of bank" with "United Kingdom of Great Britain and Northern Ireland"
    And I accept "Country of bank"
    And I complete "IBAN" with "1122345YT8939IK"
    And I complete "SWIFT/BIC" with "473HY8392"
    And I click on the "Next" button
    Then I should see "Preferences" as the current step in the beneficiary tabs
    And I complete "Your reference" with "Jackline Smith"
    And I complete "Their reference" with "Bobby Gerard"
    And I click on the "Next" button
    Then I should see "Reason for payment" as the current step in the breadcrumb
    And I should see that the "Next" button is disabled
    And I should see "3" reason for payment bop groups
    When I click on the More tag to view more bop groups
    And I click on the "Software & Computers" bop group
    Then I should see "6" reason for payment bop categories
    When I search for reason for payment with the search term "advance payments"
    Then I should see "2" reason for payment search results
    When I click on the "101-01 - Imports: Advance payments (not in terms of import undertaking)" search result
    Then I should see the "BoP Declaration" modal window
    When I click on the "Agree" button
    Then I should see "Pay" as the current step in the breadcrumb
    And I complete "Customs client number" with "12345678"
    And I complete "Amount" with "200"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the OTP page with "International Payment" title
    And I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    And I should see the following international payment confirmation details
      | From account                  | ACCESSACC 10-00-035-814-0                                               |
      | Available balance             | R 8 756.41                                                              |
      | Beneficiary name              | Jackline Smith                                                          |
      | IBAN                          | 1122345YT8939IK                                                         |
      | SWIFT/BIC                     | 473HY8392                                                               |
      | Your reference                | Jackline Smith                                                          |
      | Their reference               | Bobby Gerard                                                            |
      | Reason for payment (BoP code) | 101 - Imports: Advance payments (not in terms of import undertaking)    |
      | Payment fees                  | You pay all the fees                                                    |
      | Payment date                  | PRESENT_DATE                                                            |
      | Payment amount - foreign      | GBP 200.00                                                              |
      | Exchange rate                 | 15.90                                                                   |
      | Payment amount - local        | R 795.00                                                                |
      | Commission fee                | R 100.00                                                                |
      | SWIFT fee                     | R 140.00                                                                |
      | Total amount                  | R 1 035.00                                                              |
    When I click on the "Confirm" button
    Then I should see the "Payment request submitted" modal window
    And I should see the international payment reference code of "PAY-XBP-1746"

  Scenario: Invalid beneficiary bank details
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "International Payment" tile should be visible
    When I click on the "International Payment" tile
    Then I should see the "International Payment" page
    When I accept "You agree to the terms and conditions"
    And I click on the "Get Started" button
    Then I should see "Personal details" as the current step in the breadcrumb
    When I accept "You confirm your details are correct"
    And I click on the "Next" button
    Then I should see "Beneficiary details" as the current step in the breadcrumb
    And I should see "Their details" as the current step in the beneficiary tabs
    When I complete "First name" with "Jackline"
    And I complete "Last name" with "Smith"
    And I accept "Female"
    And I complete "Address line 1" with "75 Simmonds St"
    And I complete "Country" with "Albania"
    And I complete "City" with "Johannesburg"
    And I click on the "Next" button
    Then I should see "Their bank details" as the current step in the beneficiary tabs
    When I complete "Country of bank" with "United Kingdom of Great Britain and Northern Ireland"
    And I accept "Country of bank"
    And I complete "IBAN" with "123456789012345"
    And I complete "SWIFT/BIC" with "12345678"
    And I click on the "Next" button
    Then I should see error notification with "The IBAN you have entered is incorrect."
    When I complete "IBAN" with "987654321987654"
    And I complete "SWIFT/BIC" with "9087654321"
    And I click on the "Next" button
    Then I should see error notification with "The SWIFT/BIC you have entered is incorrect."

  Scenario: Invalid customs client number
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "International Payment" tile should be visible
    When I click on the "International Payment" tile
    Then I should see the "International Payment" page
    When I accept "You agree to the terms and conditions"
    And I click on the "Get Started" button
    Then I should see "Personal details" as the current step in the breadcrumb
    When I accept "You confirm your details are correct"
    And I click on the "Next" button
    Then I should see "Beneficiary details" as the current step in the breadcrumb
    And I should see "Their details" as the current step in the beneficiary tabs
    When I complete "First name" with "Jackline"
    And I complete "Last name" with "Smith"
    And I accept "Female"
    And I complete "Address line 1" with "75 Simmonds St"
    And I complete "Country" with "Albania"
    And I complete "City" with "Johannesburg"
    And I click on the "Next" button
    Then I should see "Their bank details" as the current step in the beneficiary tabs
    When I complete "Country of bank" with "United Kingdom of Great Britain and Northern Ireland"
    And I accept "Country of bank"
    And I complete "IBAN" with "123456789012345"
    And I complete "SWIFT/BIC" with "12345678"
    And I click on the "Next" button
    Then I should see error notification with "The IBAN you have entered is incorrect."
    When I complete "IBAN" with "987654321987654"
    And I complete "SWIFT/BIC" with "473HY8392"
    And I click on the "Next" button
    Then I should see "Preferences" as the current step in the beneficiary tabs
    And I complete "Your reference" with "Jackline Smith"
    And I complete "Their reference" with "Bobby Gerard"
    And I click on the "Next" button
    Then I should see "Reason for payment" as the current step in the breadcrumb
    When I search for reason for payment with the search term "advance payments"
    Then I should see "2" reason for payment search results
    When I click on the "101-01 - Imports: Advance payments (not in terms of import undertaking)" search result
    Then I should see the "BoP Declaration" modal window
    When I click on the "Agree" button
    Then I should see "Pay" as the current step in the breadcrumb
    And I complete "Customs client number" with "87654321"
    And I complete "Amount" with "2000"
    And I click on the "Next" button
    Then I should see error notification with "Invalid CCN"

  Scenario: Make an international payment with insufficient funds
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "International Payment" tile should be visible
    When I click on the "International Payment" tile
    Then I should see the "International Payment" page
    When I accept "You agree to the terms and conditions"
    And I click on the "Get Started" button
    Then I should see "Personal details" as the current step in the breadcrumb
    When I accept "You confirm your details are correct"
    And I click on the "Next" button
    Then I should see "Beneficiary details" as the current step in the breadcrumb
    And I should see "Their details" as the current step in the beneficiary tabs
    And I complete "First name" with "Jackline"
    And I complete "Last name" with "Smith"
    And I accept "Female"
    And I complete "Address line 1" with "75 Simmonds St"
    And I complete "Country" with "Albania"
    And I complete "City" with "Johannesburg"
    And I click on the "Next" button
    Then I should see "Their bank details" as the current step in the beneficiary tabs
    When I complete "Country of bank" with "Spain"
    And I accept "Country of bank"
    And I complete "IBAN" with "ES9121000418450200051332"
    And I complete "SWIFT/BIC" with "ABNAESMMLEB"
    And I click on the "Next" button
    Then I should see "Preferences" as the current step in the beneficiary tabs
    And I complete "Your reference" with "Jackline Smith"
    And I complete "Their reference" with "Bobby Gerard"
    And I click on the "Next" button
    Then I should see "Reason for payment" as the current step in the breadcrumb
    And I click on the "Most Used" bop group
    And I click on the "610-01 - Inward listed securities equity individual" bop category
    Then I should see the "BoP Declaration" modal window
    When I click on the "Agree" button
    Then I should see "Pay" as the current step in the breadcrumb
    And I complete "Customs client number" with "12345678"
    And I complete "Amount" with "20"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the OTP page with "International Payment" title
    And I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see error notification with "You do not have sufficient funds to make this payment, as well as pay the relevant costs."


  Scenario: Error when submitting final payment
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "International Payment" tile should be visible
    When I click on the "International Payment" tile
    Then I should see the "International Payment" page
    When I accept "You agree to the terms and conditions"
    And I click on the "Get Started" button
    Then I should see "Personal details" as the current step in the breadcrumb
    When I accept "You confirm your details are correct"
    And I click on the "Next" button
    Then I should see "Beneficiary details" as the current step in the breadcrumb
    And I should see "Their details" as the current step in the beneficiary tabs
    And I complete "First name" with "Jackline"
    And I complete "Last name" with "Smith"
    And I accept "Female"
    And I complete "Address line 1" with "75 Simmonds St"
    And I complete "Country" with "Albania"
    And I complete "City" with "Johannesburg"
    And I click on the "Next" button
    Then I should see "Their bank details" as the current step in the beneficiary tabs
    When I complete "Country of bank" with "Spain"
    And I accept "Country of bank"
    And I complete "IBAN" with "ES9121000418450200051332"
    And I complete "SWIFT/BIC" with "ABNAESMMLEB"
    And I click on the "Next" button
    Then I should see "Preferences" as the current step in the beneficiary tabs
    And I complete "Your reference" with "Jackline Smith"
    And I complete "Their reference" with "Bobby Gerard"
    And I click on the "Next" button
    Then I should see "Reason for payment" as the current step in the breadcrumb
    When I click on the "Services" bop group
    And I click on the "297-00 - Payment for other business services not included elsewhere" bop category
    Then I should see the "BoP Declaration" modal window
    When I click on the "Agree" button
    Then I should see "Pay" as the current step in the breadcrumb
    And I complete "Customs client number" with "12345678"
    And I complete "Amount" with "200"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the OTP page with "International Payment" title
    And I should see "OTP" as the current step in the breadcrumb
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see "Confirm details" as the current step in the breadcrumb
    When I click on the "Confirm" button
    Then I should see the "We're experiencing technical problems" modal window


#  @foreignNational
#  Scenario: Make an international payment to a beneficiary as a foreign national with a work permit
#    Given I have logged in as a "Foreign National With Work Permit" customer
#    When I click on the "Transact" link
#    Then I should see the "Transact" page
#    And the "International Payment" tile should be visible
#    When I click on the "International Payment" tile
#    Then I should see the "International Payment" page
#    When I accept "You agree to the terms and conditions"
#    And I click on the "Get Started" button
#    Then I should see "Personal details" as the current step in the breadcrumb
#    And I should see the following international payment personal details for the foreign national with a work permit
#      | Contact first name      | Vaftest          |
#      | Contact last name       | Sitone           |
#      | Gender                  | Female           |
#      | Work Permit Number      | 123456           |
#      | Work Permit Expiry Date | 30 March 2016    |
#      | Passport Number         | L560020          |
#      | Country Of Issue        | India            |
#      | Date of Birth           | 04 January 1985  |
#      | Contact                 | 078 854 1141     |
#      | Home Address Street     | 5 Simmonds St    |
#      | Home Suburb             | Marshalltown     |
#      | Home City               | Johannesburg     |
#      | Home Province           | Gauteng          |
#      | Home Postal Code        | 2001             |
#      | Postal Box              | 52 Anderson St   |
#      | Postal Suburb           | Marshalltown     |
#      | Postal City             | Johannesburg     |
#      | Postal Province         | Gauteng          |
#      | Postal Code             | 2001             |
#    When I accept "You confirm your details are correct"
#    And I click on the "Next" button
#    Then I should see "Beneficiary details" as the current step in the breadcrumb
#    And I should see "Their details" as the current step in the beneficiary tabs
#    And I complete "First name" with "Jackline"
#    And I complete "Last name" with "Smith"
#    And I accept "Female"
#    And I complete "Address line 1" with "75 Simmonds St"
#    And I complete "Country" with "Albania"
#    And I complete "City" with "Johannesburg"
#    And I click on the "Next" button
#    Then I should see "Their bank details" as the current step in the beneficiary tabs
#    And I complete "Country of bank" with "United Kingdom of Great Britain and Northern Ireland"
#    And I accept "Country of bank"
#    And I complete "IBAN" with "1122345YT8939IK"
#    And I complete "SWIFT/BIC" with "473HY8392"
#    And I click on the "Next" button
#    Then I should see "Preferences" as the current step in the beneficiary tabs
#    And I complete "Your reference" with "Jackline Smith"
#    And I complete "Their reference" with "Bobby Gerard"
#    And I click on the "Next" button
#    Then I should see "Reason for payment" as the current step in the breadcrumb
#    And I should see that the "Next" button is disabled
#    Then I should see "1" reason for payment bop categories
#    When I click on the "417-00 - Foreign national contract worker remittances (excluding compensation)" bop category
#    Then I should see the "BoP Declaration" modal window
#    When I click on the "Agree" button
#    Then I should see "Pay" as the current step in the breadcrumb
#    And I complete "Amount" with "200"
#    Then I should see that the "Next" button is enabled
#    When I click on the "Next" button
#    Then I should see the OTP page with "International Payment" title
#    And I should see "OTP" as the current step in the breadcrumb
#    When I enter the following details
#      | Email verification code | 12345 |
#    And I click on the "Submit" button
#    Then I should see "Confirm details" as the current step in the breadcrumb
#    And I should see the following international payment confirmation details
#      | From account                  | ACCESSACC 10-00-035-814-0                                                   |
#      | Available balance             | R 8 756.41                                                                  |
#      | Beneficiary name              | Jackline Smith                                                              |
#      | IBAN                          | 1122345YT8939IK                                                             |
#      | SWIFT/BIC                     | 473HY8392                                                                   |
#      | Your reference                | Jackline Smith                                                              |
#      | Their reference               | Bobby Gerard                                                                |
#      | Reason for payment (BoP code) | 417 - Foreign national contract worker remittances (excluding compensation) |
#      | Payment fees                  | You pay all the fees                                                        |
#      | Payment date                  | PRESENT_DATE                                                                |
#      | Payment amount - foreign      | GBP 200.00                                                                  |
#      | Exchange rate                 | 15.90                                                                       |
#      | Payment amount - local        | R 795.00                                                                    |
#      | Commission fee                | R 100.00                                                                    |
#      | SWIFT fee                     | R 140.00                                                                    |
#      | Total amount                  | R 1 035.00                                                                  |
#    When I click on the "Confirm" button
#    Then I should see the "Payment request submitted" modal window
#    And I should see the international payment reference code of "PAY-XBP-1746"
#
#  Scenario: Make an international payment to a beneficiary as a foreign national with a foreign id
#    Given I have logged in as a "Foreign National With Foreign Id" customer
#    When I click on the "Transact" link
#    Then I should see the "Transact" page
#    And the "International Payment" tile should be visible
#    When I click on the "International Payment" tile
#    Then I should see the "International Payment" page
#    When I accept "You agree to the terms and conditions"
#    And I click on the "Get Started" button
#    Then I should see "Personal details" as the current step in the breadcrumb
#    And I should see the following international payment personal details for the foreign national with a foreign id
#      | Contact first name      | Vaftest          |
#      | Contact last name       | Sitone           |
#      | Gender                  | Female           |
#      | Foreign Id Number       | L560020          |
#      | Country Of Issue        | India            |
#      | Date of Birth           | 04 January 1985  |
#      | Contact                 | 078 854 1141     |
#      | Home Address Street     | 5 Simmonds St    |
#      | Home Suburb             | Marshalltown     |
#      | Home City               | Johannesburg     |
#      | Home Province           | Gauteng          |
#      | Home Postal Code        | 2001             |
#      | Postal Box              | 52 Anderson St   |
#      | Postal Suburb           | Marshalltown     |
#      | Postal City             | Johannesburg     |
#      | Postal Province         | Gauteng          |
#      | Postal Code             | 2001             |
#    When I accept "You confirm your details are correct"
#    And I click on the "Next" button
#    Then I should see "Beneficiary details" as the current step in the breadcrumb
#    And I should see "Their details" as the current step in the beneficiary tabs
#    And I complete "First name" with "Jackline"
#    And I complete "Last name" with "Smith"
#    And I accept "Female"
#    And I complete "Address line 1" with "75 Simmonds St"
#    And I complete "Country" with "Albania"
#    And I complete "City" with "Johannesburg"
#    And I click on the "Next" button
#    Then I should see "Their bank details" as the current step in the beneficiary tabs
#    And I complete "Country of bank" with "United Kingdom of Great Britain and Northern Ireland"
#    And I accept "Country of bank"
#    And I complete "IBAN" with "1122345YT8939IK"
#    And I complete "SWIFT/BIC" with "473HY8392"
#    And I click on the "Next" button
#    Then I should see "Preferences" as the current step in the beneficiary tabs
#    And I complete "Your reference" with "Jackline Smith"
#    And I complete "Their reference" with "Bobby Gerard"
#    And I click on the "Next" button
#    Then I should see "Reason for payment" as the current step in the breadcrumb
#    And I should see that the "Next" button is disabled
#    Then I should see "1" reason for payment bop categories
#    When I click on the "417-00 - Foreign national contract worker remittances (excluding compensation)" bop category
#    Then I should see the "BoP Declaration" modal window
#    When I click on the "Agree" button
#    Then I should see "Pay" as the current step in the breadcrumb
#    And I complete "Amount" with "200"
#    Then I should see that the "Next" button is enabled
#    When I click on the "Next" button
#    Then I should see the OTP page with "International Payment" title
#    And I should see "OTP" as the current step in the breadcrumb
#    When I enter the following details
#      | Email verification code | 12345 |
#    And I click on the "Submit" button
#    Then I should see "Confirm details" as the current step in the breadcrumb
#    And I should see the following international payment confirmation details
#      | From account                  | ACCESSACC 10-00-035-814-0                                                   |
#      | Available balance             | R 8 756.41                                                                  |
#      | Beneficiary name              | Jackline Smith                                                              |
#      | IBAN                          | 1122345YT8939IK                                                             |
#      | SWIFT/BIC                     | 473HY8392                                                                   |
#      | Your reference                | Jackline Smith                                                              |
#      | Their reference               | Bobby Gerard                                                                |
#      | Reason for payment (BoP code) | 417 - Foreign national contract worker remittances (excluding compensation) |
#      | Payment fees                  | You pay all the fees                                                        |
#      | Payment date                  | PRESENT_DATE                                                                |
#      | Payment amount - foreign      | GBP 200.00                                                                  |
#      | Exchange rate                 | 15.90                                                                       |
#      | Payment amount - local        | R 795.00                                                                    |
#      | Commission fee                | R 100.00                                                                    |
#      | SWIFT fee                     | R 140.00                                                                    |
#      | Total amount                  | R 1 035.00                                                                  |
#    When I click on the "Confirm" button
#    Then I should see the "Payment request submitted" modal window
#    And I should see the international payment reference code of "PAY-XBP-1746"
