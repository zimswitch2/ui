@targetedOffers
Feature: Targeted Offers
  As a credit account user
  I need to be be notified of relevant credit card banking solutions
  So that I can apply for products that match my banking needs

  Scenario Outline: Accepting credit card targeted offers with monthly fees
    Given I log in with user <account>
    Then I should see a <product_name> offer
    And The "Limit up to" should be <limit>
    And The "Interest rate" should be <interest_rate>
    And The "Monthly fee" should be <monthly_fee>
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
      | account            | product_name         | limit     | interest_rate | monthly_fee | offer_description                                                           | product_description                                                                                       |
      | accessCreditCard   | AccessCredit Card    | R 5 000   | 17%           | R 49        | AccessCredit card Offer, you qualify for an AccessCredit Card with 0% interest for up to 3 months.   | Get the AccessCredit card with the AccessBanking suite to enjoy multiple benefits.                        |
      | blueCreditCard     | Blue Credit Card     | R 5 000   | 17%           | R 49        | Blue credit card Offer, you qualify for a Blue Credit Card with 0% interest for up to 3 months.     | A starter credit card with easy qualification requirements and ease of use.                               |
      | goldCreditCard     | Gold Credit Card     | R 25 000  | 17%           | R 35        | Gold credit card Offer, you qualify for a Gold Credit Card with 0% interest for up to 3 months.     | Includes many free features that make it easier than ever to manage your finances.                        |
      | titaniumCreditCard | Titanium Credit Card | R 25 000  | 17%           | R 42        | Titanium credit card Offer, you qualify for a Titanium Credit Card with 0% interest for up to 3 months. | Competitive interest rates and free services make the Titanium Credit Card ideal for young professionals. |
      | platinumcreditCard | Platinum Credit Card | R 100 000 | 16.70%        | R 57        | Platinum Credit Targeted Offer, you qualify for a Platinum Credit Card with 0% interest for up to 3 months. | As a Platinum Credit Card holder your needs are supported by dedicated consultants.                       |


  Scenario Outline: Declining a credit card targeted offer
    Given I log in with user <account>
    When I decline a <product_name> offer
    Then The <product_name> targeted offer should not be displayed
    Examples:
      | account            | product_name         |
      | accessCreditCard   | AccessCredit Card    |
      | blueCreditCard     | Blue Credit Card     |
      | goldCreditCard     | Gold Credit Card     |
      | titaniumCreditCard | Titanium Credit Card |
      | platinumcreditCard | Platinum Credit Card |
