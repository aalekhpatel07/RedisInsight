import { t, Selector } from 'testcafe';
import { Common } from '../helpers/common';
import { BrowserPage } from '../pageObjects';

const common = new Common();
const browserPage = new BrowserPage();

export class CliPage {

    //------------------------------------------------------------------------------------------
    //DECLARATION OF TYPES: DOM ELEMENTS and UI COMPONENTS
    //*Assign the 'Selector' type to any element/component nested within the constructor.
    //------------------------------------------------------------------------------------------

  cliHelper: Selector
  cliExpandButton: Selector
  cliHelperText: Selector
  cliCommandInput: Selector
  cliOutputResponseSuccess: Selector
  cliOutputResponseFail: Selector
  cliArea: Selector
  cliCollapseButton: Selector
  cliHelperSearch: Selector
  cliHelperOutputTitles: Selector
  filterGroupTypeButton: Selector
  filterOptionGroupType: Selector
  cliHelperTitleArgs: Selector
  cliHelperTitle: Selector
  cliHelperSummary: Selector
  readMoreButton: Selector
  cliHelperArguments: Selector
  cliHelperComplexity: Selector
  cliCommandAutocomplete: Selector
  cliResizeButton: Selector
  cliCommandExecuted: Selector
  cliReadMoreJSONCommandDocumentation: Selector
  cliReadMoreRediSearchCommandDocumentation: Selector
  expandCommandHelperButton: Selector
  closeCommandHelperButton: Selector
  commandHelperArea: Selector
  minimizeCliButton: Selector
  minimizeCommandHelperButton: Selector
  cliBadge: Selector
  commandHelperBadge: Selector
  cliEndpoint: Selector
  cliDbIndex: Selector

  constructor() {
      //-------------------------------------------------------------------------------------------
      //DECLARATION OF SELECTORS
      //*Declare all elements/components of the relevant page.
      //*Target any element/component via data-id, if possible!
      //*The following categories are ordered alphabetically (Alerts, Buttons, Checkboxes, etc.).
      //-------------------------------------------------------------------------------------------
      //BUTTONS
      this.cliExpandButton = Selector('[data-testid=expand-cli]');
      this.cliCollapseButton = Selector('[data-testid=close-cli]');
      this.expandCommandHelperButton = Selector('[data-testid=expand-command-helper]');
      this.closeCommandHelperButton = Selector('[data-testid=close-command-helper]');
      this.filterGroupTypeButton = Selector('[data-testid=select-filter-group-type]');
      this.filterOptionGroupType = Selector('[data-test-subj^=filter-option-group-type-]');
      this.readMoreButton = Selector('[data-testid=read-more]');
      this.minimizeCliButton = Selector('[data-testid=hide-cli]');
      this.minimizeCommandHelperButton = Selector('[data-testid=hide-command-helper]');
      this.cliBadge = Selector('[data-testid=expand-cli] span');
      this.commandHelperBadge = Selector('[data-testid=expand-command-helper] span');
      // TEXT INPUTS (also referred to as 'Text fields')
      this.cliHelper = Selector('[data-testid=cli-helper]');
      this.cliHelperText = Selector('[data-testid=cli-helper-default]');
      this.cliCommandInput = Selector('[data-testid=cli-command]');
      this.cliOutputResponseSuccess = Selector('[data-testid=cli-output-response-success]');
      this.cliOutputResponseFail = Selector('[data-testid=cli-output-response-fail]');
      this.cliArea = Selector('[data-testid=cli');
      this.cliHelperSearch = Selector('[data-testid=cli-helper-search]');
      this.cliHelperOutputTitles = Selector('[data-testid^=cli-helper-output-title-]');
      this.cliHelperTitle = Selector('[data-testid=cli-helper-title]');
      this.cliHelperTitleArgs = Selector('[data-testid=cli-helper-title-args]');
      this.cliHelperSummary = Selector('[data-testid=cli-helper-summary]');
      this.cliHelperArguments = Selector('[data-testid=cli-helper-arguments]');
      this.cliHelperComplexity = Selector('[data-testid=cli-helper-complexity]');
      this.cliCommandAutocomplete = Selector('[data-testid=cli-command-autocomplete]');
      this.cliResizeButton = Selector('[data-test-subj=resize-btn-browser-cli]');
      this.cliCommandExecuted = Selector('[data-testid=cli-command-wrapper]');
      this.cliReadMoreJSONCommandDocumentation = Selector('[id=jsonset]');
      this.cliReadMoreRediSearchCommandDocumentation = Selector('[id=ftexplain]');
      this.commandHelperArea = Selector('[data-testid=command-helper]');
      this.cliEndpoint = Selector('[data-testid^=cli-endpoint]');
      this.cliDbIndex = Selector('[data-testid=cli-db-index]');
  }
  /**
  * Select filter group type
  * @param groupName The group name
  */
  async selectFilterGroupType(groupName: string): Promise<void>{
      await t.click(this.filterGroupTypeButton);
      await t.click(this.filterOptionGroupType.withExactText(groupName));
  }

  /**
   * Add keys from CLI
   * @param keyCommand The command from cli to add key
   * @param amount The amount of the keys
   * @param keyName The name of the keys. The default value is keyName
   */
  async addKeysFromCli(keyCommand: string, amount: number, keyName = 'keyName'): Promise<void>{
      //Open CLI
      await t.click(this.cliExpandButton);
      //Add keys
      const keyValueArray = await common.createArrayWithKeyValueAndKeyname(amount, keyName);
      await t.typeText(this.cliCommandInput, `${keyCommand} ${keyValueArray.join(' ')}`, { paste: true });
      await t.pressKey('enter');
      await t.click(this.cliCollapseButton);
  }

  /**
   * Send command in Cli
   * @param command The command to send
   */
  async sendCommandInCli(command: string): Promise<void>{
      //Open CLI
      await t.click(this.cliExpandButton);
      await t.typeText(this.cliCommandInput, command, { paste: true });
      await t.pressKey('enter');
      await t.click(this.cliCollapseButton);
  }

  /**
   * Get command result execution
   * @param command The command for send in CLI
   */
  async getSuccessCommandResultFromCli(command: string): Promise<string>{
      //Open CLI
      await t.click(this.cliExpandButton);
      //Add keys
      await t.typeText(this.cliCommandInput, command, { paste: true });
      await t.pressKey('enter');
      const commandResult = await this.cliOutputResponseSuccess.innerText;
      await t.click(this.cliCollapseButton);
      return commandResult;
  }

  /**
   * Send command in Cli and wait for total keys after 5 seconds
   * @param command The command to send
   */
  async sendCliCommandAndWaitForTotalKeys(command: string): Promise<string> {
      await this.sendCommandInCli(command);
      //Wait 5 seconds and return total keys
      await t.wait(5000);
      const totalKeys = await browserPage.overviewTotalKeys.innerText;
      return totalKeys;
  }
}
