import throttle from 'lodash.throttle';

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
	var navigations = [];
	var backdrops = [];
	var buttons = [];
	// var navigationToggles = document.querySelectorAll('.navigation-toggle');

	// for (var i = navigationToggles.length - 1; i >= 0; i--) {
	// 	var nav = new Navigation(navigationToggles[i]);
	// }

	var navigationayy = new NavigationElement('horizontal sticky adaptive', document.querySelector('main'));
	// var navigationayy = new NavigationElement('vertical left adaptive');
	navigationayy.createLogo('/assets/images/datahjelpen_logo.svg');
	var navAyy1 = navigationayy.createMenuItem('Link 1', '#', 'icon fas fa-font', 'parent');
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	navAyy1.createMenuItem('1.1 Headings', '#', null);
	var navAyy2 = navigationayy.createMenuItem('Link 2', '#', null, 'parent');
	navAyy2.createMenuItem('1.1 Headings', '#', null);
	navAyy2.createMenuItem('1.1 Headings', '#', null);
	navAyy2.createMenuItem('1.1 Headings', '#', null);
	var navAyy3 = navigationayy.createMenuItem('Link 3', '#', null, 'parent');
	navAyy3.createMenuItem('1.1 Headings', '#', null);
	navAyy3.createMenuItem('1.1 Headings', '#', null);
	navAyy3.createMenuItem('1.1 Headings', '#', null);

	function NavigationElement(navigationType, appendNavTo) {
		var _this = this;

		this.selector = document.createElement('nav');
		this.selector.classList.add('navigation');
		this.isHorizontal = false; this.isSticky =    false; this.isAdaptive = false;
		this.isResponsive = false; this.isVertical =  false; this.isLeft =     false;
		this.isRight =      false;
		this.hasLogo =      false; this.hasBackdrop = false; this.hasButton =  false;

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
			this.hasLogo = true;

			var logo_ext = logo_source.split('.').pop();

			if (logo_ext == 'png' || logo_ext == 'jpg' || logo_ext == 'jpeg' || logo_ext == 'gif') {
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

			// // Make a backdrop
			// this.backdrop = new Backdrop(this);

			// // Make a button for toggling the nav
			// this.button = new Button(this);

			if (this.isLeft) {
				document.documentElement.classList.add('navigation-vert-left');
			} else if (this.isRight) {
				document.documentElement.classList.add('navigation-vert-right');
			}
		}

		this.toggle = function() {
			if (this.selector.classList.contains('open')) {
				this.selector.classList.remove('open');
			} else {
				this.selector.classList.add('open');
			}
		}

		this.stickyScroll = function stickyScroll() {
			_this.parentScrollTop = this.pageYOffset;

			if (_this.parentScrollTop > _this.lastScrollTop && _this.parentScrollTop > _this.selector.clientHeight) {
				_this.selector.classList.add('navigation-stick-active');
			} else {
				_this.selector.classList.remove('navigation-stick-active');
			}
			_this.lastScrollTop = _this.parentScrollTop;
		}

		if (this.isSticky) {
			this.setupSticky = function() {
				this.lastScrollTop = 0;

				window.addEventListener('scroll', throttle(this.stickyScroll, 500));
			}
		}

		this.resize = function resize() {
			var cs = getComputedStyle(_this.menu_wrapper_selector);

			_this.size = {
				width: _this.menu_wrapper_selector.clientWidth,
				height: _this.menu_wrapper_selector.clientHeight,
				widthScroll: _this.menu_wrapper_selector.scrollWidth,
				heightScroll: _this.menu_wrapper_selector.scrollHeight,
				widthPadding: parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight),
				heightPadding: parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom),
				widthMargin: parseFloat(cs.marginLeft) + parseFloat(cs.marginRight),
				heightMargin: parseFloat(cs.marginTop) + parseFloat(cs.marginBottom),
			}

			var csParent = getComputedStyle(_this.wrapper_selector);
			_this.sizeParent = {
				width: _this.wrapper_selector.clientWidth,
				height: _this.wrapper_selector.clientHeight,
				widthScroll: _this.wrapper_selector.scrollWidth,
				heightScroll: _this.wrapper_selector.scrollHeight,
				widthPadding: parseFloat(csParent.paddingLeft) + parseFloat(csParent.paddingRight),
				heightPadding: parseFloat(csParent.paddingTop) + parseFloat(csParent.paddingBottom),
				widthMargin: parseFloat(csParent.marginLeft) + parseFloat(csParent.marginRight),
				heightMargin: parseFloat(csParent.marginTop) + parseFloat(csParent.marginBottom),
			}


			var sizeMenuNeeds = _this.size.widthScroll;
			var sizeMenuHas = _this.sizeParent.width;
			if (_this.hasLogo) sizeMenuHas -= _this.logo.scrollWidth;

			console.log('sizeMenuNeeds', sizeMenuNeeds);
			console.log('sizeMenuHas', sizeMenuHas);
			console.log('overflow', _this.overflow);

			if (sizeMenuNeeds > sizeMenuHas) {
				if (_this.overflow == null || _this.overflow > _this.overflow) {
					_this.overflow = sizeMenuNeeds;
				}

				// _thisparentNode.insertBefore(newNode, referenceNode);
				// _this.selector.insertBefore(_this.button, _this.menu_wrapper_selector);

				if (_this.isAdaptive) {
					if (!_this.adaptiveTarget.hasButton) {
						console.log('inserting button');

						_this.adaptiveTarget.button = new Button(_this.adaptiveTarget, {
							classList: ['navigation-toggle', 'stay-in-nav'],
							element: 'li'
						});

						_this.menu_wrapper_selector.insertBefore(_this.adaptiveTarget.button.selector, _this.menu_wrapper_selector.lastElementChild);
					}

					console.log('Send items from original to adaptive');

					if (_this.adaptiveTarget.hasButton) {
						_this.adaptiveTarget.button.selector.style.display = '';
					}

					for (var i = _this.menu_wrapper_selector.childNodes.length - 1; i >= 0; i--) {
						if (!_this.menu_wrapper_selector.childNodes[i].classList.contains('stay-in-nav')) {
							_this.adaptiveTarget.menu_wrapper_selector.insertBefore(_this.menu_wrapper_selector.childNodes[i], _this.adaptiveTarget.menu_wrapper_selector.childNodes[0]);
						}
					}
				}
			} else if (_this.overflow <= sizeMenuHas) {
				console.log('Send items from adaptive to original');

				if (_this.adaptiveTarget.hasButton) {
					_this.adaptiveTarget.button.selector.style.display = 'none';
				}

				for (var i = _this.adaptiveTarget.menu_wrapper_selector.childNodes.length - 1; i >= 0; i--) {
					if (!_this.adaptiveTarget.menu_wrapper_selector.childNodes[i].classList.contains('stay-in-nav')) {
						_this.menu_wrapper_selector.insertBefore(_this.adaptiveTarget.menu_wrapper_selector.childNodes[i], _this.menu_wrapper_selector.childNodes[0]);
					}
				}
			}
		}

		if (this.isHorizontal && (this.isAdaptive || this.isResponsive)) {
			window.addEventListener('resize', throttle(this.resize, 500));

			// Find the user defined target, or generate one
			if (this.isAdaptive) {
				var adaptiveTargetSelector = this.selector.getAttribute('adaptive-target');
				if (adaptiveTargetSelector == null) {
					this.adaptiveTarget = new NavigationElement('vertical right', document.querySelector('main'));
				} else {
					this.adaptiveTarget = document.querySelector(adaptiveTargetSelector);
				}
			} else if (this.isResponsive) {
				var responsiveTargetSelector = this.selector.getAttribute('responsive-target');
				if (responsiveTargetSelector == null) {
					this.responsiveTarget = new NavigationElement('vertical right', document.querySelector('main'));
				} else {
					this.responsiveTarget = document.querySelector(responsiveTargetSelector);
				}
			}
		}

		// Append the navigation element to the document
		appendNavTo.appendChild(this.selector);
		if (this.isSticky) this.setupSticky();
		// if (this.isHorizontal && (this.isAdaptive || this.isResponsive)) this.resize();
		if (this.isHorizontal && (this.isAdaptive || this.isResponsive)) {
			setTimeout(function() {
				_this.resize();
			}, 500);
		}

		navigations.push(this);
	}









	function Navigation(toggle) {
		var _this = this;
		this.toggle_selector = toggle;
		this.selector = document.querySelector(this.toggle_selector.getAttribute('target'));

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
	}

	function Backdrop(NavigationElement) {
		NavigationElement.hasBackdrop = true;

		var _this = this;
		this.selector = document.createElement('div');
		this.selector.classList.add('navigation-backdrop');

		this.toggle = function() {
			if (this.selector.classList.contains('open')) {
				this.selector.classList.remove('open');
			} else {
				this.selector.classList.add('open');
			}
		}

		// Setup toggle for clicking the backdrop
		this.selector.addEventListener('click', function() {
			_this.toggle();
			NavigationElement.toggle();
			if (NavigationElement.hasButton) NavigationElement.button.toggle();
		});

		document.body.appendChild(this.selector);
		backdrops.push(this);
	}

	function Button(NavigationElement, options) {
		NavigationElement.hasButton = true;
		if (options === null) var options = {};

		var _this = this;
		if (options.element === null) {
			this.selector = document.createElement('button');
		} else {
			this.selector = document.createElement(options.element);
		}

		if (options.classList === null) {
			this.selector.classList = NavigationElement.selector.classList;
			this.selector.classList.add('navigation-toggle');
			this.selector.classList.add('stay-in-nav');
			this.selector.classList.remove('navigation');
		} else {
			this.selector.classList = (options.classList.join(' '));
			console.log('classes', '\'' + options.classList.join('\', \'') + '\'');
		}

		this.openSelector = document.createElement('span');
		this.openSelector.classList.add('open');
		this.openIconSelector = document.createElement('i');
		this.openIconSelector.classList.add('icon', 'fas', 'fa-bars');
		this.openSelector.appendChild(this.openIconSelector);
		this.selector.appendChild(this.openSelector);

		this.closeSelector = document.createElement('span');
		this.closeSelector.classList.add('close');
		this.closeIconSelector = document.createElement('i');
		this.closeIconSelector.classList.add('icon', 'fas', 'fa-times');
		this.closeSelector.appendChild(this.closeIconSelector);
		this.selector.appendChild(this.closeSelector);

		this.toggle = function() {
			if (this.selector.classList.contains('open')) {
				this.selector.classList.remove('open');
			} else {
				this.selector.classList.add('open');
			}
		}

		// Setup toggle for clicking the button
		this.selector.addEventListener('click', function() {
			_this.toggle();
			NavigationElement.toggle();
			if (NavigationElement.hasBackdrop) NavigationElement.backdrop.toggle();
		});

		document.body.appendChild(this.selector);
		buttons.push(this);
	}

	// console.log(buttons);
	// console.log(backdrops);
	// console.log(navigations);
})();
