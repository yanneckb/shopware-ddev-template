/* eslint-disable */
import CustomSelectPlugin from './plugins/custom-select/custom-select';
import StickyHeaderPlugin from './plugins/header/sticky-header.plugin';

// Config
const { PluginManager } = window as any;

/* Plugin registrations */
PluginManager.register('CustomSelect', CustomSelectPlugin, 'select.form-select');
PluginManager.register('StickyHeaderPlugin', StickyHeaderPlugin, '.sticky-header');

/* Plugin overrides */


/* Plugin extensions */
PluginManager.extend(
    'CountryStateSelect',
    'CountryStateSelect',
    () => import('./plugin/forms/custom-form-country-state-select.plugin'),
    '[data-country-state-select]'
);

/* eslint-enable */
