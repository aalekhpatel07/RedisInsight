import { rte } from '../../../helpers/constants';
import { acceptLicenseTermsAndAddDatabase, deleteDatabase } from '../../../helpers/database';
import { MyRedisDatabasePage, WorkbenchPage } from '../../../pageObjects';
import { commonUrl, ossStandaloneConfig } from '../../../helpers/conf';

const myRedisDatabasePage = new MyRedisDatabasePage();
const workbenchPage = new WorkbenchPage();

fixture `Cypher syntax at Workbench`
    .meta({type: 'critical_path'})
    .page(commonUrl)
    .beforeEach(async t => {
        await acceptLicenseTermsAndAddDatabase(ossStandaloneConfig, ossStandaloneConfig.databaseName);
        //Go to Workbench page
        await t.click(myRedisDatabasePage.workbenchButton);
    })
    .afterEach(async() => {
        //Drop database
        await deleteDatabase(ossStandaloneConfig.databaseName);
    })
test
    .meta({ rte: rte.standalone })
    ('Verify that user can see popover Editor when clicks on “Use Cypher Syntax” popover in the Editor or “Shift+Space”', async t => {
        const command = 'GRAPH.QUERY graph';
        //Type command and put the cursor inside
        await t.typeText(workbenchPage.queryInput, `${command} "query"`, { replace: true });
        await t.pressKey('left');
        //Open popover editor by clicks on “Use Cypher Syntax”
        await t.click(workbenchPage.monacoWidget);
        await t.expect(await workbenchPage.queryInput.nth(1).visible).ok('The user can see opened popover Editor');
        //Close popover editor and re-open by shortcut
        await t.pressKey('esc');
        await t.expect(await workbenchPage.queryInput.nth(1).visible).notOk('The popover Editor is closed');
        await t.pressKey('shift+space');
        await t.expect(await workbenchPage.queryInput.nth(1).visible).ok('The user can see opened popover Editor');
    });
test
    .meta({ rte: rte.standalone })
    ('Verify that popover Editor is populated with the script that was detected between the quotes or it is blank if quotes were empty', async t => {
        const command = 'GRAPH.QUERY graph';
        const script = 'query'
        //Type command with empty script and open popover
        await t.typeText(workbenchPage.queryInput, `${command} ""`, { replace: true });
        await t.pressKey('left');
        await t.click(workbenchPage.monacoWidget);
        //Verify that the Editor is blank
        await t.expect(workbenchPage.scriptsLines.nth(1).textContent).eql('', 'The user can see blank Editor');
        //Close popover editor and re-open with added script
        await t.pressKey('esc');
        await t.typeText(workbenchPage.queryInput, `${command} "${script}`, { replace: true });
        await t.pressKey('left');
        await t.click(workbenchPage.monacoWidget);
        //Verify that the Editor is populated with the script
        await t.expect(workbenchPage.scriptsLines.nth(1).textContent).eql(script, 'The user can see editor populated with the script that was detected between the quotes');
    });
