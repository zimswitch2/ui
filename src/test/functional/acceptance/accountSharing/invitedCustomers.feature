@accountSharing @seoInvitedCustomers
Feature: Invited Customer
  As a invited customer

  Background:
    Given I go to the login page
    And I click on the "Get started" button


  Scenario: Newly invited customer should be able to register for SED
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    When I click on the "Register" modal button
      #Then I should see "Getting Started" as the page heading
      #Then I should see "Get started with Internet Banking in just a few steps. Begin by entering your details" on the panel
    And I enter the following details
      | Email address           | louise@sb.com |
      | Enter your new password | Test12345     |
      | Confirm password        | Test12345     |
      | Preferred name          | Louis         |
    And I accept "You accept the"
    And I click on the "Register now" button

    And I enter the following details
      | Email verification code | 11111 |
    And I click on the "Submit" button
    Then I should see error notification with "Invalid one-time pin entered."
    And I enter the following details
      | Email verification code | 12345 |
    When I click on the "Submit" button
    Then I should see that the "Accept" button is disabled
    And I should see that the "Decline" button is enabled
    When I accept "You accept the"
    Then I should see that the "Accept" button is enabled
    When I click on the "Accept" button
    Then I should see that the "Submit" button is disabled
    When I enter the following details
      | Email verification code | 11111 |
    And I click on the "Submit" button
    Then I should see error notification with "Invalid one-time pin entered."
    And I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    #Then I should see success notification with "Welcome John, your account has been activated. You can now access Flowers Accounts"

    #And I should see that the "Cancel" button is enabled
    #When I click on the "Cancel" button
    #Then I should see that the "Get started" button is enabled

  Scenario: Testing Cancel on The Accept/Decline roles assigned screen
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    When I click on the "Register" modal button
      #Then I should see "Getting Started" as the page heading
      #Then I should see "Get started with Internet Banking in just a few steps. Begin by entering your details" on the panel
    And I enter the following details
      | Email address           | louise@sb.com |
      | Enter your new password | Test12345     |
      | Confirm password        | Test12345     |
      | Preferred name          | Louis         |
    And I accept "You accept the"
    And I click on the "Register now" button
    And I enter the following details
      | Email verification code | 12345 |
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled
    And I should see that the "Register" button is enabled

  Scenario: Testing Cancel on the OTP Screen
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    When I click on the "Register" modal button
    #Then I should see "Getting Started" as the page heading
    #Then I should see "Get started with Internet Banking in just a few steps. Begin by entering your details" on the panel
    And I enter the following details
      | Email address           | louise@sb.com |
      | Enter your new password | Test12345     |
      | Confirm password        | Test12345     |
      | Preferred name          | Louis         |
    And I accept "You accept the"
    And I click on the "Register now" button
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled
    And I should see that the "Register" button is enabled


  Scenario: Testing Cancel on the register operator page
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    When I click on the "Register" modal button
  #Then I should see "Getting Started" as the page heading
  #Then I should see "Get started with Internet Banking in just a few steps. Begin by entering your details" on the panel
    And I enter the following details
      | Email address           | louise@sb.com |
      | Enter your new password | Test12345     |
      | Confirm password        | Test12345     |
      | Preferred name          | Louis         |
    And I accept "You accept the"
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled
    And I should see that the "Register" button is enabled


  Scenario: When a newly invited customers registers for SED then declines the roles assigned
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    When I click on the "Register" modal button
#Then I should see "Getting Started" as the page heading
#Then I should see "Get started with Internet Banking in just a few steps. Begin by entering your details" on the panel
    And I enter the following details
      | Email address           | louise@sb.com |
      | Enter your new password | Test12345     |
      | Confirm password        | Test12345     |
      | Preferred name          | Louis         |
    And I accept "You accept the"
    When I click on the "Register now" button
    And I enter the following details
      | Email verification code | 12345 |
    When I click on the "Submit" button
    When I click on the "Decline" button
    Then I should see that the "Yes" button is enabled
    And I should see that the "No" button is enabled
    #When I click on the "No" button
    #remain on the page
    #When  I click on the "Decline" button
    And I click on the "Yes" button

  Scenario: Returning to the login screen after clicking cancel on the Accept Decline Invitation page
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    And I should see that the "Register" modal button is enabled
    Then I click on the "Register" modal button
    And I click on the "Cancel" button
    #Then I should see "Welcome to Internet Banking" as the page heading

  Scenario: Existing Internet Banking Customer receives an invite to SEO should login to accept invite
    Then I should see "Accept / Decline Invitation" as the page heading
    Then I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    When I click on the "Next" button
    When I click on the "Sign in" modal button
    Then I complete "Email address" with "louise@sb.co.za"
    Then I complete "Password" with "Password12345"
    When I click on the "Sign in" button
    Then I should see that the "Accept" button is disabled
    And I should see that the "Decline" button is enabled
    When I accept "You accept the"
    Then I should see that the "Accept" button is enabled
      #And I should see "Accept / Decline Invitation" as the page heading
      #And I should see "You have been added to Flowers internet banking profile." on the panel
    When I click on the "Accept" button
    Then I should see that the "Submit" button is disabled
    When I enter the following details
      | Email verification code | 11113 |
    Then I should see that the "Submit" button is enabled
    When I click on the "Submit" button
    Then I should see error notification with "OTP has been incorrectly captured 3 times. Cardholder will need to reset invite on the Manage Account page"
    When I enter the following details
      | Email verification code | 12345 |
    Then I should see that the "Submit" button is enabled
    When I click on the "Submit" button
  #Then I should see success notification with "Welcome John, your account has been activated. You can now access Flowers Accounts"



  Scenario: Existing Internet Banking Customer receives an invite to SEO should login to decline invite
    Then I should see "Accept / Decline Invitation" as the page heading
    Then I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    When I click on the "Next" button
    When I click on the "Sign in" modal button
    Then I complete "Email address" with "joanna@sb.co.za"
    Then I complete "Password" with "1234567890"
    When I click on the "Sign in" button
    #Then I should see that the "Accept" button is disabled
    And I should see that the "Decline" button is enabled
    #And I should see "Accept / Decline Invitation" as the page heading
    When I click on the "Decline" button
    Then I should see that the "Yes" button is enabled
    And I should see that the "No" button is enabled
    #Then I click on the "No" button   i should remain on the page
    #When Then I click on the "Yes" button

  Scenario: Invited Users cancel adding their profile on internet banking
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled

  Scenario: Locked Invitation
    Then I should see "Accept / Decline Invitation" as the page heading
    Then I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "4567867890"
    When I click on the "Next" button
    Then I should see error notification with "The invitation has been locked. Please contact the person who initiated the invite to reset the invite."

  Scenario: An error occurred
    Then I should see "Accept / Decline Invitation" as the page heading
    Then I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234509876"
    When I click on the "Next" button
    Then I should see error notification with "An error occurred."

  Scenario: A user enters an invalid id number and Reference code combination to get error message Invitation not found
    Then I should see "Accept / Decline Invitation" as the page heading
    Then I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001012269189"
    Then I complete "Reference code" with "3456789012"
    When I click on the "Next" button
    Then I should see error notification with "Invitation not found"

  Scenario: Validating the form on the Accept / Decline Invitation page
    When I complete "South African ID" with "8%0I01tA88098"
    Then The "South African ID" input field should have a validation message of "Please enter a valid 13-digit South African ID number"
    When I complete "Reference code" with "ref12344567890"
    Then The "Reference code" input field should have a validation message of "Please enter a reference code of 10 characters in length"
    When I complete "South African ID" with "7501017488098"
    Then The "South African ID" input field should have a validation message of "Please enter a valid 13-digit South African ID number"
    When I complete "Reference code" with "ref!2#44$7890"
    Then The "Reference code" input field should have a validation message of "Please enter a reference code of 10 characters in length"
    When I complete "South African ID" with " "
    Then The "South African ID" input field should have a validation message of "Required"
    When I complete "Reference code" with " "
    Then The "Reference code" input field should have a validation message of "Required"

  Scenario: Newly Registered Customer should be able to cancel signing in for SED  accept invite
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Sign in" modal button is enabled
    Then I click on the "Sign in" modal button
    Then I should see that the "Sign in" button is disabled
    And I should see that the "Cancel" button is enabled
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled

  Scenario: Newly Registered Customer should be able to cancel registering for SEO
    Then I should see "Accept / Decline Invitation" as the page heading
    And I should see that the "Cancel" button is enabled
    And I should see that the "Next" button is disabled
    Then I complete "South African ID" with "8001010430080"
    Then I complete "Reference code" with "1234500000"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see that the "Register" modal button is enabled
    Then I click on the "Register" modal button
    Then I should see that the "Register now" button is disabled
    And I should see that the "Cancel" button is enabled
    When I click on the "Cancel" button
    Then I should see that the "Get started" button is enabled

  #Scenario: Form validation for Register user for SEO
    #Then I should see "Accept / Decline Invitation" as the page heading
    #And I should see that the "Cancel" button is enabled
    #And I should see that the "Next" button is disabled
    #Then I complete "South African ID" with "8501017488098"
    #Then I complete "Reference code" with "1234567890"
    #Then I should see that the "Next" button is enabled
    #When I click on the "Next" button
    #Then I should see that the "Sign in" modal button is enabled
    #And I should see that the "Register" modal button is enabled
    #When I click on the "Register" modal button
    #When I complete "Email address" with "louissb.co.za"
    #Then The "Email address" field should have a validation message of "Please enter a valid email address"
    #When I complete "Email address" with "mpilo@dl.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm"
    #Then The "Email address" field should have a validation message of "Cannot be longer than 100 characters"

