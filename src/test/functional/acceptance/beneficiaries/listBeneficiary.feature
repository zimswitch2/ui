@listBeneficiary
Feature: edit a beneficiary

  Scenario: when no beneficiaries are linked to the profile' a warning message should be displayed
    Given I have logged in as a "credentials With Zero Beneficiaries" customer
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And  I should see a waring message saying "There are no beneficiaries linked to your profile. Please add a beneficiary in order to pay."

  Scenario: should show a list containing all the beneficiaries related to a given account
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I should see that the list of beneficiaries contains 7 elements


  Scenario: should filter list of the beneficiaries according to a given beneficiary name
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I complete the searchbox with "Danielle Ward"
    Then I should see that "Danielle Ward" is displayed under "Beneficiary Name" heading


  Scenario: should filter list of the beneficiaries according to a given beneficiary my reference
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I complete the searchbox with "Sister"
    Then I should see that "Sister" is displayed under "Your Reference" heading


  Scenario: should filter list of the beneficiaries according to a group name
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I complete the searchbox with "Groups Test"
    Then I should see that "Groups Test" is displayed under "Group" heading

  Scenario: should filter list of the beneficiaries according to a given beneficiary last payment date
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I complete the searchbox with "12 November 2013"
    Then I should see that "12 November 2013" is displayed under "Last Payment Date" heading

  Scenario: should show a warning message when no beneficiaries are found for the search criteria provided
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    And I complete the searchbox with "No results"
   Then I should see a waring message saying "No matches found."

  Scenario: should have a back button
    Given I have logged in
    When I click on the "Transact" link
    Then I should see the "Transact" page
    And the "Pay beneficiary" tile should be visible
    When I click on the "Pay beneficiary" tile
    Then I should see the "List of Beneficiaries" page
    When I click on the "Back" button
    Then I should see the "Transact" page
