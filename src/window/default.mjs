import { dirname } from 'path';
import { fileURLToPath } from 'url';

import execCmd from '#root/util/execCmd.mjs';
import Msg from '#root/util/Msg.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const exeFolder = 'D:\\softs\\SetDefaultBrowser';

const MapBrowser = new Map([
  ['CHROME', 'chrome'],
  ['EDGE', 'edge'],
]);

const runTask = async () => {
  Msg.start('1. change to default Goolge Browser');
  Msg.notice('prerequisites: SetDefaultBrowser Tool needed');
  Msg.alert(`location: ${exeFolder}`);
  Msg.notice(
    'Check: https://kolbi.cz/blog/2017/11/10/setdefaultbrowser-set-the-default-browser-per-user-on-windows-10-and-server-2016-build-1607/',
  );
  Msg.start('point to SetDefaultBrowser folder');
  process.chdir(exeFolder);
  Msg.pass('point to SetDefaultBrowser folder');
  Msg.start('change to Google Chrome');
  await execCmd(`SetDefaultBrowser.exe ${MapBrowser.get('CHROME')}`);
  Msg.pass('change to Google Chrome');
  Msg.end('1. change to default Goolge Browser');

  Msg.start('2. change Windows 10 theme');
  await execCmd(`Invoke-Expression ${__dirname}\\theme.deskthemepack`, {
    shell: 'powershell.exe',
  });
  Msg.end('2. change Windows 10 theme');
  Msg.end();
};

runTask();
