import { dirname } from 'path';
import { fileURLToPath } from 'url';

import fse from 'fs-extra';
import prompts from 'prompts';
import tf from 'template-file';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let comp = '';

const questions = [
  {
    type: 'text',
    name: 'compName',
    message: 'What is the name of Component?',
  },
  {
    type: 'toggle',
    name: 'confirm',
    message: 'Can you confirm?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
    onRender(kleur) {
      this.msg = kleur.green(`Can you confirm gen component name "${comp}"?`);
    },
  },
];

const runTask = async () => {
  const onCancel = () => true;

  const onSubmit = async (prompt, answer) => {
    if (typeof answer === 'string') comp = answer;
  };

  const { compName, confirm } = await prompts(questions, {
    onCancel,
    onSubmit,
  });
  if (confirm) {
    await tf.renderToFolder(`${__dirname}/gen/*`, `./output/`, {
      compName,
    });
    await fse.renameSync(`./output/template.jsx`, `./output/${compName}.jsx`);
    console.log('Success!');
  }
};

runTask();
