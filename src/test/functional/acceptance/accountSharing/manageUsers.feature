@accountSharing @manageUsers
Feature: Enter User details
  As a customer
  I need to capture the basic details of operator to my account
  So that operator can transact on my account

  Background:
    Given I have logged in as a "seo" customer
    Then I should see the "Online Banking for Business" widget
    When I click on the "Default Dashboard" link
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see the "Pending transactions" widget on the Account Summary page
    When I select the "Online Banking for Business" menu option
    Then I should see "Manage users" heading
    And I should see that the "Invite a user" button is enabled

  Scenario: Viewing list of added users
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I click on the "Cancel" button
    And I click on the "Back" button
    And I click on the "Cancel" button
    And I click on the "Confirm" button
    Then I should see the "Account summary" page

  Scenario: Restricting duplicate user from being added
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Nikita"
    And I complete "Surname" with "Karabo"
    And I complete "South African ID" with "8001011967189"
    And I complete "Email address" with "karabon@sb.co.za"
    And I complete "Cell phone number" with "0845973265"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    Then I should see error notification with "Nikita has been previously added"

  Scenario: Preventing duplicate user from being added
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "John"
    And I complete "Surname" with "Don"
    And I complete "South African ID" with "8501017488098"
    And I complete "Email address" with "karabon@sb.co.za"
    And I complete "Cell phone number" with "0845973265"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    #Then I should see "Set up permissions for Louise" on the permissions panel
    And I should see that the "Next" button is disabled
    When I assign the "Capturer" role to the account "30-249-044-5"
    And I assign the "None" role to the account "30-249-044-8"
    And I should see that the "Next" button is enabled
    When I click on the "Next" button
    When I click on the "Confirm" button
    And I enter the following details
      | Email verification code | 12345 |
    When I click on the "Submit" button
    Then I should see error notification with "This user has been previously added."

  Scenario: Click back button to return to the manage users screen
    When I click "John Smith" on the list of added users
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Deactivate user" button is enabled
    When I click on the "Back" button
    Then I should see that the "Invite a user" button is enabled

  Scenario: Returning to the added users screen after canceling editing a user
    When I click "Jane Smith" on the list of added users
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Activate user" button is enabled
    When I click on the "Edit" link on the "Personal details" panel
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    When I click on the "Cancel" button
    And I click on the "Back" button
    And I click on the "Cancel" button
    And I click on the "Confirm" button
    And I click on the "Edit" link
    When I click on the "Next" button
    And I click on the "Edit" link
    And I complete "First name" with "Jonathan"
    And I complete "Surname" with "Tsabedze"
    And I complete "Cell phone number" with "0848501336"
    And I click on the "Cancel" button
    And I click on the "Back" button
    And I click on the "Cancel" button
    And I click on the "Confirm" button
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Deactivate user" button is enabled

  Scenario: Editing user permissions
    When I click "Jane Smith" on the list of added users
    And I click on the "Edit" link on the "Permissions" panel
    Then I should see the "Edit permissions" page
    And I assign the "Capturer" role to the account "30-249-044-8"
    And I click on the "Next" button
  #Then I should see "permissions" on the heading
    And I click on the "Edit" link on the "Permissions" panel
    Then I assign the "Authoriser" role to the account "30-249-044-5"
    And I click on the "Next" button
  #Then I should see "permissions" on the heading
  When I click on the "Confirm" button
  #Then I should see the "Jane Smith" page
  Then I should see that the "Delete user" button is enabled
  And I should see that the "Activate user" button is enabled
  
  Scenario: Error notification when Editing user permissions are set to none for all accounts
    When I click "Jane Smith" on the list of added users
    And I click on the "Edit" link on the "Permissions" panel
    Then I should see the "Edit permissions" page
    And I assign the "None" role to the account "30-249-044-8"
    And I assign the "None" role to the account "30-249-044-5"
    Then I should see error notification with "Please ensure that at least one account is assigned a role other than 'None'"
    And I should see that the "Next" button is disabled

  
  Scenario: Cancel Edit permissions from the confirm edit permissions screen
    When I click "Jane Smith" on the list of added users
    And I click on the "Edit" link on the "Permissions" panel
    Then I should see the "Edit permissions" page
    And I assign the "Capturer" role to the account "30-249-044-8"
    And I assign the "Authoriser" role to the account "30-249-044-5"
    Then I click on the "Next" button
    #Then I should see "permissions" on the heading
    When I click on the "Cancel" button
    And I click on the "Back" modal button
    And I click on the "Cancel" button
    And I click on the "Confirm" modal button
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Activate user" button is enabled


  Scenario: Cancel Edit permissions from the edit permissions screen
    When I click "Jane Smith" on the list of added users
    And I click on the "Edit" link on the "Permissions" panel
    Then I should see the "Edit permissions" page
    And I assign the "None" role to the account "30-249-044-8"
    Then I click on the "Cancel" button
    And I click on the "Back" modal button
    And I click on the "Cancel" button
    And I click on the "Confirm" modal button
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Activate user" button is enabled

  Scenario: Testing Error notifications for input boxes
    When I click "Louise Smith" on the list of added users
    Then I should see that the "Delete user" button is enabled
    And I should see that the "Deactivate user" button is enabled
    When I click on the "Edit" link
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    When I click on the "Next" button
    And I click on the "Edit" link
    When I complete "First name" with "L"
    Then The "First name" field should have a validation message of "Please enter a first name which is at least 2 characters in length"
    When I complete "First name" with "L0ui$e"
    Then The "First name" field should have a validation message of "Please enter only alphabetical characters, spaces, apostrophes and hyphens"
    When I complete "First name" with "Qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvbnm"
    Then The "First name" field should have a validation message of "Please enter a first name up to 40 characters in length"
    When I complete "Surname" with "J"
    Then The "Surname" field should have a validation message of "Please enter a surname which is at least 2 characters in length"
    When I complete "Surname" with "J@"
    Then The "Surname" field should have a validation message of "Please enter only alphabetical characters, spaces, apostrophes and hyphens"
    When I complete "Surname" with "Qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvbnm"
    Then The "Surname" field should have a validation message of "Please enter a surname up to 40 characters in length"
    And I complete "Cell phone number" with "0848501336"
    When I click on the "Cancel" button
    And I click on the "Back" button
    And I click on the "Cancel" button
    And I click on the "Confirm" button


  Scenario: Deleting an active user
    When I click "John Smith" on the list of added users
    And I click on the "Delete user" button
    And I click on the "Cancel" button
    And I click on the "Delete user" button
    And I click on the "Continue" button
    Then I should see that the "Invite a user" button is enabled

  Scenario: Deleting an inactive user
    When I click "John Smith" on the list of added users
    And I click on the "Delete user" button
    And I click on the "Cancel" button
    And I click on the "Delete user" button
    And I click on the "Continue" button
    Then I should see that the "Invite a user" button is enabled