// Open and closes navigations
(function() {
	var navigationToggles = document.querySelectorAll('.navigation-toggle');

	for (var i = navigationToggles.length - 1; i >= 0; i--) {
		var navigationToggleTarget = document.querySelector(navigationToggles[i].getAttribute('target'));

		navigationToggles[i].addEventListener('click', function(e) {
			e.preventDefault();

			if (navigationToggleTarget.classList.contains('open')) {
				navigationToggleTarget.classList.remove('open');
			} else {
				navigationToggleTarget.classList.add('open');
			}
		})
	}
})();
