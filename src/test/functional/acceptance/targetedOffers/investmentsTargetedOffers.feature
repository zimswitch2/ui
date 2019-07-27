@targetedOffers
Feature: Targeted Offers
  As an online banking user
  I need to be be notified of relevant investment banking solutions
  So that I can apply for products that match my banking needs

  Scenario Outline: Accepting an investments targeted offer
    Given I log in with user <account>
    Then I should see a <product_name> offer
    And The "Opening deposit" should be <amount>
    And The "Access your money" should be <access_frequency>
    And The "Interest up to" should be <interest>
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
      | account                | product_name             | amount   | access_frequency | interest      | offer_description                                                        | product_description                                                                                                         |
      | taxFreeCallOffer       | Tax-Free Call Account    | R 250    | Anytime          | 6.50%         | Tax-Free Call Account Offer, if you're looking to save, a Tax-Free Call Account may suit you.         | Invest up to R 30 000 a year and a maximum of R 500 000 in your lifetime - and get tax-free returns on your contributions.  |
      | pureSaveAccount        | PureSave                 | R 50     | Anytime          | 2.80%         | PureSave Account Targeted Offer, if you're looking to save, a PureSave Account may suit you.              | PureSave is an easy way to start saving. Save what you can - and gain instant access to your money when you need it.        |
      | callDepositOffer       | Call Deposit             | R 1 000  | Anytime          | 5.20% or more | Call Deposit Offer, if you're looking to save, a Call Deposit Account may suit you.          | Earn competitive interest while retaining immediate access to your funds.                                                   |
      | marketLinkOffer        | MarketLink               | R 5 000  | Anytime          | 4.90%         | MarketLink Offer, if you're looking to save, a MarketLink Account may suit you.            | With MarketLink you gain the flexibility of a current account, in addition to competitive interest rates.                   |
      | moneyMarketCallAccount | MoneyMarket Call Account | R 20 000 | Anytime          | 6.25%         | MoneyMarket Call Account Offer, if you're looking to save, a MoneyMarket Call Account may suit you.      | Benefit from highly competitive interest rates. Your funds are available on demand and your capital is guaranteed.          |
      | contractSaveOffer      | ContractSave             | R 100    | You choose       | 5.50%         | ContractSave Offer, if you're looking to save, a ContractSave Account may suit you.          | ContractSave helps you reach your savings goal more quickly by putting aside a fixed amount every month over 1 to 20 years. |
      | fixedDepositOffer      | Fixed Deposit            | R 1 000  | You choose       | 8.50%         | Fixed Deposit Offer, if you're looking to save, a Fixed Deposit Account may suit you.         | Invest your funds for a set period. The interest rate is fixed, and your capital is guaranteed and protected.               |
      | accessSaveOffer        | AccessSave               | R 50     | Anytime          | 3.00%         | AccessSave Offer, if you're looking to save, an AccessSave Account may suit you.           | A flexible savings option with a low minimum opening deposit and bonus interest when you reach your savings target.         |
      | societySchemeOffer     | Society Scheme           | R 300    | Anytime          | 3.50%         | Society Scheme Offer, if you're looking to save, a Society Scheme Account may suit you.        | Ideal for groups that want to save together. Includes stokvels, burial societies, social clubs and investment clubs.        |
      | dayNoticeDepositOffer  | 32-Day Notice Deposit    | R 250    | 32 Days          | 6.50%         | 32 Day Notice Deposit Offer, if you're looking to save, a 32-Day Notice Deposit Account may suit you. | We would like to recommend opening a 32-Day Notice Deposit account to ensure that your surplus cash earns interest.         |

  Scenario Outline: Declining an investments targeted offer
    Given I log in with user <account>
    When I decline a <product_name> offer
    Then The <product_name> targeted offer should not be displayed

    Examples:
      | account                | product_name             |
      | taxFreeCallOffer       | Tax-Free Call Account    |
      | pureSaveAccount        | PureSave                 |
      | callDepositOffer       | Call Deposit             |
      | marketLinkOffer        | MarketLink               |
      | moneyMarketCallAccount | MoneyMarket Call Account |
      | contractSaveOffer      | ContractSave             |
      | fixedDepositOffer      | Fixed Deposit            |
      | accessSaveOffer        | AccessSave               |
      | societySchemeOffer     | Society Scheme           |
      | dayNoticeDepositOffer  | 32-Day Notice Deposit    |