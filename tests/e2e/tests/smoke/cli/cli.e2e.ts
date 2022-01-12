import { addNewStandaloneDatabase } from '../../../helpers/database';
import {
    MyRedisDatabasePage,
    BrowserPage,
    UserAgreementPage,
    CliPage,
    AddRedisDatabasePage
} from '../../../pageObjects';
import {
    commonUrl,
    ossStandaloneConfig
} from '../../../helpers/conf';

const myRedisDatabasePage = new MyRedisDatabasePage();
const browserPage = new BrowserPage();
const cliPage = new CliPage();
const userAgreementPage = new UserAgreementPage();
const addRedisDatabasePage = new AddRedisDatabasePage();

const keyName = 'languages';

fixture `CLI`
    .meta({ type: 'smoke' })
    .page(commonUrl)
    .beforeEach(async t => {
        await t.maximizeWindow();
        await userAgreementPage.acceptLicenseTerms();
        await t.expect(addRedisDatabasePage.addDatabaseButton.exists).ok('The add redis database view', {timeout: 20000});
        await addNewStandaloneDatabase(ossStandaloneConfig);
    })
test
    .after(async() => {
        await browserPage.deleteKeyByName(keyName);
    })
    ('Verify that user can add data via CLI', async t => {
        await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
        //Open CLI
        await t.click(cliPage.cliExpandButton);
        //Add key from CLI
        await t.typeText(cliPage.cliCommandInput, `SADD ${keyName} "chinese" "japanese" "german"`);
        await t.pressKey('enter');
        //Check that the key is added
        await browserPage.searchByKeyName(keyName);
        const isKeyIsDisplayedInTheList = await browserPage.isKeyIsDisplayedInTheList(keyName);
        await t.expect(isKeyIsDisplayedInTheList).ok('The key is added');
    });
test('Verify that user can expand CLI', async t => {
    await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
    //Open CLI
    await t.click(cliPage.cliExpandButton);
    //Check that CLI is opened
    await t.expect(cliPage.cliArea.exists).ok('CLI area is displayed');
    await t.expect(cliPage.cliCommandInput.exists).ok('CLI input is displayed')
});
test('Verify that user can collapse CLI', async t => {
    await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
    //Open CLI
    await t.click(cliPage.cliExpandButton);
    //Check that CLI is opened
    await t.expect(cliPage.cliArea.visible).ok('CLI area is displayed');
    //Collaple CLI
    await t.click(cliPage.cliCollapseButton);
    //Check that CLI is closed
    await t.expect(cliPage.cliArea.visible).notOk('CLI area should not be displayed');
});
test('Verify that user can use blocking command', async t => {
    await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
    //Open CLI
    await t.click(cliPage.cliExpandButton);
    //Type blocking command
    await t.typeText(cliPage.cliCommandInput, 'blpop newKey 10000');
    await t.pressKey('enter');
    //Verify that user input is blocked
    await t.expect(cliPage.cliCommandInput.exists).notOk('Cli input is not shown');
});
//skipped due the Multi-window mode is supported in Chrome, Chromium, Edge 84+ and Firefox only
test.skip('Verify that user can use unblocking command', async t => {
    await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
    //Open CLI
    await t.click(cliPage.cliExpandButton);
    //Get clientId
    await t.typeText(cliPage.cliCommandInput, 'client id');
    await t.pressKey('enter');
    const clientId = (await cliPage.cliOutputResponseSuccess.textContent).replace(/^\D+/g, '');
    //Type blocking command
    await t.typeText(cliPage.cliCommandInput, 'blpop newKey 10000');
    await t.pressKey('enter');
    //Verify that user input is blocked
    await t.expect(cliPage.cliCommandInput.exists).notOk('Cli input is not shown');
    //Create new window to unblock the client
    await t
        .openWindow(commonUrl)
        .maximizeWindow();
    await myRedisDatabasePage.clickOnDBByName(ossStandaloneConfig.databaseName);
    //Open CLI
    await t.click(cliPage.cliExpandButton);
    //Unblock client
    await t.typeText(cliPage.cliCommandInput, `client unblock ${clientId}`);
    await t.pressKey('enter');
    await t.closeWindow();
    await t.expect(cliPage.cliCommandInput.exists).ok('Cli input is shown, the client was unblocked', { timeout: 20000 });
});
