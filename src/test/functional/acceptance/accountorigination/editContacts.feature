@editCustomer @editCustomerContactInformation
Feature: Edit contact information
  As an existing customer
  I want to edit my contact information
  So that I can apply for an account

  Scenario: Successful edit
    Given I want to apply for "Current" account as a customer "who does not have an existing current account"
    When I click on the "Apply for Account" link
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    Then I should see the following details in "Contact Information" section:
      | label          | value                              |
      | Cell phone     | ******5887                         |
      | E-mail address | i***********@s***********.c*.z*    |
    When I click on the "Modify" button in "Contact Information" section
    Then I should see information notification with "Modifying these details won't change your one-time password (OTP) contact preferences. To update your OTP preferences, please visit your branch"
    And I should see the following details in the edit contact information section:
      | type           | detail                          | error                                  |
      | Cell phone     | ******5887                      | Please enter a valid cell phone number |
      | E-mail address | i***********@s***********.c*.z* | Please enter a valid email address     |
    And I should not see "Add additional contact" link
    When I change the 1st contact detail to "0713214321"
    And I change the 2nd contact detail to "joy@sb.co.za"
    Then I should see the following details in the edit contact information section:
      | type           | detail                             | error |
      | Cell phone     | 0713214321                         |       |
      | E-mail address | joy@sb.co.za                       |       |
    And I should see "Add additional contact" link
    When I click on the "Save" button
    Then I should see the OTP page with "Your Details" title
    When I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the "Your Details" title
    And I should see the "current account product" "profile" page
    And I should see "Details" as the current step in the breadcrumb
    And I should see the following details in "Contact Information" section:
      | label          | value        |
      | Cell phone     | 0713214321   |
      | E-mail address | joy@sb.co.za |

  Scenario: Remove contacts
    Given I want to apply for "Current" account as a customer "who does not have an existing current account"
    And I click on the "Apply for Account" link
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    When I click on the "Modify" button in "Contact Information" section
    Then I should see the following details in the edit contact information section:
      | type           | detail                          | error                                  |
      | Cell phone     | ******5887                      | Please enter a valid cell phone number |
      | E-mail address | i***********@s***********.c*.z* | Please enter a valid email address     |
    When I remove the 2nd contact detail
    And I change the 1st contact detail to "0713214321"
    Then I should see the following details in the edit contact information section:
      | type           | detail       | error |
      | Cell phone     | 0713214321   |       |
    And I should see "Add additional contact" link
    When I click on the "Save" button
    And I enter the following details
      | Email verification code | 12345 |
    And I click on the "Submit" button
    Then I should see the following exact details in "Contact Information" section:
      | label                            | value      |
      | Cell phone                       | 0713214321 |
      | Preferred communication language | English    |

  Scenario: Validations
    Given I have logged in as a "new to bank captured" customer
    And I click on the "Open an account" button
    And I click on the "Apply now" button in "Current account" section
    And I accept "You agree to a credit and fraud check"
    And I click on the "Next" button
    When I click on the "Modify" button in "Contact Information" section
    Then I should not see information notification with "Modifying these details won't change your one-time password (OTP) contact preferences. To update your OTP preferences, please visit your branch"
    And I should see the following details in the edit contact information section:
      | type           | detail                          | error                                  |
      | Cell phone     | ******5887                      | Please enter a valid cell phone number |
      | E-mail address | i***********@s***********.c*.z* | Please enter a valid email address     |
    When I remove the 1st contact detail
    Then I should see error notification with "Please enter at least one cell phone number to continue"
    When I change the 1st contact type to "Cell phone"
    Then I should not see error notification with "Please enter at least one cell phone number to continue"
    And I should see the following details in the edit contact information section:
      | type           | detail | error    |
      | Cell phone     |        | Required |
    And I should not see "Add additional contact" link
    And I should see that the "Save" button is disabled
    When I change the 1st contact detail to "1"
    And I change the 1st contact detail to ""
    Then I should see the following details in the edit contact information section:
      | type           | detail | error    |
      | Cell phone     |        | Required |
    And I should not see "Add additional contact" link
    And I should see that the "Save" button is disabled
    When I change the 1st contact detail to "1234567890"
    Then I should see the following details in the edit contact information section:
      | type           | detail     | error                                  |
      | Cell phone     | 1234567890 | Please enter a valid cell phone number |
    And I should not see "Add additional contact" link
    And I should see that the "Save" button is disabled

  # TODO Add scenarios:
  # Email validations
  # Cannot add multiple empty entries
