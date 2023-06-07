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
let _imageName = '';
let _cntrName = '';

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
    message: 'Waht project path do you want to gen?',
  },
  {
    type: 'text',
    name: 'imageName',
    message: 'Waht name of docker image(<ImageName:Tag>)?',
  },
  {
    type: 'text',
    name: 'cntrName',
    message: 'Waht name of docker image(<ImageName:Tag>)?',
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
        `Could you confirm to gen image name with tag: ${c
          .yellow()
          .bold(`"${_imageName}"`)} & container name: ${c
          .yellow()
          .bold(`"${_cntrName}"`)} on path ${c.yellow().bold(`"${_path}"`)}?`,
      );
    },
  },
];

const runTask = async () => {
  const onCancel = () => true;

  const onSubmit = async (prompt, answer) => {
    if (prompt.name === 'path') _path = answer;
    if (prompt.name === 'imageName') _imageName = answer;
    if (prompt.name === 'cntrName') _cntrName = answer;
  };
  Msg.alert('Prerequisites: ');
  const { env, path, imageName, cntrName, confirm } = await prompts(questions, {
    onCancel,
    onSubmit,
  });
  if (confirm && imageName && cntrName) {
    try {
      Msg.start('point to target folder');
      process.chdir(path);
      Msg.pass('point to target folder');

      Msg.start('set docker settings');
      await fse.copySync(`${__dirname}\\gen${env}`, path, { overwrite: true });
      await execCmd(
        `pnpm pkg set scripts.build:image="docker build . -f local.Dockerfile -t ${imageName}"`,
      );
      await execCmd(
        `pnpm pkg set scripts.run:cntr="docker run -d --name ${cntrName} -p 3311:80 ${imageName}"`,
      );

      Msg.pass('set docker settings');
      Msg.end();
    } catch (err) {
      console.error(err);
    }
  }
};

runTask();
