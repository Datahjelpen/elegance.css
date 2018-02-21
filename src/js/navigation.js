(function() {
	var div = document.createElement('div');
	div.setAttribute('id', 'devicecheck');
	document.body.appendChild(div);

	const devicecheck = window.getComputedStyle(document.getElementById("devicecheck")).getPropertyValue("content");

	window.is_desktop = false;
	window.is_tablet =  false;
	window.is_mobile =  false;

	if (devicecheck == "\"desktop\"" || devicecheck == "desktop") window.is_desktop = true;
	if (devicecheck == "\"tablet\""  || devicecheck == "tablet") window.is_tablet =   true;
	if (devicecheck == "\"mobile\""  || devicecheck == "mobile") window.is_mobile =   true;
})();

// Open and close adaptive/responsive navigations
(function() {
	let navigationToggles = document.querySelectorAll('.navigation-toggle');

	for (var i = navigationToggles.length - 1; i >= 0; i--) {
		setupNavToggle(navigationToggles[i]);
	}

	function setupNavToggle(navToggle) {
		const uuid = core.uuid();
		var nav = document.querySelector(navToggle.getAttribute('target'));

		nav.setAttribute('uuid', uuid);
		navToggle.setAttribute('belongsTo', uuid);

		// Create backdrop
		var backdrop = document.createElement('div');
		backdrop.classList.add('navigation-backdrop');
		backdrop.setAttribute('belongsTo', uuid);
		document.body.appendChild(backdrop);
		backdrop.addEventListener('click', function() {
			toggleNavigation(nav, backdrop);
		});

		// Setup toggle for button
		navToggle.addEventListener('click', function(e) {
			e.preventDefault();
			toggleNavigation(nav, backdrop);
		});

	}

	function toggleNavigation(nav, backdrop) {
		if (nav.classList.contains('open')) {
			nav.classList.remove('open');
			backdrop.classList.remove('open');
		} else {
			nav.classList.add('open');
			backdrop.classList.add('open');
		}
	}
})();
