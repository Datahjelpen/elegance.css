export function size(size) {
	if (size === 'xs')  return getComputedStyle(document.querySelector('#size-xs-up')).width;
	if (size === 's')   return getComputedStyle(document.querySelector('#size-s-up')).width;
	if (size === 'm')   return getComputedStyle(document.querySelector('#size-m-up')).width;
	if (size === 'l')   return getComputedStyle(document.querySelector('#size-l-up')).width;
	if (size === 'xl')  return getComputedStyle(document.querySelector('#size-xl-up')).width;
	if (size === 'xxl') return getComputedStyle(document.querySelector('#size-xxl-up')).width;
}

export function uuid() {
	return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	)
}
