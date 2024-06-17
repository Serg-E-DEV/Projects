// Here are the scripts for the site

'use strict'

const page = {
	body: document.querySelector('body'),
	sectionHeader: document.querySelector('.section-header'),
	btnBurger: document.querySelector('.btn__burger'),
	mainNavigation: document.querySelector('.main-navigation__inner'),
	faqAccordion: document.querySelector('.faq-accordion'),
	sliderHero: document.querySelector('.slider-hero-image'),
	sliderBlog: document.querySelector('.slider-blog'),
	sliderQuotes: document.querySelector('.slider-quotes')
}

const sliderGeneralParams = {
	autoplay: {
		delay: 3000,
		disableOnInteraction: true,
	},
	speed: 500
}

const sliderHero = new Swiper('.slider-hero-image', {
	loop: true,
	pagination: {
		el: '.slider-hero-image__dots',
		clickable: true,
		renderBullet: function (index, className) {
			// return '<span class="' + className + '">' + (index + 1) + "</span>";
			return `<li class="slider-dots__item ${className}"></li>`;
		}
	},
	keyboard: {
			enabled: true,
			onlyInViewport: true,
	},
	autoplay: sliderGeneralParams.autoplay,
	speed: sliderGeneralParams.speed
});

const sliderBlog = new Swiper('.slider-blog__inner', {
	loop: true,
	pagination: {
		el: '.slider-blog__dots',
		clickable: true,
		renderBullet: function (index, className) {
			return `<li class="slider-dots__item ${className}"></li>`;
		}
	},
	keyboard: {
			enabled: false,
			onlyInViewport: true,
	},
	navigation: {
		nextEl: '.slider-blog__arrow_next',
		prevEl: '.slider-blog__arrow_prev',
	},
	autoplay: sliderGeneralParams.autoplay,
	speed: sliderGeneralParams.speed
});

const sliderQuotes = new Swiper('.slider-quotes', {
	loop: true,
	pagination: {
		el: '.slider-quotes__dots',
		clickable: true,
		renderBullet: function (index, className) {
			return `<li class="slider-dots__item ${className}"></li>`;
		}
	},
	keyboard: {
			enabled: true,
			onlyInViewport: true,
	},
	autoplay: sliderGeneralParams.autoplay,
	speed: sliderGeneralParams.speed,
	slidesPerView: 2,
	slidesPerGroup: 1,
	spaceBetween: 64,
});

function sliderAutoplayDisable(slider, swiperParam) {
	slider.addEventListener('click', function() {
		swiperParam.autoplay.stop();
		// console.log('Slider autoplay disabled');
	});
}

function getScrollbarWidth() {
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll';
	outer.style.msOverflowStyle = 'scrollbar'; // for IE 10+
	document.body.appendChild(outer);
	const inner = document.createElement('div');
	outer.appendChild(inner);
	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
	outer.parentNode.removeChild(outer);
	return scrollbarWidth;
}


// === Start program
window.addEventListener('scroll', function (event) {
	const scrollPosition = document.documentElement.scrollTop.toFixed(0);
	if (scrollPosition > 10) {
		page.sectionHeader.classList.add('section-header_scrolled');
	} else {
		page.sectionHeader.classList.remove('section-header_scrolled');
	}
});

page.btnBurger.addEventListener('click', event => {
	const button = event.target.closest('.btn__burger');
	if (button) {
		button.classList.toggle('btn__burger_active');
		page.mainNavigation.classList.toggle('main-navigation__inner_active');
	}
})


page.faqAccordion.addEventListener('click', event => {

	if(event.target.classList.contains('btn')) {
		return;
	}

	const accordionItem = event.target.closest('.faq-accordion__item');
	if (accordionItem) {
		accordionItem.classList.toggle('faq-accordion__item_active');
	}
});

// Disable autoplay for sliders on click
sliderAutoplayDisable(page.sliderHero, sliderHero);
sliderAutoplayDisable(page.sliderBlog, sliderBlog);
sliderAutoplayDisable(page.sliderQuotes, sliderQuotes);

// Fix an offset when fsLightbox removes a scrollbar
const scrollbarWidth = getScrollbarWidth();

fsLightbox.props.onOpen = function () {
	page.sectionHeader.style.paddingRight = scrollbarWidth + 'px';
}

fsLightbox.props.onClose = function () {
	page.sectionHeader.style.removeProperty('padding-right');
	page.sectionHeader.removeAttribute('style');
}
