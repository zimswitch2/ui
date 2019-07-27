@targetedOffers
Feature: Targeted Offers
  As a current account user
  I need to be be notified of relevant current account banking solutions
  So that I can apply for products that match my banking needs

  Scenario Outline: Accepting a current account targeted offer
    Given I log in with user <account>
    Then I should see a <product_name> offer
    And The targeted offer "A banking solution for you" header should be visible
    And There should a product description with text <product_description> and offer description text <offer_description>
    And The "Overdraft up to" should be <amount>
    And The "Interest rate" should be <interest_rate>
    And The "Min. monthly fee" should be <monthly_fee>
    And A "accept offer button" with text "Accept offer" should be visible
    And A "no thanks button" with text "No thanks" should be visible
    When I accept a <product_name> targeted offer
    Then I should see the pre-screen page with title "Before You Start Your Application"

    Examples:
      | account                         | product_name                      | amount   | interest_rate | monthly_fee | offer_description                                                                                                             | product_description                                                                                                        |
      | privateBankingOffer             | Private Banking                   | R 40 000 | 17%           | R 325       | Private Banking Targeted Offer, you qualify for a Private Banking current account with a free cheque card.                    | As an exclusive client you have your own Private Banker, as well as qualified experts who will expand your portfolio       |
      | consolidatorCurrentAccountOffer | Consolidator Current Account      | R 10 000 | 17%           | R 45        | Consolidator Account Offer, you qualify for a Consolidator Current Account with a free cheque card.                           | A loan that includes a revolving credit plan, which means you can borrow again after repaying a portion of your loan.      |
      | prestigeBanking                 | Prestige Banking                  | R 10 000 | 17%           | R 179       | Prestige Offer, you qualify for a Prestige Banking current account with a free cheque card.                                   | A simple and manageable banking solution designed to provide peace of mind to those approaching their retirement years.    |
      | eliteBanking                    | Elite Banking                     | R 5 000  | 17%           | R 95        | Elite Banking Offer, you qualify for an Elite Banking current account with a free cheque card.                                        | As a Prestige Banker, you are supported by a team of bankers who personally assist you - even after hours and on weekends. |
      | graduateAndProfessionalBanking  | Graduate and Professional Banking | R 10 000 | 17%           | Variable    | Graduate and Professional Banking, you qualify for a Graduate and Professional Banking current account with a free cheque card. | A set of day-to-day banking, finance and investment solutions that support you in your move towards a professional career. |


  Scenario Outline: Declining a current account targeted offer
    Given I log in with user <account>
    When I decline a <product_name> offer
    Then The <product_name> targeted offer should not be displayed

    Examples:
      | account                         | product_name                      |
      | privateBankingOffer             | Private Banking                   |
      | consolidatorCurrentAccountOffer | Consolidator Current Account      |
      | prestigeBanking                 | Prestige Banking                  |
      | eliteBanking                    | Elite Banking                     |
      | graduateAndProfessionalBanking  | Graduate and Professional Banking |

  Scenario Outline: Accepting an overdraft targeted offer
    Given I log in with user <account>
    Then I should see a <product_name> offer
    And The "Limit up to" should be <limit>
    And The "Interest rate" should be <interest_rate>
    And There should a product description with text <product_description> and offer description text <offer_description>
    When I click on the call me back option
    Then I should see the call me back page with the following labels
      | First name              | TESTING       |
      | Surname                 | DEVTWO        |
      | South African ID number | *********6082 |
    And I should see the call me back page with the following inputs
      | Contact number | ******5887 |
    When I submit the call me back details
    Then I should see a confirmation dialog with text "Thank you -- your details have been sent. A consultant will call you back within one working day."
    When I close the confirmation dialog
    Then The <product_name> targeted offer should not be displayed
    Examples:
      | account                | product_name       | limit    | interest_rate | offer_description                                     | product_description                                                                                                        |
      | overdraftFacility      | Overdraft          | R 10 000 | 17%           | Overdraft Offer, you qualify for an overdraft on your current account. | Do you ever need extra cash at short notice? With an overdraft you can easily borrow money from your current account.      |
      | overdraftIncreaseOffer | Overdraft Increase | R 250    | 17%           | Overdraft Increase Offer, you qualify for an overdraft increase.                | Need more cash out of your existing overdraft? Boost your overdraft limit and borrow more money from your current account. |


  Scenario Outline: Declining an overdraft targeted offer
    Given I log in with user <account>
    When I decline a <product_name> offer
    Then The <product_name> targeted offer should not be displayed
    Examples:
      | account                | product_name       |
      | overdraftFacility      | Overdraft          |
      | overdraftIncreaseOffer | Overdraft Increase |


  Scenario Outline: Accepting an rcp loan facility targeted offer
    Given I log in with user <account>
    Then I should see a <product_name> offer
    And The targeted offer "A banking solution for you" header should be visible
    And There should a product description with text <product_description> and offer description text <offer_description>
    And The "Limit up to" should be <amount>
    And The "Interest rate" should be <interest_rate>
    And A "accept offer button" with text "Accept offer" should be visible
    And A "no thanks button" with text "No thanks" should be visible
    When I accept a <product_name> targeted offer
    Then I should see the pre-screen page with title "Before You Start Your Application"
    Examples:
      | account           | product_name          | amount   | interest_rate | offer_description                                                                                       | product_description                                                                                                   |
      | rcpcurrentAccount | Revolving Credit Plan | R 10 000 | 17%           | Internet Banking User, you qualify for a revolving credit plan with a competitive interest rate and no early termination fees. | A loan that includes a revolving credit plan, which means you can borrow again after repaying a portion of your loan. |


  Scenario Outline: Declining an rcp loan facility targeted offer
    Given I log in with user <account>
    When I decline a <product_name> offer
    Then The <product_name> targeted offer should not be displayed
    Examples:
      | account           | product_name          |
      | rcpcurrentAccount | Revolving Credit Plan |
