@accountSharing @seoAddUser
Feature: Enter User details
  As a customer
  I need to capture the basic details of operator to my account
  So that operator can transact on my account

  Background:
    Given I have logged in as a "seo" customer
    Then I should see the "Online Banking for Business" widget
    When I click on the "Default Dashboard" link
    #Then I should see the "Choose Dashboard" page

  Scenario: Sharing account
    When I click on the "Garden Services PTY LTD" dashboard
    Then I should see the "Account summary" page
    And I should see the "Credit card" widget on the Account Summary page
    And I should see the "Pending transactions" widget on the Account Summary page
    And I should see that the "Reject" button is enabled
    And I should see that the "Approve" button is enabled
    And I should see the "Online Banking for Business" widget
    And I should see "You have signed up" on the widget
    When I click on the "Get started" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Louise"
    And I complete "Surname" with "Linda"
    And I complete "South African ID" with "8501017488098"
    And I complete "Email address" with "louis@sb.co.za"
    And I complete "Cell phone number" with "0848501336"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    Then I should see "Set up permissions for Louise" on the permissions panel
    And I should see that the "Next" button is disabled
    When I assign the "Authoriser" role to the account "30-249-044-5"
    And I assign the "View" role to the account "30-249-044-8"
    And I should see that the "Next" button is enabled
    When I click on the "Next" button
    When I click on the "Confirm" button
    Then I should see success notification with "You have successfully invited a user to this account"


  Scenario: Adding a South African operator with valid details
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Pending transactions" widget on the Account Summary page
    And I should see the "Transaction accounts" widget on the Account Summary page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    And I should see the "Credit card" widget on the Account Summary page
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Louise"
    And I complete "Surname" with "Linda"
    And I complete "South African ID" with "8501017488098"
    And I complete "Email address" with "louis@sb.co.za"
    And I complete "Cell phone number" with "0848501336"
    Then I should see that the "Next" button is enabled
    And I click on the "Next" button
    And I should see that the "Next" button is disabled
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "None" role to the account "30-249-044-8"
    And I should see that the "Next" button is disabled
    #Then I should see "Set up permissions for Louise" page

  Scenario: Input validations for when user tries to capture invalid operator details
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    When I complete "First name" with "L"
    Then The "First name" input field should have a validation message of "Please enter a first name which is at least 2 characters in length"
    When I complete "First name" with "L0ui$e"
    Then The "First name" input field should have a validation message of "Please enter only alphabetical characters, spaces, apostrophes and hyphens"
    When I complete "First name" with "Qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvbnm"
    Then The "First name" input field should have a validation message of "Please enter a first name up to 40 characters in length"
    When I complete "Surname" with "J"
    Then The "Surname" input field should have a validation message of "Please enter a surname which is at least 2 characters in length"
    When I complete "Surname" with "J@"
    Then The "Surname" input field should have a validation message of "Please enter only alphabetical characters, spaces, apostrophes and hyphens"
    When I complete "Surname" with "Qwertyuioplkjhgfdsazxcvbnmqwertyuioplkjhgfdsazxcvbnm"
    Then The "Surname" input field should have a validation message of "Please enter a surname up to 40 characters in length"
    When I complete "South African ID" with "8%0I01tA88098"
    Then The "South African ID" input field should have a validation message of "Please enter a valid 13-digit South African ID number"
    When I complete "South African ID" with "7501017488098"
    Then The "South African ID" input field should have a validation message of "Please enter a valid 13-digit South African ID number"
    When I complete "Email address" with "louissb.co.za"
    Then The "Email address" input field should have a validation message of "Please enter a valid email address"
    #Then I complete "Cell phone number" with "84850133"
    #Then The "Cell phone number" field should have a validation message of "must be 9 numbers long"
    #Then I complete "Cell phone number" with "8485013354643874397"
    #Then The "Cell phone number" field should have a validation message of "must be 9 numbers long"
    #Then I complete "Cell phone number" with "08485013354643874397"
    #Then The "Cell phone number" field should have a validation message of "must be 10 numbers long"
    #Then I complete "Cell phone number" with "084850133"
    #Then The "Cell phone number" field should have a validation message of "must be 10 numbers long"
    #Then I complete "Cell phone number" with "zero"
    #Then The "Cell phone number" field should have a validation message of "Please enter a valid cell phone number"
    #Then I complete "Cell phone number" with "074 131 4253"
    #Then The "Cell phone number" field should have a validation message of "Please enter a valid cell phone number"
    When I complete "First name" with " "
    Then The "First name" input field should have a validation message of "Required"
    And I should see that the "Next" button is disabled
    When I complete "Surname" with " "
    Then The "Surname" input field should have a validation message of "Required"
    And I should see that the "Next" button is disabled
    When I complete "South African ID" with " "
    Then The "South African ID" input field should have a validation message of "Required"
    And I should see that the "Next" button is disabled
    When I complete "Email address" with " "
    Then The "Email address" input field should have a validation message of "Required"
    And I should see that the "Next" button is disabled
    #Then I complete "Cell phone number" with " "
    #Then The "Cell phone number" field should have a validation message of "Required"

  Scenario: User returns to account summary after cancelling the add operator process
    When I click on the "Garden Services PTY LTD" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "You have signed up" on the widget
    When I click on the "Get started" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I click on the "Cancel" button
    Then I should see that the "Confirm" modal button is enabled
    And I should see that the "Back" modal button is enabled
    When I click on the "Back" modal button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Louise"
    And I complete "Surname" with "Linda"
    And I complete "South African ID" with "8501017488098"
    And I complete "Email address" with "louis@sb.co.za"
    And I complete "Cell phone number" with "0848501336"
    #And I should see that the "Next" button is enabled
    And I click on the "Next" button
    Then I should see "Set up permissions for Louise" on the permissions panel
    When I click on the "Back" button
    Then I should see "Enter this user's details" on the panel
    When I click on the "Cancel" button
    And I click on the "Confirm" button
    Then I should see the "Online Banking for Business" widget
    And I should see "You have signed up" on the widget
    When I click on the "Garden Services PTY LTD" link
    When I click on the "Flowers" dashboard
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    When I complete "First name" with "Kagiso"
    And I complete "Surname" with "Katlego"
    And I complete "South African ID" with "8501017488098"
    And I complete "Email address" with "kk@sb.co.za"
    And I complete "Cell phone number" with "748501936"
    And I click on the "Next" button
    Then I should see "Set up permissions for Kagiso" on the permissions panel
    When I click on the "Cancel" button
    Then I should see that the "Confirm" modal button is enabled
    And I should see that the "Back" modal button is enabled
    When I click on the "Back" modal button
    Then I should see "Set up permissions for Kagiso" on the permissions panel
    When I click on the "Cancel" button
    And I click on the "Confirm" modal button
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget

  Scenario: Restricting duplicate operators from being created
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
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

  Scenario: Edit user details whiles adding a user
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "Capturer" role to the account "30-249-044-8"
    And I click on the "Next" button
    When I click on the "Edit" link on the "Personal details" panel
    Then I should see "Enter this user's details" on the panel
    When I click on the "Cancel" button
    And I click on the "Back" button
    And I click on the "Cancel" button
    And I click on the "Confirm" button
    Then I should see "Active users" on the widget

  Scenario:  edit user details whiles adding a user
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "Capturer" role to the account "30-249-044-8"
    And I click on the "Next" button
    When I click on the "Edit" link on the "Personal details" panel
    Then I should see "Enter this user's details" on the panel
    When I complete "First name" with "Fika"
    And I complete "Surname" with "Karabo"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "fika.karabo@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    #Then I should see "Set up permissions for Louise" on teh panel
    When I click on the "Next" button
    And I click on the "Next" button
    And I click on the "Confirm" button
    Then I should see success notification with "You have successfully invited a user to this account"

  Scenario: Cancel edit user details whiles adding a user
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "Capturer" role to the account "30-249-044-8"
    And I click on the "Next" button
    When I click on the "Edit" link on the "Personal details" panel
    Then I should see "Enter this user's details" on the panel
    When I complete "First name" with "Fika"
    And I complete "Surname" with "Karabo"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "fika.karabo@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
  #Then I should see "Set up permissions for Louise" on teh panel
    When I click on the "Next" button
    And I click on the "Next" button
    And I click on the "Confirm" button


  Scenario: Editing user permissions
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    And I should see that the "Next" button is disabled
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "Capturer" role to the account "30-249-044-8"
    Then I should see that the "Next" button is enabled
    And I click on the "Next" button
    And I click on the "Edit" link on the "Permissions" panel
    #Then I should see the "Set up permissions for Louise" On the panel

  #Then I should see "permissions" on the heading

    Then I assign the "Authoriser" role to the account "30-249-044-5"
    And I assign the "View" role to the account "30-249-044-8"
    And I click on the "Next" button
  #Then I should see "permissions" on the heading
    When I click on the "Confirm" button
  #Then I should see the "Jane Smith" page
    Then I should see success notification with "You have successfully invited a user to this account"


  Scenario: Cancel editing user permissions
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    And I click on the "Back" button
    Then I should see "Enter this user's details" on the panel
    When I click on the "Next" button
    And I click on the "Cancel" button
    And I click on the "Back" modal button
    And I click on the "Cancel" button
    And I click on the "Confirm" modal button
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget


  Scenario: Cancel editing user permissions on confirm details screen
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    And I click on the "Cancel" button
    And I click on the "Back" modal button
    And I click on the "Cancel" button
    And I click on the "Confirm" modal button
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget

  Scenario: Cancel Editing user permissions after clicking edit link on the permissions panel
    When I click on the "Flowers" dashboard
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget
    And I should see "Active users" on the widget
    When I click on the "Invite a user" button
    Then I should see "Enter this user's details" on the panel
    And I should see that the "Next" button is disabled
    When I complete "First name" with "Thulani"
    And I complete "Surname" with "Sentani"
    And I complete "South African ID" with "9111185865090"
    And I complete "Email address" with "thulani.sentani@sb.co.za"
    And I complete "Cell phone number" with "0612345789"
    Then I should see that the "Next" button is enabled
    And I should see that the "Cancel" button is enabled
    And I click on the "Next" button
    And I should see that the "Next" button is disabled
    When I assign the "None" role to the account "30-249-044-5"
    And I assign the "Capturer" role to the account "30-249-044-8"
    Then I should see that the "Next" button is enabled
    And I click on the "Next" button
    And I click on the "Edit" link on the "Permissions" panel
    And I click on the "Back" button
    Then I should see "Enter this user's details" on the panel
    When I click on the "Next" button
    #Then I should see "Set up permissions for Louise" on the panel
    When I click on the "Next" button
    And I click on the "Edit" link on the "Permissions" panel
    #Then I should see "Set up permissions for Louise" on the panel
    When I click on the "Cancel" button
    And I click on the "Back" modal button
    And I click on the "Cancel" button
    And I click on the "Confirm" button
    Then I should see the "Account summary" page
    And I should see the "Online Banking for Business" widget



