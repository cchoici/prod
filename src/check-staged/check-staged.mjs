import { dirname } from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

import fse from 'fs-extra';
import c from 'kleur';
import prompts from 'prompts';

import execCmd from '#root/util/execCmd.mjs';
import Msg from '#root/util/Msg.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let _path = '';

const questions = [
  {
    type: 'text',
    name: 'path',
    message: 'Waht project path do you want to gen?',
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
        `Could you confirm to check staged files before commit it on path ${c
          .yellow()
          .bold(`"${_path}"`)}?`,
      );
    },
  },
];

const runTask = async () => {
  const onCancel = () => true;

  const onSubmit = async (prompt, answer) => {
    if (prompt.name === 'path') _path = answer;
    if (prompt.name === 'name') _name = answer;
  };
  Msg.alert(
    'Prerequisites: eslint & prettier pkgs installed & under git control repo',
  );
  const { path, confirm } = await prompts(questions, {
    onCancel,
    onSubmit,
  });
  if (confirm) {
    try {
      Msg.start('point to target folder');
      process.chdir(path);
      Msg.pass('point to target folder');

      Msg.start('add lint-staged & husky pkgs');
      await execCmd('pnpm add husky lint-staged -E -D');
      Msg.pass('add husky & lint-staged pkgs');
      Msg.start('set lint-staged & husky setting');
      await fse.copySync(`${__dirname}\\gen`, path, { overwrite: true });
      await execCmd('pnpm pkg set scripts.pre-commit="lint-staged');
      await execCmd('npx husky install');
      await execCmd('npx husky add .husky/pre-commit "pnpm pre-commit"');
      await execCmd('git add .husky/pre-commit');
      Msg.pass('sset lint-staged & husky setting');
      Msg.end();
    } catch (err) {
      console.error(err);
    }
  }
};

runTask();
