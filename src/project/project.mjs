import { dirname } from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

import fse from 'fs-extra';
import c from 'kleur';
import prompts from 'prompts';
import * as R from 'ramda';
import tf from 'template-file';

import execCmd from '#root/util/execCmd.mjs';
import Msg from '#root/util/Msg.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let _env = '';
let _path = '';
let _name = '';

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
    message: 'What parent folder path do you want to gen?',
  },
  {
    type: 'text',
    name: 'name',
    message: 'What is your project name?',
  },
  {
    type: () => (_env === 'Vite' ? 'select' : null),
    name: 'template',
    message: 'Which template do you choose?',
    initial: 0,
    choices: [
      { title: 'vanilla', value: 'vanilla' },
      { title: 'react', value: 'react' },
      { title: 'react + swc', value: 'react-swc' },
      // { title: 'react ts + swc', value: 'react-swc-ts' },
    ],
  },
  {
    type: () => (_env === 'Vite' ? 'select' : null),
    name: 'withTS',
    message: 'Is the project with using Typescript?',
    initial: 0,
    choices: [
      { title: 'Without ts', value: '' },
      { title: 'With ts', value: '-ts' },
      // { title: 'react ts + swc', value: 'react-swc-ts' },
    ],
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
        `Could you confirm to create project name: ${c
          .yellow()
          .bold(`"${_name}"`)} on path ${c
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
    if (prompt.name === 'name') _name = answer;
  };

  const { path, name, env, template, withTS, confirm } = await prompts(
    questions,
    {
      onCancel,
      onSubmit,
    },
  );
  if (confirm) {
    try {
      Msg.start('point to target folder');
      process.chdir(path);
      Msg.pass('point to target folder');
      if (env === 'Vite') {
        Msg.start('create the project');
        await execCmd(
          `pnpm create vite ${name} --template ${template}${withTS}`,
        );
        process.chdir(`./${name}`);
      }
      if (env === 'Node') {
        await execCmd(`mkdir ${name}`);
        process.chdir(`./${name}`);
        await execCmd('pnpm init');
      }
      Msg.pass('create the project');
      const p = './package.json';
      let pkgStr = await fse.readFileSync(p, { encoding: 'utf-8' });
      if (env === 'Vite') {
        Msg.start('lock packages');
        pkgStr = pkgStr.replace(/\^/g, '');
        await fse.writeFileSync(p, pkgStr);
        Msg.pass('lock packages');
      }
      if (env === 'Node') {
        Msg.start('set importing by alias path & using ES6 in Node');
        const pkg = JSON.parse(pkgStr);
        pkg.main = 'main.mjs';
        pkg.type = 'module';
        pkg.imports = { '#root/*.mjs': './src/*.mjs' };
        await fse.writeFileSync(p, JSON.stringify(pkg, 0, 2));
        await execCmd("echo console.log('node start'); >> main.mjs");
        Msg.pass('set importing by alias path & using ES6 in Node');
      }
      Msg.start('pnpm install');
      // await execCmd('pnpm install');
      if (env === 'Vite') {
        Msg.start('add basic settings');
        const getLib = R.pipe(
          R.split('-'),
          R.pipe(
            R.head,
            R.converge(R.concat, [R.pipe(R.head, R.toUpper), R.tail]),
          ),
        )(template);

        await fse.copySync(`${__dirname}\\gen${env}${getLib}`, './', {
          overwrite: true,
        });
        const opts = {
          bundleType: template.indexOf('swc') >= 0 ? '-swc' : '',
        };
        if (getLib === 'React') {
          const file = await tf.renderFile(`${__dirname}/vite.config.js`, opts);
          await fse.writeFileSync('./vite.config.js', file, {
            overwrite: true,
          });
        }
        Msg.pass('add basic settings');
        Msg.start('add basic packages');
        const pkgs = R.concat(
          getLib === 'React'
            ? [
                'react-router-dom@6.11.2',
                '@emotion/react@11.11.1',
                '@mui/material@5.12.3',
                '@emotion/styled@11.11.0',
                'prop-types@15.8.1',
              ]
            : [],
        )([
          'vite-plugin-svgr@3.2.0', // for svg support
          '@emotion/css@11.11.0',
          'ramda@0.29.1',
          '@emotion/styled@11.13.0',
        ]);

        await execCmd(`pnpm add ${pkgs.join(' ')}`);
        Msg.pass('add basic packages');
      }
      Msg.end();
    } catch (err) {
      console.error(err);
    }
  }
};

runTask();
