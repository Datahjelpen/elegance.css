(function() {
	// Create the devicecheck element
	var div = document.createElement('div');
	div.setAttribute('id', 'devicecheck');
	document.body.appendChild(div);

	// Trigger update on resize
	var delay;
	window.addEventListener('resize', function() {
		clearTimeout(delay);
		delay = setTimeout(window_is_sizeUpdate, 500);
	});

	window_is_sizeUpdate(); // Init

	// Update variables
	function window_is_sizeUpdate() {
		var devicecheck = window.getComputedStyle(document.getElementById("devicecheck")).getPropertyValue("content");

		window.is_desktop = false;
		window.is_tablet =  false;
		window.is_mobile =  false;

		if (devicecheck == "\"desktop\"" || devicecheck == "desktop") window.is_desktop = true;
		if (devicecheck == "\"tablet\""  || devicecheck == "tablet") window.is_tablet =   true;
		if (devicecheck == "\"mobile\""  || devicecheck == "mobile") window.is_mobile =   true;
	};
})();

// Open and close adaptive/responsive navigations
(function() {
	var navs = [];
	var backdrops = [];
	var navigationToggles = document.querySelectorAll('.navigation-toggle');

	for (var i = navigationToggles.length - 1; i >= 0; i--) {
		var nav = new Navigation(navigationToggles[i]);
		var navClassList = nav.selector.classList;

		// Setup adaptive horizontal navigation
		if (navClassList.contains('navigation-hor-adaptive')) {
			nav.setupAdaptiveNav('adaptive');
		} else if (navClassList.contains('navigation-hor-responsive')) {
			nav.setupAdaptiveNav('responsive');
		} else {
			nav.bindNavToggle();
		}

		if (navClassList.contains('navigation-stick-auto')) nav.setupSticky();
	}

	function Navigation(toggle) {
		var _this = this;
		this.toggle_selector = toggle;
		this.selector = document.querySelector(this.toggle_selector.getAttribute('target'));

		this.setupSticky = function() {
			this.selector.parentNode = this.selector.parentNode;

			// Trigger update on scroll (with a small delay)
			this.lastScrollTop = 0;
			this.selector.parentNode.addEventListener('scroll', function() {
				clearTimeout(_this.scrollTimeout);
				_this.scrollTimeout = setTimeout(function() {
					_this.parentScrollTop = _this.selector.parentNode.scrollTop;

					if (_this.parentScrollTop > _this.selector.clientHeight && _this.parentScrollTop > _this.lastScrollTop) {
						_this.selector.classList.add('navigation-stick-active');
					} else {
						_this.selector.classList.remove('navigation-stick-active');
					}
					_this.lastScrollTop = _this.parentScrollTop;
				}, 100);
			});
		}

		this.toggleNav = function() {
			if (this.selector.classList.contains('open')) {
				this.selector.classList.remove('open');
				this.backdrop.selector.classList.remove('open');
			} else {
				this.selector.classList.add('open');
				this.backdrop.selector.classList.add('open');
			}
		}

		this.bindNavToggle = function() {
			this.backdrop = new Backdrop(this);

			// Setup toggle for button
			this.toggle_selector.addEventListener('click', function(e) {
				e.preventDefault();
				_this.toggleNav();
			});
		}

		// Creates a vertical nav for the adaptive/responsive horizontal nav
		this.setupAdaptiveNav = function(nav_type) {
			this.nav_type = nav_type;
			// Find menu
			this.menu = this.selector.querySelector('.navigation-menu');
			this.navInnerWrapper = this.selector.querySelector('.navigation-wrapper-inner');
			this.navTarget = this.selector.getAttribute('target');

			// Figure out weather to send menu items to a generated nav or a user defined element
			if (this.navTarget != null) {
				this.adaptiveNav = document.querySelector(this.navTarget);
				this.adaptiveNavInnerWrapper = this.adaptiveNav;
			} else {
				// Create elements
				this.adaptiveNav = document.createElement('nav');
				this.adaptiveNav.classList.add('navigation', 'navigation-vert', 'navigation-vert-right');
				this.adaptiveNavInnerWrapper = document.createElement('div');
				this.adaptiveNavInnerWrapper.classList.add('navigation-wrapper-inner');

				if (this.nav_type == 'responsive') {
					this.menuItemsWrapper = document.createElement('ul');
					this.menuItemsWrapper.classList.add('navigation-menu');
					this.adaptiveNavInnerWrapper.appendChild(this.menuItemsWrapper);
				}

				// Append elements to page
				this.adaptiveNav.appendChild(this.adaptiveNavInnerWrapper);
				document.body.appendChild(this.adaptiveNav);
			}

			// bindNavToggle(adaptiveNav, this.toggle_selector);

			this.lastMode = 'horizontal';
			this.lastOverflowWidth = 0;

			window.addEventListener('resize', function() {
				clearTimeout(_this.resizeTimeout);
				_this.resizeTimeout = setTimeout(_this.sizeChanged, 250);
			});

			// Sends menu items or the entire menu to the correct navigation,
			// depending on the window size and nav size and nav type
			this.sizeChanged = function() {
				// set mode to vertical if we have overflow
				if (_this.selector.scrollWidth > _this.selector.clientWidth) {
					_this.lastOverflowWidth = _this.selector.scrollWidth;
					_this.newMode = 'vertical';
				} else {
					_this.newMode = 'horizontal';

					// Stay in vertical, as window is not big enough yet
					if (_this.lastOverflowWidth != 0 && _this.selector.clientWidth <= _this.lastOverflowWidth) {
						_this.newMode = 'vertical';
					}
				}

				if (_this.nav_type == 'responsive') {
					if (_this.newMode == 'vertical') {
						_this.checkResponsiveSize('smaller');
					} else {
						_this.checkResponsiveSize('bigger');
					}
				} else if (_this.nav_type == 'adaptive') {
					if (_this.newMode == 'vertical' && _this.lastMode == 'horizontal') {
						_this.menuItems = _this.selector.querySelector('.navigation-menu');

						// Send from hor nav to other
						_this.adaptiveNavInnerWrapper.appendChild(_this.menuItems);

						// Show toggle for other
						_this.toggle_selector.style.display = 'inherit';
					} else if (_this.newMode == 'horizontal' && _this.lastMode == 'vertical') {
						_this.menuItems = adaptiveNav.querySelector('.navigation-menu');

						// Send from other to hor nav
						_this.navInnerWrapper.appendChild(_this.menuItems);

						// Hide toggle for other
						_this.toggle_selector.style.display = '';
					}
				}

				_this.lastMode = _this.newMode;
			}

			this.checkResponsiveSize = function(newSize) {
				this.newSize = newSize;
				this.menuItems = this.selector.querySelector('.navigation-menu');
				this.newMenuItemsWrapper = this.adaptiveNavInnerWrapper.querySelector('.navigation-menu');

				if (this.newSize == 'smaller') {
					// newMenuItemsWrapper.insertBefore(menuItems.lastElementChild, newMenuItemsWrapper.firstElementChild);
					if (this.menuItems.lastElementChild != null) {
						this.newMenuItemsWrapper.appendChild(this.menuItems.lastElementChild);
					}
					// setTimeout(sizeChanged, 500);
				} else if (this.newSize == 'bigger') {
					if (this.newMenuItemsWrapper.firstElementChild != null) {
						this.menuItems.appendChild(this.newMenuItemsWrapper.firstElementChild);
						// setTimeout(sizeChanged, 500);
					}
				}
			}

			this.sizeChanged();
			// delay to make sure the navigation is rendered and we can spot overflow
			setTimeout(_this.sizeChanged, 25);
			setTimeout(_this.sizeChanged, 250);
		}

		navs.push(this);
	}

	function Backdrop(navigation) {
		this.navigation = navigation;
		this.selector = document.createElement('div');
		this.selector.classList.add('navigation-backdrop');
		document.body.appendChild(this.selector);

		// Setup toggle for clicking the backdrop
		this.selector.addEventListener('click', function() {
			navigation.toggleNav();
		});

		backdrops.push(this);
	}

	console.log(backdrops);
	console.log(navs);
})();
