import CountryStateSelectPlugin from 'src/plugin/forms/form-country-state-select.plugin';

export default class CustomFormCountryStateSelectPlugin extends CountryStateSelectPlugin {
    init() {
        super.init();
        this._ensureStateSelectVisible();
    }

    _addStateOptions(states, countryStateId, countryStateSelect) {
        let stateSelect = countryStateSelect;

        if (!countryStateSelect) {
            stateSelect = this.scopeElement.querySelector(this.options.countryStateSelectSelector);
        }

        if (states.length === 0) {
            stateSelect.setAttribute('disabled', 'disabled');
        } else {
            states.map(option => this._createStateOptionEl(option, countryStateId))
                .forEach((option) => {
                    stateSelect.append(option);
                });
            stateSelect.removeAttribute('disabled');
        }

        this._ensureStateSelectVisible();
        stateSelect.dispatchEvent(new CustomEvent('options-updated'));
    }

    _ensureStateSelectVisible() {
        const stateSelect = this.scopeElement.querySelector(this.options.countryStateSelectSelector);
        if (!stateSelect) return;

        // Remove d-none from all parent containers
        const formGroup = stateSelect.closest('.form-group');
        formGroup?.classList.remove('d-none');

        const customSelectContainer = stateSelect.closest('.custom-select-container');
        customSelectContainer?.classList.remove('d-none');

        stateSelect.parentNode?.classList.remove('d-none');

        // Initialize CustomSelect if not already done
        if (!window.PluginManager.getPluginInstanceFromElement(stateSelect, 'CustomSelect')) {
            window.PluginManager.initializePlugin('CustomSelect', stateSelect);
        }
    }
}
