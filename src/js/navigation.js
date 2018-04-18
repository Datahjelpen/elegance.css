import throttle from 'lodash.throttle';

// Open and close adaptive/responsive navigations
var navigations = [];
var backdrops = [];
var buttons = [];
// var navigationToggles = document.querySelectorAll('.navigation-toggle');

// for (var i = navigationToggles.length - 1; i >= 0; i--) {
// 	var nav = new Navigation(navigationToggles[i]);
// }

export function NavigationElement(options) {
	var _this = this;

	this.selector = document.createElement('nav');
	this.selector.classList.add('navigation');
	this.isHorizontal = false; this.isSticky =          false; this.isAdaptive = false;
	this.isResponsive = false; this.isVertical =        false; this.isLeft =     false;
	this.isRight =      false; this.isScrollChange =    false;
	this.hasLogo =      false; this.hasBackdrop =       false; this.hasButton =  false;
	this.itemsCount =       0; this.itemsCountOriginal = null; this.overflows =     [];

	if (options == null)
		options = {};

	if (options.appendTo == null)
		options.appendTo = document.body;

	if (options.classList == null)
		options.classList = ['horizontal', 'adaptive'];

	// Check what type of navigation this is. Give the appropiate classes
	if (options.classList.indexOf('horizontal') != -1) {
		this.isHorizontal = true;
		this.selector.classList.add('navigation-hor');

		if (options.classList.indexOf('sticky') != -1) {
			this.isSticky = true;
			this.selector.classList.add('navigation-stick-auto');
		}

		if (options.classList.indexOf('adaptive') != -1) {
			this.isAdaptive = true;
			this.selector.classList.add('navigation-hor-adaptive');
		} else if (options.classList.indexOf('responsive') != -1) {
			this.isResponsive = true;
			this.selector.classList.add('navigation-hor-responsive');
		}
	} else if (options.classList.indexOf('vertical') != -1) {
		this.isVertical = true;
		this.selector.classList.add('navigation-vert');

		if (options.classList.indexOf('left') != -1) {
			this.isLeft = true;
			this.selector.classList.add('navigation-vert-left');
		}

		if (options.classList.indexOf('right') != -1) {
			this.isRight = true;
			this.selector.classList.add('navigation-vert-right');
		}

		if (options.classList.indexOf('adaptive') != -1) {
			this.isAdaptive = true;
			this.selector.classList.add('navigation-vert-adaptive');
		}
	}

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

		this.itemsCount++;
		return li;
	}

	this.toggle = function() {
		if (this.selector.classList.contains('open')) {
			this.selector.classList.remove('open');
		} else {
			this.selector.classList.add('open');
		}
	}

	this.scroll = function(options) {
		_this.parentScrollTop = window.pageYOffset;

		_this.stickyScroll(options.sticky);
		_this.scrollChange(options.scrollChange);

		_this.lastScrollTop = _this.parentScrollTop;
	}

	this.setupScroll = function(options) {
		this.lastScrollTop = 0;

		if (this.isScrollChange) {
			for (var i = 0; i < options.scrollChange.points.length; i++) {
				options.scrollChange.points[i] = document.querySelector('#' + options.scrollChange.points[i]);
			}
		}

		window.addEventListener('scroll', throttle(function() {
			_this.scroll(options);
		}, 500));
	}

	this.stickyScroll = function(options) {
		if (options.hide) {
			if (_this.parentScrollTop > _this.lastScrollTop && _this.parentScrollTop > _this.selector.clientHeight) {
					_this.selector.classList.add('navigation-stick-active');
			} else {
				_this.selector.classList.remove('navigation-stick-active');
			}
		}
	}

	this.scrollChange = function(options) {
		for (var i = 0; i < options.points.length; i++) {
			if (_this.parentScrollTop >= options.points[i].offsetTop) {
				if (options.activeClass != options.classList[i]) {
					options.activeClass = options.classList[i];
				} else {
					_this.selector.classList.remove(options.classList[i]);
				}
			}

			if (_this.parentScrollTop < options.points[i].offsetTop) {
				if (options.activeClass == options.classList[i])
					options.activeClass = '';

				_this.selector.classList.remove(options.classList[i]);
			}
		}

		if (options.activeClass.length > 0)
			_this.selector.classList.add(options.activeClass);
	}

	this.updateSizeInfo = function() {
		var cs = getComputedStyle(_this.menu_wrapper_selector);

		_this.sizeMenuWrapper = {
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
		_this.sizeWrapper = {
			width: _this.wrapper_selector.clientWidth,
			height: _this.wrapper_selector.clientHeight,
			widthScroll: _this.wrapper_selector.scrollWidth,
			heightScroll: _this.wrapper_selector.scrollHeight,
			widthPadding: parseFloat(csParent.paddingLeft) + parseFloat(csParent.paddingRight),
			heightPadding: parseFloat(csParent.paddingTop) + parseFloat(csParent.paddingBottom),
			widthMargin: parseFloat(csParent.marginLeft) + parseFloat(csParent.marginRight),
			heightMargin: parseFloat(csParent.marginTop) + parseFloat(csParent.marginBottom),
		}

		_this.sizeMenuNeeds = _this.sizeMenuWrapper.widthScroll;
		_this.sizeMenuHas = _this.sizeWrapper.width;
		if (_this.hasLogo) _this.sizeMenuHas -= _this.logo.scrollWidth;
	}

	// Will automatically transfer menu items depending on whether or not the nav is adaptive or responsive
	this.resize = function() {
		// To keep track of how many items our nav has before any transfers happen
		if (_this.itemsCountOriginal == null) _this.itemsCountOriginal = _this.itemsCount;

		_this.updateSizeInfo();

		// Menu is too big, transfer items
		if (_this.sizeMenuNeeds > _this.sizeMenuHas && _this.itemsCount != 0) {
			if (_this.overflows[_this.itemsCount] == null || _this.sizeMenuNeeds > _this.overflows[_this.itemsCount]) {
				_this.overflows[_this.itemsCount] = _this.sizeMenuNeeds;
			}

			if (_this.isAdaptive) {
				if (!_this.adaptiveTarget.hasButton) {
					// Make button for the adaptive target
					_this.button = new Button(_this.adaptiveTarget, {
						classList: ['navigation-toggle', 'stay-in-nav'],
						element: 'li'
					});

					_this.adaptiveTarget.button = new Button(_this.adaptiveTarget, {
						classList: ['navigation-toggle', 'stay-in-nav'],
						element: 'li'
					});

					// Insert the button
					_this.menu_wrapper_selector.insertBefore(_this.button.selector, _this.menu_wrapper_selector.lastElementChild);
					_this.adaptiveTarget.menu_wrapper_selector.insertBefore(_this.adaptiveTarget.button.selector, _this.adaptiveTarget.menu_wrapper_selector.lastElementChild);
				}

				if (!_this.adaptiveTarget.hasBackdrop) {
					// Make backdrop for the adaptive target
					_this.adaptiveTarget.backdrop = new Backdrop(_this.adaptiveTarget);
				}

				// Show button and send items from original to adaptive
				_this.itemsCount = 0;
				_this.adaptiveTarget.itemsCount = _this.itemsCountOriginal;
				if (_this.itemsCountOriginal >= _this.itemsCount) _this.adaptiveTarget.button.show();
				_this.transferItems(_this, _this.adaptiveTarget, {
					direction: 'backwards'
				});
			} else if (_this.isResponsive) {
				if (!_this.responsiveTarget.hasButton) {
					// Make button for the responsive target
					_this.button = new Button(_this.responsiveTarget, {
						classList: ['navigation-toggle', 'stay-in-nav'],
						element: 'li'
					});

					_this.responsiveTarget.button = new Button(_this.responsiveTarget, {
						classList: ['navigation-toggle', 'stay-in-nav'],
						element: 'li'
					});

					// Insert the button
					_this.menu_wrapper_selector.insertBefore(_this.button.selector, _this.menu_wrapper_selector.lastElementChild);
					_this.responsiveTarget.menu_wrapper_selector.insertBefore(_this.responsiveTarget.button.selector, _this.responsiveTarget.menu_wrapper_selector.lastElementChild);
				}

				if (!_this.responsiveTarget.hasBackdrop) {
					// Make backdrop for the responsive target
					_this.responsiveTarget.backdrop = new Backdrop(_this.responsiveTarget);
				}

				_this.itemsCount--;
				_this.responsiveTarget.itemsCount++;
				if (_this.itemsCountOriginal >= _this.itemsCount) _this.responsiveTarget.button.show();
				_this.transferItems(_this, _this.responsiveTarget, {
					itemsToTransfer: 1,
					direction: 'backwards'
				});
			}
		} else if (_this.itemsCountOriginal > _this.itemsCount) {
			// Menu is big enough again, send items back
			if (_this.isAdaptive && _this.sizeMenuHas >= _this.overflows[_this.itemsCountOriginal]) {
				// Hide button and send items from adaptive to original
				_this.adaptiveTarget.itemsCount = 0;
				_this.itemsCount = _this.itemsCountOriginal;
				_this.transferItems(_this.adaptiveTarget, _this);

				if (_this.itemsCountOriginal <= _this.itemsCount) _this.button.hide();
				if (_this.itemsCountOriginal <= _this.itemsCount) _this.adaptiveTarget.button.hide();
			} else if (_this.isResponsive) {
				if (_this.sizeMenuHas >= _this.overflows[_this.itemsCountOriginal]) {
					// Send all items from responsive to original
					_this.responsiveTarget.itemsCount = 0;
					_this.itemsCount = _this.itemsCountOriginal;
					_this.transferItems(_this.responsiveTarget, _this, {
						direction: 'forwards'
					});
				} else if (_this.sizeMenuHas >= _this.overflows[_this.itemsCount+1]) {
					// Send one item from responsive to original
					_this.itemsCount++;
					_this.responsiveTarget.itemsCount--;
					_this.transferItems(_this.responsiveTarget, _this, {
						itemsToTransfer: 1,
						direction: 'forwards'
					});
				}

				if (_this.itemsCountOriginal <= _this.itemsCount) _this.button.hide();
				if (_this.itemsCountOriginal <= _this.itemsCount) _this.responsiveTarget.button.hide();
			}
		}

		_this.updateSizeInfo();
		if (_this.sizeMenuNeeds > _this.sizeMenuHas && _this.itemsCount != 0) setTimeout(_this.resize, 10);
	}

	this.transferItems = function(from, to, options) {
		var fromItems = from.menu_wrapper_selector.childNodes;
		var fromItemsCount = fromItems.length;

		if (options == null)                 options = {};
		if (options.itemsToTransfer == null) options.itemsToTransfer = fromItemsCount;
		if (options.direction == null)       options.direction = 'backwards';

		if (options.direction == 'backwards') {
			// Loop through the items backwards
			for (var i = fromItemsCount; i-- > fromItemsCount-options.itemsToTransfer && i >= 0;) {
				// Skip items that aren't supposed to be transfered
				if (fromItems[i].classList.contains('stay-in-nav')) i--;

				to.menu_wrapper_selector.insertBefore(fromItems[i], to.menu_wrapper_selector.firstElementChild);
			}
		} else if (options.direction == 'forwards') {
			// Loop through the items forwards
			for (var i = 0; i < options.itemsToTransfer; i++) {
				// Skip items that aren't supposed to be transfered
				if (fromItems[i].classList.contains('stay-in-nav')) {
					i++;
				}

				if (i < fromItems.length) {
					to.menu_wrapper_selector.insertBefore(fromItems[i], to.menu_wrapper_selector.lastElementChild);

					// Because we are looping through the list forwards, we have to reduce the current
					// position and total items when we transfer an item.
					i--;
					options.itemsToTransfer -= 1;
				}
			}
		}
	}

	if (this.isHorizontal && (this.isAdaptive || this.isResponsive)) {
		window.addEventListener('resize', throttle(_this.resize, 500));
		setTimeout(_this.resize, 500);

		// Find the user defined target, or generate one
		if (this.isAdaptive) {
			var adaptiveTargetSelector = this.selector.getAttribute('adaptive-target');
			if (adaptiveTargetSelector == null) {
				this.adaptiveTarget = new NavigationElement({
					classList: ['vertical', 'right']
				});
			} else {
				this.adaptiveTarget = document.querySelector(adaptiveTargetSelector);
			}
		} else if (this.isResponsive) {
			var responsiveTargetSelector = this.selector.getAttribute('responsive-target');
			if (responsiveTargetSelector == null) {
				this.responsiveTarget = new NavigationElement({
					classList: ['vertical', 'right']
				});
			} else {
				this.responsiveTarget = document.querySelector(responsiveTargetSelector);
			}
		}
	}

	// If logo option is set, create it
	if (options.logo != null)
		this.createLogo(options.logo);

	// Append the navigation element to the document
	options.appendTo.appendChild(this.selector);

	if (options.scroll != null ) {
		if (this.isSticky) {
			if (options.scroll.sticky == null)
				options.scroll.sticky = {};

			if (options.scroll.sticky.hide == null)
				options.scroll.sticky.hide = true;
		}

		if (options.scroll.scrollChange != null) {
			this.isScrollChange = true;
			options.scroll.scrollChange.activeClass = '';
		}
	}

	if (this.isSticky || this.isScrollChange)
		this.setupScroll(options.scroll);

	navigations.push(this);
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
	if (options == null) var options = {};
	var _this = this;

	// Create the selector
	if (options.element == null) {
		this.selector = document.createElement('button');
	} else {
		this.selector = document.createElement(options.element);
	}

	// Set classes
	if (options.classList == null) {
		this.selector.classList = NavigationElement.selector.classList;
		this.selector.classList.add('navigation-toggle');
		this.selector.classList.add('stay-in-nav');
		this.selector.classList.remove('navigation');
	} else {
		this.selector.classList = (options.classList.join(' '));
	}

	// Create selector for opening
	this.openSelector = document.createElement('span');
	this.openSelector.classList.add('open');
	this.openIconSelector = document.createElement('i');
	this.openIconSelector.classList.add('icon', 'fas', 'fa-bars');
	this.openSelector.appendChild(this.openIconSelector);
	this.selector.appendChild(this.openSelector);

	// Create selector for closing
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

	this.show = function() { this.selector.style.display = '';     }
	this.hide = function() { this.selector.style.display = 'none'; }

	// Setup toggle for clicking the button
	this.selector.addEventListener('click', function() {
		_this.toggle();
		NavigationElement.toggle();
		if (NavigationElement.hasBackdrop) NavigationElement.backdrop.toggle();
	});

	document.body.appendChild(this.selector);
	buttons.push(this);
}
