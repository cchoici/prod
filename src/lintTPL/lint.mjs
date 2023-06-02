import { dirname } from 'path';
import { fileURLToPath } from 'url';

import fse from 'fs-extra';
import c from 'kleur';
import prompts from 'prompts';

import execCmd from '#root/util/execCmd.mjs';
import Msg from '#root/util/Msg.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let _env = '';
let _path = '';

const questions = [
  {
    type: 'select',
    name: 'env',
    message: 'Which env to run on?',
    initial: 0,
    choices: [
      { title: 'Run in Vite on browser', value: 'Vite' },
      { title: 'Run in Node.js', value: 'Node' },
    ],
  },
  {
    type: 'text',
    name: 'path',
    message: 'What is the root of project?',
  },
  {
    type: 'toggle',
    name: 'confirm',
    message: '',
    initial: true,
    active: 'Yes',
    inactive: 'No',
    onRender() {
      this.msg = c.cyan(
        `Could you confirm to gen on path ${c
          .yellow()
          .bold(`"${_path}"`)} in running ${c.yellow().bold(`"${_env}"`)}?`,
      );
    },
  },
];

const runTask = async () => {
  const onCancel = () => true;

  const onSubmit = async (prompt, answer) => {
    if (prompt.name === 'env') _env = answer;
    if (prompt.name === 'path') _path = answer;
  };

  const { env, path, confirm } = await prompts(questions, {
    onCancel,
    onSubmit,
  });
  if (confirm) {
    try {
      Msg.start('point to project root');
      process.chdir(path);
      Msg.pass('point to project root');
      Msg.start('add lint pkgs...');

      const pkgs = [
        'prettier@2.8.8',
        'eslint-config-prettier@8.8.0',
        'eslint-plugin-prettier@4.2.1',
        'eslint-plugin-import@2.27.5', // for order import
        'eslint-import-resolver-custom-alias@1.3.2', // for alias to eslint-plugin-import
      ];
      if (env === 'Node') {
        pkgs.push(
          'eslint@8.41.0',
          // 'eslint-config-airbnb-base@15.0.0', // from eslint added
        );
      }
      await execCmd(`pnpm add ${pkgs.join(' ')} -D`);
      Msg.pass('add lint pkgs...');
      Msg.start('copy infra files');
      await fse.copySync(`${__dirname}\\gen${env}`, path, { overwrite: true });
      Msg.pass('copy infra files');
      if (env === 'Vite') {
        Msg.start('remove default .eslintrc');
        execCmd('rm -rf .eslintrc.mjs .eslintrc.cjs .eslintrc.json');
        Msg.pass('remove default .eslintrc');
      }
      Msg.end();
      Msg.notice(
        'make sure this project under vscode worksapce root folder for auto fixing workable in vscode!!',
      );
    } catch (err) {
      Msg.error(err);
    }
  }
};

runTask();

// "scripts": {
//   "dev": "vite",
//   "build": "vite build",
//   "preview": "vite preview",
//   "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
//   "build:image": "docker build . -f local.Dockerfile -t sie-web",
//   "run:cntr": "docker run -d --name sie -p 3311:80 sie-web"
// },
