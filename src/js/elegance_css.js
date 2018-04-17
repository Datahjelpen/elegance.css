// Let's load all images so they all get compressed and usable
const images = require.context('./../images', false, /\.(gif|png|jpe?g|svg)$/i);

import '../scss/elegance.scss';
import throttle from 'lodash.throttle';

(function() {
	// Create the devicecheck element
	var div = document.createElement('div');
	div.setAttribute('id', 'devicecheck');
	document.body.appendChild(div);

	// Trigger update on resize
	window.addEventListener('resize', throttle(window_is_sizeUpdate, 500));
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

const navigation = require('./navigation.js');

// var navigationayy = new navigation.NavigationElement('horizontal sticky responsive', document.querySelector('main'));
var navigationayy = new navigation.NavigationElement('horizontal sticky responsive', document.documentElement);
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
