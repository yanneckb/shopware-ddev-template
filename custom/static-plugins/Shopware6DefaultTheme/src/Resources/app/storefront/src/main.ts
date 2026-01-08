/* eslint-disable */
import CustomSelectPlugin from './plugins/custom-select/custom-select';
import StickyHeaderPlugin from './plugins/header/sticky-header.plugin';

// Config
const { PluginManager } = window as any;

// Register imported JS-plugins
PluginManager.register('CustomSelect', CustomSelectPlugin, 'select.form-select');
PluginManager.register('StickyHeaderPlugin', StickyHeaderPlugin, '.sticky-header');

// Override imported JS-plugins
PluginManager.override(
    'FormCountryStateSelect',
    () =>
        import('./plugins/custom-forms/custom-form-country-state-select.plugin'),
    '[data-form-country-state-select]',
);

/* eslint-enable */
