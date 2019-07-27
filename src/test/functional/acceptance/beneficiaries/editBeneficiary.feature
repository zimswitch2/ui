@editBeneficiary
Feature: edit a beneficiary

  Scenario: When I click the cancel button from edit page, it should return to list of beneficiaries
    Given I have logged in as a "credentials For NoFuture Transactions" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Demo"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    And The "Cancel" button is enabled
    When I click on the "Cancel" button
    Then I should see the "List of Beneficiaries" page

  Scenario: When I click the cancel button from confirm page, it should return to list of beneficiaries
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    #When I complete the searchbox with "Danielle Ward"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    And The "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "Edit Beneficiary" page
    And The "Cancel" button is enabled
    When I click on the "Cancel" button
    Then I should see the "List of Beneficiaries" page

  Scenario: The modify button should take me back to the edit beneficiary page
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Danielle Ward"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    When I complete "Name" with "Angela"
    And  I complete "Bank" with "ABSA"
    And I complete "Branch" with "63200500 - DURBAN CENTRAL FOREX OPS"
    And I complete "Account number" with "66200080764"
    And I complete "Your reference" with "Roommate"
    And I complete "Beneficiary reference" with "rent"
    When I click on the "Add beneficiary to an existing group (optional)" dropdown
    And I select the "Test 3" option of the "Add beneficiary to an existing group (optional)" dropdown
    And I accept "Yes"
    And I accept "SMS"
    And I complete "Recipient name" with "Angela"
    And I complete "Recipient cell phone number" with "0725698548"
    Then I should see that the "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "Edit Beneficiary" page
    And The "Modify" button is enabled
    When I click on the "Modify" button
    Then I should see the "Edit Beneficiary" page
    And The "Cancel" button is enabled
    When I click on the "Cancel" button
    Then I should see the "List of Beneficiaries" page

  Scenario: pre-populate fields with existing data while loading the edit beneficiary page
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Danielle Ward"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    And I should see "Danielle Ward" in "Name" textbox
    And I should see "45640211" in "Account number" textbox
    And I should see that the "Add beneficiary to an existing group (optional)" dropdown has "Alegtest" selected


  Scenario:
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    And The "Next" button is enabled
    When I click on the "Next" button
    Then I should see the "Edit Beneficiary" page
    #And The "Confirm" button is enabled
    #When I click on the "Confirm" button
    #Then I should see the "List of Beneficiaries" page


  Scenario: when editing beneficiary with future transactions, the Next button should be disabled
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Demo"
    When I click on the "modify" icon
    Then I should see that the "Next" button is disabled


  Scenario: when editing a listed beneficiary, the next button should be enabled
    Given I have logged in as a "credentials For NoFuture Transactions" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Edgars"
    When I click on the "modify" icon
    Then I should see that the "Next" button is enabled

  Scenario: when editing a listed beneficiary, it should not give the option of entering bank details
    Given I have logged in as a "credentials For NoFuture Transactions" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Edgars"
    When I click on the "modify" icon
    #And I should not see the "Name" input field
    And I should not see the "Branch" input field
    And I should not see the "Account number" input field
    Then I should not see the "Bank" input field


  Scenario: when editing a listed beneficiary, it should not give the option of searching the directory
    Given I have logged in as a "credentials For NoFuture Transactions" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Edgars"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    #And  I should see "Edgars" in "Beneficiary name" textbox

  Scenario: when editing a listed beneficiary, it should edit beneficiary references
    Given I have logged in as a "credentials For NoFuture Transactions" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I complete the searchbox with "Edgars"
    When I click on the "modify" icon
    Then I should see the "Edit Beneficiary" page
    And I complete "Your reference" with "NEW MY REF"
    And I complete "Beneficiary reference" with "NEW REC REF"
    When I click on the "Next" button
    Then I should see the "Edit beneficiary" page
    When I click on the "Confirm" button
    #Then I should see the "List of Beneficiaries" page
