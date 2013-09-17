var hammer = null;
var app = (function() {
	var notificationId;

	return {
		/* Initialize App */
		start: function() {
			/* Enable Hammer JS */
			hammer = $(document.body).hammer();

			/* Aside Menu Tap */
			hammer.on('tap', 'aside li[data-target]', function() {
				app.hideAside();
				app.section(this.getAttribute('data-target'), 'aside');
			});

			/* Link Tap */
			hammer.on('tap', 'section li[data-target]', function() {
				/* t:target, a:animation, h:header */
				var t = this.getAttribute('data-target');
				var a = this.getAttribute('data-anim');
				var h = this.getAttribute('data-header');
				
				if (t === 'aside') { app.toggleAside(); }
				else if (!a) { app.article(t, h); }
				else { app.section(t, a); }
			});

			/* Group List Tap */
			hammer.on('tap', 'ul.group li', function() {
				this.parentNode.querySelector('li.active').classList.remove('active');
				this.classList.add('active');
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
			var nw = document.getElementById('notificationWrapper');
			var nb = document.getElementById('notificationBody');

			/* Show Notification */
			nw.className = 'show';
			nb.className = 'show';

			/* Set time to 1.5 sec if not provided */
			if (!data.time) { data.time = 1500; }
			
			/* Set Style (alert, error, success, info) */
			nb.classList.add(data.style);

			/* Set Icon */
			if (data.icon) { nb.querySelector('i').className = data.icon + ' show'; }

			/* Set Title */
			nb.querySelector('.title').innerHTML = data.title;

			/* Set Message */
			nb.querySelector('.message').innerHTML = data.message;
			
			/* Show Buttons */
			if (data.buttons) {
				nb.querySelector('.buttons').classList.add('show');
				nb.querySelector('.buttons .first').innerHTML = data.buttons.first;
				nb.querySelector('.buttons .first').ontap = function() {
					data.buttons.firstCallback();
					app.hideNotification();
				};
				nb.querySelector('.buttons .second').ontap = function() {
					data.buttons.secondCallback();
					app.hideNotification();
				};
			}
			else {
				/* Hide Notification On Tap */
				nb.ontap = function() { app.hideNotification(); };
				/* Hide Notification After Given Time */
				if (data.time !== '0') { notificationId = setTimeout(function() { app.hideNotification(); }, data.time); }
			}
		},

		/* Hide Notification */
		hideNotification: function() {
			var nw = document.getElementById('notificationWrapper');
			var nb = document.getElementById('notificationBody');

			/* Clear Timeout if there is one */
			clearTimeout(notificationId);

			/* Hide Notification Body, Icon, Buttons & Wrapper */
			nb.classList.add('hide');
			setTimeout(function() { 
				nw.classList.remove('show');
				nb.querySelector('.buttons').classList.remove('show');
				nb.querySelector('i').classList.remove('show'); 
			}, 300);
		},

		/* Navigate To Section (s:section, a:animation) */
		section: function(s, a) {
			/* cs: current section, ts: target section */ 
			var cs = document.querySelector('section.current');
			var ts = document.getElementById(s);

			/* Update Classes */
			function updateSection() {
				/* Check if Target and Current same */
				if (cs !== ts) {			
					ts.className = a + ' in current';
					cs.className = a + ' out current';

					/* Remove Animation Classes Once Done */
					ts.addEventListener('webkitAnimationEnd', function() {
						ts.classList.remove(a);
						ts.classList.remove('in');
						ts.removeEventListener('webkitAnimationEnd', arguments.callee, false);
					});
					cs.addEventListener('webkitAnimationEnd', function() {
						cs.classList.remove(a);
						cs.classList.remove('out');
						cs.classList.remove('current');
						cs.removeEventListener('webkitAnimationEnd', arguments.callee, false);
					});
				}

				/* Update Menu Active */
				document.querySelector('#asideMenu ul li.active').classList.remove('active');
				document.querySelector('#asideMenu ul li[data-target="' + s + '"]').classList.add('active');
			}
			
			/* Check If Aside Is Open */
			if (cs.classList.contains('show-menu')) {
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
			var cs = document.querySelector('section.current');
			setTimeout(function() { document.getElementById(a).classList.add('current'); }, 0);
			if (h) { cs.querySelector('header h1').innerHTML = h; }
			if (ac = cs.querySelector('article.current')) { ac.classList.remove('current'); }
			if (fc = cs.querySelector('footer li.active')) { fc.classList.remove('active') };
			if (ft = cs.querySelector('footer li[data-target="' + a + '"]')) { ft.classList.add('active'); }
			if (hc = cs.querySelector('header ul.group li.active')) { hc.classList.remove('active'); }
			if (ht = cs.querySelector('header ul.group li[data-target="' + a + '"]')) { ht.classList.add('active'); }
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