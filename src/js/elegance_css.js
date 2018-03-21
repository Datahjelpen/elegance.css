import '../scss/elegance.scss';
import './navigation.js';

// Let's load all images so they all get compressed and usable
const images = require.context('./../images', false, /\.(gif|png|jpe?g|svg)$/i);
