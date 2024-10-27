import fs from 'fs';
import Handlebars from 'handlebars';

import { emailsDirectory } from '../lib';

const helpers = {
  // Variables
  currentYear: () => new Date().getFullYear(),
};

// Register Partials
Handlebars.registerHelper(helpers);

const partialsDir = `${emailsDirectory}/partials/templates`;
const filenames = fs.readdirSync(partialsDir);

filenames.forEach((filename) => {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) return;
  const name = matches[1];
  const template = fs.readFileSync(`${partialsDir}/${filename}`, 'utf8');
  Handlebars.registerPartial(name, template);
});
