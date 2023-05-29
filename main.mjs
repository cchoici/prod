import prompts from 'prompts';

import execCmd from '#root/util/execCmd.mjs';
import Msg from '#root/util/Msg.mjs';

const SELECT = {
  REACT: 'react/component',
  LINT: 'lint',
  DOCKER: 'docker',
  CHECK: 'check',
  PROJECT: 'project',
};

const questions = [
  {
    type: 'select',
    name: 'task',
    message: 'What do you want?',
    initial: 0,
    choices: [
      { title: 'Create react component template', value: SELECT.REACT },
      { title: 'Docker enabled in project', value: SELECT.DOCKER },
      { title: 'Check staged files before commit', value: SELECT.CHECK },
      { title: 'Add lint in project', value: SELECT.LINT },
      { title: 'Create new project', value: SELECT.PROJECT },
      { title: 'Do nothing', value: '' },
    ],
  },
];

const runTask = async () => {
  const onCancel = () => true;

  Msg.notice(
    'prerequisites: code ES6, ts not supported & based on vscode editor',
  );
  const { task } = await prompts(questions, { onCancel });
  // const type = task.split("/")[0];
  let command = '';
  switch (task) {
    case SELECT.REACT:
      command = 'node src/compTPL/react.mjs';
      break;
    case SELECT.CHECK:
      command = 'node src/check-staged/check-staged.mjs';
      break;
    case SELECT.LINT:
      command = 'node src/lintTPL/lint.mjs';
      break;
    case SELECT.PROJECT:
      command = 'node src/project/project.mjs';
      break;
    default:
      command = 'node src/test/test.mjs';
  }
  await execCmd(command);
};

runTask();
