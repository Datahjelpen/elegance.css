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
	}

	var navigationayy = new NavigationElement('horizontal sticky', document.querySelector('main'));
	// var navigationayy = new NavigationElement('vertical left adaptive');
	navigationayy.createLogo('/assets/images/datahjelpen_logo.svg');
	var navAyy1 = navigationayy.createMenuItem('Typography', '#', 'icon fas fa-font', 'parent');
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	var navAyy2 = navigationayy.createMenuItem('Something', '#', null, 'parent');
	navAyy2.createMenuItem('1.1 Headings', '#', null);
	navAyy2.createMenuItem('1.1 Headings', '#', null);
	navAyy2.createMenuItem('1.1 Headings', '#', null);

	function NavigationElement(navigationType, appendNavTo) {
		this.selector = document.createElement('nav');
		this.selector.classList.add('navigation');
		this.isHorizontal = false; this.isSticky =   false; this.isAdaptive = false;
		this.isResponsive = false; this.isVertical = false; this.isLeft =     false;
		this.isRight =      false;

		// Check what type of navigation this is. Give the appropiate classes
		if (navigationType != null) {
			this.classes = navigationType.split(' ');
			if (this.classes.indexOf('horizontal') != -1) {
				this.isHorizontal = true;
				this.selector.classList.add('navigation-hor');

				if (this.classes.indexOf('sticky') != -1) {
					this.isSticky = true;
					this.selector.classList.add('navigation-stick-auto');
				}

				if (this.classes.indexOf('adaptive') != -1) {
					this.isAdaptive = true;
					this.selector.classList.add('navigation-hor-adaptive');
				} else if (this.classes.indexOf('responsive') != -1) {
					this.isResponsive = true;
					this.selector.classList.add('navigation-hor-responsive');
				}
			} else if (this.classes.indexOf('vertical') != -1) {
				this.isVertical = true;
				this.selector.classList.add('navigation-vert');

				if (this.classes.indexOf('left') != -1) {
					this.isLeft = true;
					this.selector.classList.add('navigation-vert-left');
				}

				if (this.classes.indexOf('right') != -1) {
					this.isRight = true;
					this.selector.classList.add('navigation-vert-right');
				}

				if (this.classes.indexOf('adaptive') != -1) {
					this.isAdaptive = true;
					this.selector.classList.add('navigation-vert-adaptive');
				}
			}
		}

		// isHorizontal
		// isAdaptive
		// isResponsive

		// Make an inner wrapper element
		this.wrapper_selector = document.createElement('div');
		this.wrapper_selector.classList.add('navigation-wrapper-inner');
		this.selector.appendChild(this.wrapper_selector);

		// Make n wrapper element for menu items
		this.menu_wrapper_selector = document.createElement('ul');
		this.menu_wrapper_selector.classList.add('navigation-menu');
		this.wrapper_selector.appendChild(this.menu_wrapper_selector);

		// Add a logo to the navigation
		this.createLogo = function(logo_source) {
			var logo_ext = logo_source.split('.').pop();

			if (logo_ext == 'png' || logo_ext == 'jpg' || logo_ext == 'jpeg' || logo_ext == 'gif') {
				var _this = this;
				this.logo = new Image();
				this.logo.src = logo_source;

				this.logo.addEventListener('load', function() {
					console.log(_this.logo.contentDocument);
				});
			} else if (logo_ext == 'svg') {
				var svgObject = document.createElement('object');
				svgObject.setAttribute('data', logo_source);
				svgObject.setAttribute('type', 'image/svg+xml');

				this.logo = svgObject;
			}

			this.logo.classList.add('navigation-logo');
			this.wrapper_selector.insertBefore(this.logo, this.menu_wrapper_selector);
		}

		// Creates menu items.
		this.createMenuItem = function(text, link, icon, type, trigger) {
			var li = document.createElement('li');
			li.classList.add('navigation-menu-item-parent');

			if (link != null) {
				var a = document.createElement('a');
				a.href = link;
				li.appendChild(a);
			}

			if (text != null) {
				var span = document.createElement('span');
				span.appendChild(document.createTextNode(text));
				a.appendChild(span);
			}

			if (icon != null) {
				var i = document.createElement('i');
				i.classList = icon;
				a.insertBefore(i, span);
			}

			// If the element is a parent, setup function for creating child elements
			if (type != null && type == 'parent') {
				var ul = document.createElement('ul');
				ul.classList.add('navigation-menu-item-child');

				// How should we open the child element wrapper
				if (trigger != null) {
					ul.classList.add(trigger);
				} else {
					ul.classList.add('trigger-hover'); // Opens on hover by default
				}

				li.appendChild(ul);
				this.menu_wrapper_selector.appendChild(li);

				li.createMenuItem = function(text, link, icon) {
					var li = document.createElement('li');
					li.classList.add('navigation-menu-item-parent');

					if (link != null) {
						var a = document.createElement('a');
						a.href = link;
						li.appendChild(a);
					}

					if (text != null) {
						var span = document.createElement('span');
						span.appendChild(document.createTextNode(text));
						a.appendChild(span);
					}

					if (icon != null) {
						var i = document.createElement('i');
						i.classList = icon;
						a.insertBefore(i, span);
					}

					ul.appendChild(li);
				}
			}

			return li;
		}

		// Setup the HTML element classes
		if (this.isVertical) {
			document.documentElement.classList.add('navigation-vert');

			if (this.isLeft) {
				document.documentElement.classList.add('navigation-vert-left');
			} else if (this.isRight) {
				document.documentElement.classList.add('navigation-vert-right');
			}
		}

		if (this.isSticky) {
			this.setupSticky = function() {
				var _this = this;
				this.lastScrollTop = 0;
				// this.selector.parentNode.addEventListener('scroll', function(ev) {
				window.addEventListener('scroll', function(ev) {
					clearTimeout(_this.scrollTimeout);

					_this.scrollTimeout = setTimeout(function() {
						_this.parentScrollTop = this.pageYOffset;

						if (_this.parentScrollTop > _this.lastScrollTop && _this.parentScrollTop > _this.selector.clientHeight) {
							_this.selector.classList.add('navigation-stick-active');
						} else {
							_this.selector.classList.remove('navigation-stick-active');
						}
						_this.lastScrollTop = _this.parentScrollTop;
					}, 25);
				});
			}
		}

		// Append the navigatoin element to the document
		appendNavTo.appendChild(this.selector);
		if (this.isSticky) this.setupSticky();
	}









	function Navigation(toggle) {
		var _this = this;
		this.toggle_selector = toggle;
		this.selector = document.querySelector(this.toggle_selector.getAttribute('target'));

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

		// Setup adaptive horizontal navigation
		if (this.selector.classList.contains('navigation-hor-adaptive')) {
			this.setupAdaptiveNav('adaptive');
		} else if (this.selector.classList.contains('navigation-hor-responsive')) {
			this.setupAdaptiveNav('responsive');
		} else {
			this.bindNavToggle();
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
