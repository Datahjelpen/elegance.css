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
	let navigationToggles = document.querySelectorAll('.navigation-toggle');

	for (var i = navigationToggles.length - 1; i >= 0; i--) {
		setupNav(navigationToggles[i]);
	}

	function setupNav(navToggle) {
		var nav = document.querySelector(navToggle.getAttribute('target'));

		// Setup adaptive horizontal navigation
		if (nav.classList.contains('navigation-hor-adaptive')) {
			setupAdaptiveNav(nav, navToggle, 'adaptive');
		} else if (nav.classList.contains('navigation-hor-responsive')) {
			setupAdaptiveNav(nav, navToggle, 'responsive');
		} else {
			bindNavToggle(nav, navToggle);
		}

		if (nav.classList.contains('navigation-stick-auto')) {
			setupStickAuto(nav, navToggle);
		}
	}

	function bindNavToggle(nav, navToggle) {
		// Create backdrop
		var backdrop = document.createElement('div');
		backdrop.classList.add('navigation-backdrop');
		document.body.appendChild(backdrop);
		backdrop.addEventListener('click', function() {
			toggleNav(nav, backdrop);
		});

		// Setup toggle for button
		navToggle.addEventListener('click', function(e) {
			e.preventDefault();
			toggleNav(nav, backdrop);
		});
	}

	function toggleNav(nav, backdrop) {
		if (nav.classList.contains('open')) {
			nav.classList.remove('open');
			backdrop.classList.remove('open');
		} else {
			nav.classList.add('open');
			backdrop.classList.add('open');
		}
	}

	// Creates a vertical nav for the adaptive/responsive horizontal nav
	function setupAdaptiveNav(nav, navToggle, nav_type) {
		// Find menu
		var menu = nav.querySelector('.navigation-menu');
		var navInnerWrapper = nav.querySelector('.navigation-wrapper-inner');
		var navTarget = nav.getAttribute('target');

		// Figure out weather to send menu items to a generated nav or a user defined element
		if (navTarget != null) {
			var adaptiveNav = document.querySelector(navTarget);
			var adaptiveNavInnerWrapper = adaptiveNav;
		} else {
			// Create elements
			var adaptiveNav = document.createElement('nav');
			adaptiveNav.classList.add('navigation', 'navigation-vert', 'navigation-vert-right');
			var adaptiveNavInnerWrapper = document.createElement('div');
			adaptiveNavInnerWrapper.classList.add('navigation-wrapper-inner');

			if (nav_type == 'responsive') {
				var menuItemsWrapper = document.createElement('ul');
				menuItemsWrapper.classList.add('navigation-menu');
				adaptiveNavInnerWrapper.appendChild(menuItemsWrapper);
			}

			// Append elements to page
			adaptiveNav.appendChild(adaptiveNavInnerWrapper);
			document.body.appendChild(adaptiveNav);
		}

		bindNavToggle(adaptiveNav, navToggle);

		var lastMode = 'horizontal';
		var lastOverflowWidth = 0;

		var delay;
		window.addEventListener('resize', function() {
			clearTimeout(delay);
			delay = setTimeout(sizeChanged, 250);
		});

		// Sends menu items or the entire menu to the correct navigation,
		// depending on the window size and nav size and nav type
		function sizeChanged() {
			// set mode to vertical if we have overflow
			var newMode ;
			if (nav.scrollWidth > nav.clientWidth) {
				lastOverflowWidth = nav.scrollWidth;
				newMode = 'vertical';
			} else {
				newMode = 'horizontal';

				// Stay in vertical, as window is not big enough yet
				if (lastOverflowWidth != 0 && nav.clientWidth <= lastOverflowWidth) {
					newMode = 'vertical';
				}
			}

			if (nav_type == 'responsive') {
				if (newMode == 'vertical') {
					checkResponsiveSize('smaller');
				} else {
					checkResponsiveSize('bigger');
				}
			} else if (nav_type == 'adaptive') {
				if (newMode == 'vertical' && lastMode == 'horizontal') {
					var menuItems = nav.querySelector('.navigation-menu');

					// Send from hor nav to other
					adaptiveNavInnerWrapper.appendChild(menuItems);

					// Show toggle for other
					navToggle.style.display = 'inherit';
				} else if (newMode == 'horizontal' && lastMode == 'vertical') {
					var menuItems = adaptiveNav.querySelector('.navigation-menu');

					// Send from other to hor nav
					navInnerWrapper.appendChild(menuItems);

					// Hide toggle for other
					navToggle.style.display = '';
				}
			}

			lastMode = newMode;
		}

		function checkResponsiveSize(newSize) {
			var menuItems = nav.querySelector('.navigation-menu');
			var newMenuItemsWrapper = adaptiveNavInnerWrapper.querySelector('.navigation-menu');

			if (newSize == 'smaller') {
				// newMenuItemsWrapper.insertBefore(menuItems.lastElementChild, newMenuItemsWrapper.firstElementChild);
				newMenuItemsWrapper.appendChild(menuItems.lastElementChild);
				setTimeout(sizeChanged, 500);
			} else if (newSize == 'bigger') {
				menuItems.appendChild(newMenuItemsWrapper.firstElementChild);
				setTimeout(sizeChanged, 500);
			}
		}

		sizeChanged();
		// delay to make sure the navigation is rendered and we can spot overflow
		setTimeout(sizeChanged, 25);
		setTimeout(sizeChanged, 250);
	}

	function setupStickAuto(nav, navToggle) {
		var navParent = nav.parentNode;
		var navHeight = nav.clientHeight;

		// Trigger update on scroll (with a small delay)
		var delay;
		var lastScrollTop = 0;
		navParent.addEventListener('scroll', function() {
			clearTimeout(delay);
			delay = setTimeout(function() {
				elementScroll(navParent);
			}, 100);
		});

		function elementScroll(scrollElement) {
			var st = scrollElement.scrollTop;
			if (st > navHeight && st > lastScrollTop){
				nav.classList.add('navigation-stick-active');
			} else {
				nav.classList.remove('navigation-stick-active');
			}
			lastScrollTop = st;
		}
	}
})();
