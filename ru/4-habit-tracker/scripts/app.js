'use strict'

let habits = [];

const HABIT_ID = 'habit_ID'; // local storage ID
const HABIT_ICON_PATH = './images/habits/';

const NEW_HABIT_MENU_POSITION_FIRST = false;
const USE_DEMO_DATA = false;

let globalActivehabitId;

const page = {
	body: document.querySelector('body'),
	menu: document.querySelector('.menu__list'),
	header: {
		root: document.querySelector('.header'),
		h1: document.querySelector('.header__h1'),
		progress: {
			root: document.querySelector('.progress'),
			count: document.querySelector('.progress__count'),
			target: document.querySelector('.progress__target'),
			barLine: document.querySelector('.progress-bar__line')
		}
	},
	content: document.querySelector('.content'),
	reports: document.querySelector('.content__reports'),
	addDayNum: document.querySelector('[addDayNum]'),
	popup: {
		cover: document.querySelector('[popup]'),
		h2: document.querySelector('.popup__h2'),
		icons: document.querySelector('[popupIcons]'),
		habitIcons: [], // use later document.querySelectorAll('[habitIcon]')
		title: document.querySelector('[popupTitle]'),
		form: {
			root: document.querySelector('[popupForm]'),
			newHabitIcon: document.querySelector('[name=habitIcon]')
		}
	},
	controls: {
		removeHabit: document.querySelector('[removeHabit]'),
		changeHabit: document.querySelector('[changeHabit]'),
		fillDemoData: document.querySelector('[fillDemoData]')
	}	
}

/* Icons */
const icons = [
	'food.svg',
	'gym.svg',
	'water.svg',
	'backpack.svg',
	'book.svg',
	'car.svg',
	'car_nature.svg',
	'cook_food.svg',
	'cycle.svg',
	'drill.svg',
	'fishing.svg',
	'forest.svg',
	'guitar_music.svg',
	'map.svg',
	'movie.svg',
	'nature.svg',
	'shoes.svg',
	'english_flag.svg',
	'friends.svg',
	'barber.svg'
];

/* Utils */
function getDemoData() {
	const data =
`[
	{
		"id": 1,
		"icon": "gym.svg",
		"name": "Отжимания",
		"target": 10,
		"days": [
			{ "comment": "Первый подход всегда даётся тяжело" },
			{ "comment": "Второй уже проще" }
		]
	},	
	{
		"id": 2,
		"icon": "food.svg",
		"name": "Правильное питание",
		"target": 20,
		"days": [
			{ "comment": "Хорошее самочувствие сегодня, много энергии" },
			{ "comment": "Приготовил картофель" },
			{ "comment": "Приготовил морковь" }
		]
	}
]`;
	return data;
}

function fillDemoData(e) {
	loadData(true);
	preRenderLayout();
	saveData();
	page.controls.fillDemoData.classList.add('hidden');
}

function loadData(fillDemo) {
	let data = localStorage.getItem(HABIT_ID);

	if (!data || data === '[]') {
		data = [];
	}

	// If local storage is not exist or empty
	if (data.length === 0 && fillDemo) {
		data = getDemoData();
	}

	if (data.length > 0) {
		const arr = JSON.parse(data);
		if(Array.isArray(arr)) {
			habits = arr;
		}
	}
}

function saveData() {
	localStorage.setItem(HABIT_ID, JSON.stringify(habits));
}

function isFormValid(form, fields) {
	const formData = new FormData(form);

	let result;

	for (const field of fields) {
		form[field].classList.remove('input_error');

		const fieldValue = formData.get(field).trim();

		if (!fieldValue) {
			form[field].classList.add('input_error');
			form[field].value = '';
			result = false;
			break;
		} else {
			result = true;
		}		
	}
	return result;
}

function formReset(form, fields) {
	if (fields) {
		fields.forEach(field => {
			form[field].value = '';
			form[field].classList.remove('input_error');
		});
	}
}

function getHabitById(habitId) {
	return habits.find(el => el.id === Number(habitId));
}

 /* Render */
function preRenderLayout() {
	// Check that data for rendering exists
	if (habits.length > 0) {
		let activeHabitId = habits[0].id; // set default menu item
		
		const hashHabitId = Number(document.location.hash.slice(1)); // get #id

		if (!isNaN(hashHabitId)) { // check for strings
			if (habits.find(habit => habit.id === hashHabitId)) {
				activeHabitId = hashHabitId; // change default menu item to #id
			}
		}
		renderLayout(activeHabitId);
	} else {
		page.header.h1.innerText = 'Добавьте привычку';
		page.header.progress.root.classList.add('hidden');
		page.content.classList.add('hidden');

		page.controls.changeHabit.classList.add('hidden');
		page.controls.removeHabit.classList.add('hidden');

		page.controls.fillDemoData.classList.remove('hidden');

		document.location.hash = '';
	}
}

 function renderLayout(activehabitId) {
	page.header.progress.root.classList.remove('hidden');
	page.content.classList.remove('hidden');

	globalActivehabitId = Number(activehabitId);

	const activehabit = getHabitById(activehabitId);

	location.replace(location.pathname + '#' + activehabitId);

	renderMenu(activehabit);

	renderHeader(activehabit);

	renderDays(activehabit);

	page.controls.changeHabit.classList.remove('hidden');
	page.controls.removeHabit.classList.remove('hidden');
}

function renderMenu(activehabit) {
	if (!activehabit) {
		return;
	}

	for (const habit of habits) {
		let menuItem = document.querySelector(`[menu-item-id="${habit.id}"]`);

		if (!menuItem) {
			createMenuItem(habit, activehabit);
			continue;
		}

		if (habit.id === activehabit.id) {
			menuItem.classList.add('habit-button_active');
		} else {
			menuItem.classList.remove('habit-button_active');
		}

		// update menu icon
		const menuIcon = document.querySelector(`[menu-item-id="${habit.id}"] > img`);
		menuIcon.setAttribute('src', HABIT_ICON_PATH + habit.icon);
	}

	function createMenuItem(habit, activehabit) {
		const newMenuItem = document.createElement('button');
		newMenuItem.setAttribute('menu-item-id', habit.id);
		newMenuItem.classList.add('habit-button');
	
		const menuImg = document.createElement('img');
		menuImg.setAttribute('src', HABIT_ICON_PATH + habit.icon);
		menuImg.setAttribute('alt', habit.name);
	
		newMenuItem.appendChild(menuImg);
	
		if (habit.id === activehabit.id) {
			newMenuItem.classList.add('habit-button_active');
		}
	
		newMenuItem.addEventListener('click', (e) => renderLayout(habit.id));
	
		page.menu.appendChild(newMenuItem);
	}
}

function renderHeader(activehabit) {
	if (!activehabit) {
		return;
	}

	const target = activehabit.target;
	page.header.h1.innerText = activehabit.name;
	
	const days = activehabit.days.length;
	const percent = (days / target * 100).toFixed(0);
	let maxPercent = days > target ? 100 : (days / target * 100).toFixed(0);

	page.header.progress.target.innerText = `(${days} из ${target})`;
	page.header.progress.count.innerText = percent + '%';
	page.header.progress.barLine.style.width = `${maxPercent}%`;
}

function renderDays(activehabit) {
	page.reports.innerHTML = '';

	let dayNum = 0;
	for (const day of activehabit.days) {
		dayNum ++;
		const commentText = day.comment;

		const dayReport = document.createElement('div');
		dayReport.className = 'report';
		dayReport.innerHTML = `
			<div class="report__day">День ${dayNum}</div>
				<div class="report__description">${commentText}</div>
				<div class="report__right">
					<button 
						class="report__delete button-icon" 
						title="Удалить запись ${dayNum}" 
						onclick="removeDay(event)"
						removeDayId="${dayNum - 1}"
					>
					</button>
			</div>
		`;
		page.reports.appendChild(dayReport);
	}

	dayNum ++;
	page.addDayNum.innerText = `День ${dayNum}`;
}

function renderPopupForm(formType) {
	const form = page.popup.form.root;
	let formValues = {};
	
	if (formType === 'add') {
		formValues = {
			h2: 'Добавить привычку',
			habitName: '',
			habitTarget: '',
			onsubmit: 'addHabit(event)'
		}
	}

	if (formType === 'change') {
		let changeHabitId = globalActivehabitId;
		
		const habit = getHabitById(changeHabitId);

		formValues = {
			h2: 'Изменить привычку',
			habitName: habit.name,
			habitTarget: habit.target,
			onsubmit: 'changeHabit(event)'
		}
	}

	page.popup.h2.innerText = formValues.h2;
	form['habitName'].value = formValues.habitName;
	form['habitTarget'].value = formValues.habitTarget;
	form.setAttribute('onsubmit', formValues.onsubmit);
}

function renderPopupIcons(activehabit) {
	page.popup.icons.innerHTML = '';
	let habitButtons = '';

	icons.forEach((icon, index) => {
		habitButtons += `
			<button class="habit-button" habitIcon="${icon}">
				<img src="./images/habits/${icon}">
			</button>
		`;
	});

	page.popup.icons.innerHTML = habitButtons;
}

// Data and actions
function addDay(e) {
	e.preventDefault();
	const addDayform = e.target;

	const fieldsToValidate = ['comment'];
	
	if (!isFormValid(addDayform, fieldsToValidate)) {
		return;
	}
	
	const formData = new FormData(addDayform);
	const comment = formData.get('comment').trim();

	let currentHabit;
	habits = habits.map(habit => {
		if (habit.id === globalActivehabitId) {
			currentHabit = {
				...habit,
				days: habit.days.concat({ 'comment' : comment })
			}
			return(currentHabit);
		} else {
			return habit;
		}
	});
	saveData();
	renderHeader(currentHabit);
	renderDays(currentHabit);
	formReset(addDayform, fieldsToValidate);
}

function removeErrorBorder(e) {
	const input = e.target;
	const text = input.value.trim();
	if (text.length > 0) {
		input.classList.remove('input_error');
	}
}

function removeDay(e) {
	const button = e.target;
	const removeDayId = button.getAttribute('removeDayId');

	const habit = getHabitById(globalActivehabitId);

	if (habit) {
		habit.days.splice(removeDayId, 1);
		saveData();
		renderHeader(habit);
		renderDays(habit);
	}	
}

function togglePopup(e) {
	const eventType = e.type;
	const eventKey = e.key;
	const element = e.target;
	
	// Add habit
	if (element.hasAttribute('menuAdd') || element.parentNode.hasAttribute('menuAdd')) {
		page.popup.cover.classList.remove('hidden');
		renderPopupForm('add');
	}
	
	// Change habit
	if (element.hasAttribute('changeHabit') || element.parentNode.hasAttribute('changeHabit')) {
		page.popup.cover.classList.remove('hidden');
		const activehabit = getHabitById(globalActivehabitId);
		setActiveIcon(activehabit);
		renderPopupForm('change');
	}	

	// Close popup
	const formToReset = page.popup.form.root;
	const fieldsToReset = ['habitName', 'habitTarget'];

	if (element.hasAttribute('popup-close')) {
		page.popup.cover.classList.add('hidden');
		formReset(formToReset, fieldsToReset);
		setActiveIcon(); // set first icon by default
	}

	if (eventType === 'keyup' && eventKey === 'Escape') {
		page.popup.cover.classList.add('hidden');
		formReset(formToReset, fieldsToReset);
		setActiveIcon(); // set first icon by default
	}
}

function chooseNewHabit(e) {
	const element = e.target.tagName === 'IMG' ? e.target.parentNode : e.target;
	const newHabitIcon = element.getAttribute('habitIcon');

	page.popup.form.newHabitIcon.value = newHabitIcon;

	page.popup.habitIcons.forEach(el => {
		el.classList.remove('habit-button_active');
	});
	element.classList.add('habit-button_active');
}

function addHabit(e) {
	e.preventDefault();
	const popupForm = e.target;

	const fieldsToValidate = ['habitName', 'habitTarget'];
	
	if (!isFormValid(popupForm, fieldsToValidate)) {
		return;
	}
	
	const formData = new FormData(popupForm);
	const habitName = formData.get('habitName').trim();
	const habitTarget = formData.get('habitTarget').trim();
	const newHabitIcon = formData.get('habitIcon').trim();

	const newHabitId = habits.length + 1;

	const newHabit = {
		id: newHabitId,
		icon: newHabitIcon,
		name: habitName,
		target: Number(habitTarget),
		days: []
	};

	if (NEW_HABIT_MENU_POSITION_FIRST) {
		habits.unshift(newHabit);
		page.menu.innerHTML = '';
	} else {
		habits.push(newHabit);
	}

	renderLayout(newHabitId);

	saveData();

	page.popup.cover.classList.add('hidden');

	formReset(popupForm, fieldsToValidate);

	page.popup.habitIcons.forEach(el => {
		el.classList.remove('habit-button_active');
	});

	page.popup.habitIcons[0].classList.add('habit-button_active');
	page.controls.fillDemoData.classList.add('hidden');
}

function changeHabit(e) {
	e.preventDefault();
	const popupForm = e.target;

	const fieldsToValidate = ['habitName', 'habitTarget'];
	
	if (!isFormValid(popupForm, fieldsToValidate)) {
		return;
	}

	const formData = new FormData(popupForm);
	const habitName = formData.get('habitName').trim();
	const habitTarget = formData.get('habitTarget').trim();
	const habitIcon = formData.get('habitIcon').trim();

	const changeHabitId = globalActivehabitId;
	const changeHabitKey = habits.findIndex(habit => habit.id === Number(changeHabitId));
	
	habits[changeHabitKey] = {
		...habits[changeHabitKey],
		icon: habitIcon,
		name: habitName,
		target: Number(habitTarget)
	}

	renderLayout(changeHabitId);

	saveData();

	formReset(popupForm, fieldsToValidate);

	setActiveIcon(); // set first icon by default

	page.popup.cover.classList.add('hidden');
}

function removeHabit(e) {
	e.preventDefault();

	const removeHabitId = globalActivehabitId;

	const removeHabitKey = habits.findIndex(habit => habit.id === removeHabitId);
	habits.splice(removeHabitKey, 1);

	const removeMenuItem = document.querySelector(`[menu-item-id="${removeHabitId}"]`);
	removeMenuItem.remove();

	preRenderLayout();
	saveData();
}

function setActiveIcon(activehabit) {
	let activeIcon = !activehabit ? icons[0] : activehabit.icon; 

	const iconElements = page.popup.habitIcons;

	if (!activehabit) {
		activeIcon = icons[0];
	}

	iconElements.forEach(iconElement => {
		const habitIcon = iconElement.getAttribute('habitIcon');
		if (habitIcon === activeIcon) {
			iconElement.classList.add('habit-button_active');
		} else {
			iconElement.classList.remove('habit-button_active');
		}
	});
}

window.addEventListener('storage', function(event) {
	if (event.key === 'habit_ID') {
		location.reload(true);
		console.log('localStorage was updated');
	}
});

// Start Program
(function () {
	loadData(USE_DEMO_DATA);

	preRenderLayout();

	renderPopupIcons();

	page.popup.habitIcons = document.querySelectorAll('[habitIcon]');
	page.popup.habitIcons[0].classList.add('habit-button_active');
	page.popup.form.newHabitIcon.value = page.popup.habitIcons[0].getAttribute('habitIcon');
	page.popup.habitIcons.forEach(el => {
		el.addEventListener('click', chooseNewHabit);
	});

	// Set Escape key for popup
	page.body.addEventListener('keyup', togglePopup);

	//
})()