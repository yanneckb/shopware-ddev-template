import customSelect from 'custom-select';
import Plugin from 'src/plugin-system/plugin.class';

/**
 * Wraps native select elements with custom-select library for styled dropdowns.
 * Listens for 'options-updated' event to sync panel when options change dynamically.
 */
export default class CustomSelectPlugin extends Plugin {
    init() {
        this._initCustomSelect();
        this._initValidation();
        this._initFormFieldToggle();
        this._listenForOptionsUpdate();
    }

    _initCustomSelect() {
        [this.instance] = customSelect(this.el);
        if (!this.instance) return;

        this._detectToggleContext();
        this._preventHiding();

        this.instance.select.addEventListener('change', () => {
            this._updateContainerClass();
            this.el.dispatchEvent(
                new Event('changeCustomSelect', { bubbles: true }),
            );
        });

        const panel = this.instance.container.querySelector(
            '.custom-select-panel',
        );
        if (panel) {
            panel.addEventListener(
                'custom-select:focus-outside-panel',
                (e) => e.stopPropagation(),
                true,
            );
        }
    }

    _preventHiding() {
        // Watch for d-none being added to container and remove it immediately
        const container = this.instance.container;

        this._containerObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (
                    mutation.attributeName === 'class' &&
                    container.classList.contains('d-none')
                ) {
                    container.classList.remove('d-none');
                }
            });
        });

        this._containerObserver.observe(container, {
            attributes: true,
            attributeFilter: ['class'],
        });
    }

    _listenForOptionsUpdate() {
        // Listen for custom event dispatched when options are updated
        this.el.addEventListener('options-updated', () => {
            this.syncPanel();
        });

        // Also use MutationObserver as fallback
        if (this.instance) {
            this._observer = new MutationObserver(() => {
                this.syncPanel();
            });
            this._observer.observe(this.el, { childList: true });
        }
    }

    syncPanel() {
        if (!this.instance) return;

        const panel = this.instance.container.querySelector(
            '.custom-select-panel',
        );
        const opener = this.instance.container.querySelector(
            '.custom-select-opener span',
        );
        if (!panel) return;

        panel.innerHTML = '';

        Array.from(this.el.options).forEach((option, index) => {
            const customOption = document.createElement('div');
            customOption.className = 'custom-select-option';
            customOption.dataset.value = option.value;
            customOption.setAttribute('role', 'option');
            customOption.innerText = option.text;

            if (option.selected) customOption.classList.add('is-selected');
            if (option.disabled) customOption.classList.add('is-disabled');

            customOption.addEventListener('click', () => {
                if (option.disabled) return;

                this.el.selectedIndex = index;
                this.el.dispatchEvent(new Event('change', { bubbles: true }));

                if (opener) opener.innerText = option.text;

                panel
                    .querySelectorAll('.custom-select-option')
                    .forEach((opt) => opt.classList.remove('is-selected'));
                customOption.classList.add('is-selected');
                this.instance.container.classList.remove('is-open');
            });

            panel.appendChild(customOption);
        });

        const selectedOption = this.el.options[this.el.selectedIndex];
        if (selectedOption && opener) {
            opener.innerText = selectedOption.text;
        }
    }

    _initValidation() {
        if (!this.instance) return;

        const opener = this.instance.container.querySelector(
            '.custom-select-opener',
        );
        const form = this.el.closest('form');

        this.el.addEventListener('invalid', () =>
            opener?.classList.add('is-invalid'),
        );

        if (form) {
            form.addEventListener('submit', () => {
                if (this.el.checkValidity()) {
                    opener?.classList.remove('is-invalid');
                    opener?.classList.add('is-valid');
                }
            });
        }
    }

    _initFormFieldToggle() {
        this._toggleTargets = [];
        this._toggleInputs = [];

        document
            .querySelectorAll('[data-form-field-toggle-target]')
            .forEach((el) => {
                const targetSelector = el.dataset.formFieldToggleTarget;
                if (targetSelector) {
                    const target = document.querySelector(targetSelector);
                    if (target) this._toggleTargets.push(target);
                }
                this._toggleInputs.push(el);
            });

        const subscribedPlugins = new Set();
        document.querySelectorAll('[data-form-field-toggle]').forEach((el) => {
            if (subscribedPlugins.has(el)) return;

            const plugin = window.PluginManager.getPluginInstanceFromElement(
                el,
                'FormFieldToggle',
            );
            if (plugin) {
                subscribedPlugins.add(el);
                plugin.$emitter.subscribe(
                    'onChange',
                    this._onToggleChange.bind(this),
                );
            }
        });
    }

    _detectToggleContext() {
        if (!this._toggleTargets?.length) return;

        this._toggleTargets.forEach((target, index) => {
            if (target?.contains(this.instance.select)) {
                this._hasToggle = true;
                this._toggleIndex = index;
            }
        });
    }

    _onToggleChange() {
        if (!this._hasToggle || !this.instance) return;

        const toggleInput = this._toggleInputs[this._toggleIndex];
        if (!toggleInput) return;

        if (toggleInput.value.length > 0) {
            this.instance.select.setAttribute('disabled', 'disabled');
            this.instance.disabled = false;
        } else {
            this.instance.select.removeAttribute('disabled');
            this.instance.disabled = true;
        }
    }

    _updateContainerClass() {
        const form = this.el.closest('form');
        if (form) {
            form.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (this.instance.value) {
            this.instance.container.classList.add('has-selection');
        } else {
            this.instance.container.classList.remove('has-selection');
        }
    }
}
