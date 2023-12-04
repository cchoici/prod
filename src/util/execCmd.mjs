import childProcess from 'child_process';

import Msg from '#root/util/Msg.mjs';

const execCmd = async (cmd, opts = { stdio: 'inherit' }) => {
  const resp = await childProcess.execSync(cmd, opts);
  if (resp?.stderr) {
    Msg.error(resp.stderr);
  }
};

export default execCmd;
