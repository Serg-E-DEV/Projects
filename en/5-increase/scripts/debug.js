// ! This file must be deleted before deploying
'use ctrict'

let debugMode;

if (window.location.hostname !== '127.0.0.1') {
	debugMode = false;
	//throw new Error("Debug script will not be executed on this host");
	} else {
	debugMode = true;
	// console.log('Debug mode is active');
}

const debugPage = {
	html: document.querySelector('html'),
	body: document.querySelector('body'),
	sectionHeader: document.querySelector('.section-header'),
	scrollTargets: document.querySelectorAll('section, div, h1, h2, p, ul, img'),
	scrollTarget: null,
	debugPanel: null,
	setDebugPanel () {
		const panel = document.createElement('div');
		panel.setAttribute('id', 'debug-panel');
		panel.style.color = 'yellow';
		panel.style.backgroundColor = 'black';
		panel.style.opacity = '0.8';
		panel.style.padding = '5px';
		panel.style.fontSize = '12px';
		panel.style.lineHeight = '1.2em';
		panel.style.position = 'fixed';
		panel.style.left = '50%';
		panel.style.top = '0';
		panel.style.zIndex = 9999;
		panel.style.userSelect = 'none';
		panel.style.transform = 'translateX(-50%)';
		panel.innerText = '0px';

		this.debugPanel = panel;
		this.body.appendChild(panel);
	},
	params: {
		topMenuFixed: false,
		slidersAutoplay: false,
		scrollTargetTopOffset: 100,
		scrollTargetBorder: false
	}
}

// === Get the scrolling position
function watchScrollPosition () {
	const scrollPosition = getScrollPosition();
	setUrlParam('top', scrollPosition);

	if (debugPage.scrollTarget) {
		const targetScrollPosition = debugPage.scrollTarget.scrollPosition;
		const distance =  Math.abs(targetScrollPosition - window.scrollY);

		if (distance > 50) {
			setScrollTarget();
		}
	}
}

function getScrollPosition () {
	const scrollPosition = document.documentElement.scrollTop.toFixed(0);
	return scrollPosition
}

function setScrollPosition(scrollPosition) {
	window.scrollTo({
		top: scrollPosition
	});
}
// === / Get the scrolling position

function setUrlParam(paramName, ParamValue) {
	const url = new URL(window.location.href);
	url.searchParams.set(paramName, ParamValue);
	window.history.replaceState({}, '', url);
	// console.log(url.toString());
}

function getUrlParam(paramName) {
	const url = new URL(window.location.href);
	const paramValue = url.searchParams.get(paramName);
	return paramValue;
}

// disable empty links
function disableEmptyLinks(e) {
	let target = e.target;

	// Also provide for cases where <a> contains <img>
	while (target && target.tagName !== 'A') {
		target = target.parentNode;
	}

	if (target && target.tagName === 'A' && target.getAttribute('href') === '#') {		
			e.preventDefault(); // disable empty link
				console.log('href="#" link disabled');
	}
};

function watchScreenSize() {	
	const width = window.innerWidth;

	if (!debugPage.debugPanel) {
		debugPage.setDebugPanel();
	}

	debugPage.debugPanel.innerText = width + 'px';

	if (debugPage.scrollTarget) {
		const topPosition = debugPage.scrollTarget.getBoundingClientRect().top;
		const scrollPosition = topPosition + window.scrollY - debugPage.params.scrollTargetTopOffset;
		setScrollPosition(scrollPosition);
	}
}

function getScrollTarget() {
	// const viewScrollPosition = window.scrollY + window.innerHeight / 2;
	const viewScrollPosition = Math.floor(window.scrollY + debugPage.params.scrollTargetTopOffset);

	let closestTarget = null;
	let closestTargetDistance = Infinity;
	let closestScrollPosition = null;

	debugPage.scrollTargets.forEach(target => {
		const positions = target.getBoundingClientRect();
		const topPosition = positions.top;
		const scrollPosition = topPosition + window.scrollY;
		const distance = Math.abs(scrollPosition - viewScrollPosition);

		if (distance < closestTargetDistance) {
			closestTargetDistance = Math.floor(distance);
			closestTarget = target;
			closestScrollPosition = Math.floor(scrollPosition);
			closestTarget.screenPositions = positions;
			closestTarget.scrollPosition = scrollPosition;
		}
	});

	return closestTarget;
}

function setScrollTarget() {
	debugPage.scrollTarget = getScrollTarget();

	if (debugPage.params.scrollTargetBorder) {
		debugPage.scrollTargets.forEach(target => {
			target.style.border = '';
		})
		debugPage.scrollTarget.style.border = '3px dashed red';
	}
}

// Start Program
(function () {

	debugPage.body.addEventListener('click', disableEmptyLinks);

	if (!debugMode) {
		return;
	}

	if (debugPage.params.topMenuFixed === false) {
		debugPage.sectionHeader.style.position = 'initial';
		debugPage.body.style.paddingTop = '0';
	}

	if (debugPage.params.slidersAutoplay === false) {
		sliderHero.autoplay.stop();
		sliderBlog.autoplay.stop();
		sliderQuotes.autoplay.stop();
	}
	
	window.addEventListener('scroll', watchScrollPosition);
	window.addEventListener('resize', watchScreenSize)
	
	// Set scrollPosition after the page loads
	const scrollPosition = getUrlParam('top');
	if (scrollPosition > 0) {
		setScrollPosition(scrollPosition);
	}

	watchScreenSize();

	setScrollTarget();

	//
})()