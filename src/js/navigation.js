// Open and close navigations
(function() {
	let navigationToggles = document.querySelectorAll('.navigation-toggle');

	for (var i = navigationToggles.length - 1; i >= 0; i--) {
		const uuid = core.uuid();
		var nav = document.querySelector(navigationToggles[i].getAttribute('target'));

		nav.setAttribute('uuid', uuid);
		navigationToggles[i].setAttribute('belongsTo', uuid);

		// Create backdrop
		var backdrop = document.createElement('div');
		backdrop.classList.add('navigation-backdrop');
		backdrop.setAttribute('belongsTo', uuid);
		document.body.appendChild(backdrop);

		navigationToggles[i].addEventListener('click', function(e) {
			e.preventDefault();
			toggleNavigation(nav, backdrop);
		})
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

