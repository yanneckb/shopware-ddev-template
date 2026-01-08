import CountryStateSelectPlugin from 'src/plugin/forms/form-country-state-select.plugin';

/**
 * Extends Shopware's CountryStateSelectPlugin:
 * - Keeps state select visible even when country has no states
 * - Dispatches event for CustomSelect panel sync
 */
export default class CustomFormCountryStateSelectPlugin extends CountryStateSelectPlugin {
    _updateStateSelect(states, stateRequired, countryStateId) {
        const stateSelect = this.scopeElement.querySelector(
            this.options.countryStateSelectSelector,
        );
        const placeholder = stateSelect.querySelector(
            this.options.countryStatePlaceholderSelector,
        );

        // Remove old options
        this._removeStateOptions(stateSelect);

        // Add new options (without hiding)
        if (states.length === 0) {
            stateSelect.setAttribute('disabled', 'disabled');
        } else {
            states
                .map((option) =>
                    this._createStateOptionEl(option, countryStateId),
                )
                .forEach((option) => stateSelect.append(option));
            stateSelect.removeAttribute('disabled');
        }

        // Handle required state
        if (stateRequired) {
            window.formValidation.setFieldRequired(stateSelect);
            placeholder?.setAttribute('disabled', 'disabled');
        } else {
            window.formValidation.setFieldNotRequired(stateSelect);
            placeholder?.removeAttribute('disabled');
        }

        // Ensure container stays visible
        const container = stateSelect.closest('.custom-select-container');
        container?.classList.remove('d-none');
        stateSelect.parentNode?.classList.remove('d-none');

        // Dispatch event for CustomSelect panel sync
        stateSelect.dispatchEvent(new CustomEvent('options-updated'));
    }
}
