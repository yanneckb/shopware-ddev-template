/* eslint-disable */

module.exports = {
    '*.js': (filenames) => [
        `prettier --config prettier.config.js --write ${filenames.join(' ')}`,
        `eslint --config eslint.config.js --fix ${filenames.join(' ')}`,
    ],
    '*.ts': (filenames) => [
        `prettier --config prettier.config.js --write ${filenames.join(' ')}`,
        `eslint --config eslint.config.js --fix ${filenames.join(' ')}`,
    ],
    '*.scss': (filenames) => [
        `prettier --config prettier.config.js --write ${filenames.join(' ')}`,
        `stylelint --config stylelint.config.js --fix ${filenames.join(' ')}`,
    ],
};
