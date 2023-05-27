import childProcess from 'child_process';

import Msg from '#root/util/Msg.mjs';

const execCmd = async cmd => {
  const resp = await childProcess.execSync(cmd, { stdio: 'inherit' });
  if (resp?.stderr) {
    Msg.error(resp.stderr);
  }
};

export default execCmd;
