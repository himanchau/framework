var hammer = null;
var app = (function() {
	var notificationId;

	return {
		/* Initialize App */
		start: function() {
			/* Enable Hammer JS */
			hammer = $(document.body).hammer();

			/* Aside Menu Tap */
			hammer.on('tap', 'aside li[data-target]', function(e) {
				app.hideAside();
				app.section(e.currentTarget.getAttribute('data-target'), 'aside');
			});

			/* Link Tap */
			hammer.on('tap', 'section li[data-target]', function(e) {
				/* t:target, a:animation, h:header */
				var t = e.currentTarget.getAttribute('data-target');
				var a = e.currentTarget.getAttribute('data-anim');
				var h = e.currentTarget.getAttribute('data-header');
				
				if (t === 'aside') { app.toggleAside(); }
				else if (!a) { app.article(t, h); }
				else { app.section(t, a); }
			});

			/* Group List Tap */
			hammer.on('tap', 'ul.group li', function(e) {
				e.currentTarget.parentNode.querySelector('li.active').classList.remove('active');
				e.currentTarget.classList.add('active');
			});

			console.log('App Initialized Successfully!');
		},

		/* Show Loading Animation */
		showLoader: function() {
			document.getElementById('loader').classList.add('show');
		},

		/* Hide Loading Animation */
		hideLoader: function() {
			document.getElementById('loader').classList.remove('show');
		},

		/* Show Notification (Parameters: time, style, icon, title, message, buttons) */
		showNotification: function(data) {
			var nW = document.getElementById('notificationWrapper');
			var nB = document.getElementById('notificationBody');

			/* Show Notification */
			nW.className = 'show';
			nB.className = 'show';

			/* Set time to 1.5 sec if not provided */
			if (!data.time) { data.time = 1500; }
			
			/* Set Style (alert, error, success, info) */
			nB.classList.add(data.style);

			/* Set Icon */
			if (data.icon) { nB.querySelector('i').className = data.icon + ' show'; }

			/* Set Title */
			nB.querySelector('.title').innerHTML = data.title;

			/* Set Message */
			nB.querySelector('.message').innerHTML = data.message;
			
			/* Show Buttons */
			if (data.buttons) {
				nB.querySelector('.buttons').classList.add('show');
				nB.querySelector('.buttons .first').innerHTML = data.buttons.first;
				nB.querySelector('.buttons .first').ontap = function() {
					data.buttons.firstCallback();
					app.hideNotification();
				};
				nB.querySelector('.buttons .second').ontap = function() {
					data.buttons.secondCallback();
					app.hideNotification();
				};
			}
			else {
				/* Hide Notification On Tap */
				nB.ontap = function() { app.hideNotification(); };
				/* Hide Notification After Given Time */
				if (data.time !== '0') { notificationId = setTimeout(function() { app.hideNotification(); }, data.time); }
			}
		},

		/* Hide Notification */
		hideNotification: function() {
			var nW = document.getElementById('notificationWrapper');
			var nB = document.getElementById('notificationBody');

			/* Clear Timeout if there is one */
			clearTimeout(notificationId);

			/* Hide Notification Body, Icon, Buttons & Wrapper */
			nB.classList.add('hide');
			setTimeout(function() { 
				nW.classList.remove('show');
				nB.querySelector('.buttons').classList.remove('show');
				nB.querySelector('i').classList.remove('show'); 
			}, 300);
		},

		/* Navigate To Section (s:section, a:animation) */
		section: function(s, a) {
			/* cS: current section, tS: target section */ 
			var cS = document.querySelector('section.current');
			var tS = document.getElementById(s);

			/* Update Classes */
			function updateSection() {
				/* Check if Target and Current same */
				if (cS !== tS) {			
					tS.className = a + ' in current';
					cS.className = a + ' out current';

					/* Remove Animation Classes Once Done */
					tS.addEventListener('webkitAnimationEnd', function() {
						tS.classList.remove(a);
						tS.classList.remove('in');
						tS.removeEventListener('webkitAnimationEnd', arguments.callee, false);
					});
					cS.addEventListener('webkitAnimationEnd', function() {
						cS.classList.remove(a);
						cS.classList.remove('out');
						cS.classList.remove('current');
						cS.removeEventListener('webkitAnimationEnd', arguments.callee, false);
					});
				}

				/* Update Menu Active */
				document.querySelector('#asideMenu ul li.active').classList.remove('active');
				document.querySelector('#asideMenu ul li[data-target="' + s + '"]').classList.add('active');
			}
			
			/* Check If Aside Is Open */
			if (cS.classList.contains('show-menu')) {
				/* Go To Section After Aside Closed */
				app.hideAside();
				setTimeout(function() { updateSection(); }, 150);
			}
			else {
				updateSection();
			}
		},

		/* Navigate To Article (a: article, h:h1 title) */
		article: function(a, h) {
			var cS = document.querySelector('section.current');
			setTimeout(function() { document.getElementById(a).classList.add('current'); }, 0);
			if (h) { cS.querySelector('header h1').innerHTML = h; }
			if (ac = cS.querySelector('article.current')) { ac.classList.remove('current'); }
			if (fc = cS.querySelector('footer li.active')) { fc.classList.remove('active') };
			if (ft = cS.querySelector('footer li[data-target="' + a + '"]')) { ft.classList.add('active'); }
			if (hc = cS.querySelector('header ul.group li.active')) { hc.classList.remove('active'); }
			if (ht = cS.querySelector('header ul.group li[data-target="' + a + '"]')) { ht.classList.add('active'); }
		},

		/* Show Aside Menu */
		showAside: function() {
			document.getElementById('asideMenu').classList.add('current');
			document.querySelector('section.current').classList.remove('hide-menu');
			document.querySelector('section.current').classList.add('show-menu');
		},

		/* Hide Aside Menu */
		hideAside: function() {
			document.querySelector('section.current').classList.remove('show-menu');
			document.querySelector('section.current').classList.add('hide-menu');
			setTimeout(function() { document.getElementById('asideMenu').classList.remove('current'); }, 400);
		},

		/* Toggle Aside Menu */
		toggleAside: function() {
			if (document.getElementById('asideMenu').classList.contains('current')) { app.hideAside(); }
			else { app.showAside(); }
		}
	}
})();