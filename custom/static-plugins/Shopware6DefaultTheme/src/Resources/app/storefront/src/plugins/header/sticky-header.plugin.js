import Plugin from 'src/plugin-system/plugin.class';

export default class StickyHeaderPlugin extends Plugin {

    init() {
        this.headerMain = document.querySelector('.sticky-header');
        this.isShrunken = false;
        this.scrollThreshold = 100;
        this.hysteresis = 30;
        this.lastScrollY = 0;
        this.isTransitioning = false;
        this.rafId = null;

        this._throttledScrollHandler = this._throttledScroll.bind(this);
        window.addEventListener('scroll', this._throttledScrollHandler, { passive: true });
    }

    _throttledScroll() {
        if (this.rafId) return;
        
        this.rafId = requestAnimationFrame(() => {
            this._onScroll();
            this.rafId = null;
        });
    }

    _onScroll() {
        if (!this.headerMain || this.isTransitioning) return;

        const currentScrollY = window.scrollY;
        
        if (Math.abs(currentScrollY - this.lastScrollY) < 5) return;
        
        const shouldStick = currentScrollY > (this.scrollThreshold + this.hysteresis);
        const shouldUnstick = currentScrollY < (this.scrollThreshold - this.hysteresis);

        if (shouldStick && !this.isShrunken) {
            this._addSticky();
        } else if (shouldUnstick && this.isShrunken) {
            this._removeSticky();
        }

        this.lastScrollY = currentScrollY;
    }

    _addSticky() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.isShrunken = true;
        this.headerMain.classList.add('sticky');

        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    _removeSticky() {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        this.isShrunken = false;
        this.headerMain.classList.remove('sticky');
        setTimeout(() => {
            this.isTransitioning = false;
        }, 300);
    }

    destroy() {
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
        }
        window.removeEventListener('scroll', this._throttledScrollHandler);
    }
}
