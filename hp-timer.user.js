// ==UserScript==
// @name        Timer to the full|80% hp regenerating [GW]
// @namespace   undercity
// @description it shows the timer to regenerate the full|80% hp
// @include     http://www.gwars.ru/*
// @exclude		http://www.gwars.ru/b0/b.php*
// @updateURL   https://github.com/asmdk/ganjawars-user-script/blob/hp-timer.user.js
// @version     1.0
// @grant       none
// @author		asmdk <asmdk@tut.by>
// ==/UserScript==
(function() {

	let root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	// do not edit this code, settings you can change in bottom
	let ShowHpTimer = function(showFull, show80, sound, sound80) {
		this.showFull = showFull || 1;
		this.show80 = show80 || 1;
		this.sound = sound || null;
		this.sound80 = sound80 || null;
		this.regExpHpStart = new RegExp(".*var.(hp_start_h|hp_start)=(.{1,4});.*", "gi");
		this.regExpHpMax = new RegExp(".*var.(hp_max_h|hp_max)=(.{1,4});.*", "gi");
		this.regExpHpSpeed = new RegExp(".*var.(hp_speed_h|hp_speed)=(.{1,4});.*", "gi");
		this.init();
	}

	ShowHpTimer.prototype = {
		init: function() {
			let me = this,
                html = root.document.body.innerText+root.document.head.innerText,
                hp_start_re = me.regExpHpStart.exec(html),
                hp_start = (hp_start_re != null) ? hp_start_re[2] : false,
                hp_max_re = me.regExpHpMax.exec(html),
                hp_max = (hp_max_re != null) ? hp_max_re[2] : false,
                hp_80 = (hp_max) ? parseInt(hp_max*0.8) : false,
                hp_speed_re = me.regExpHpSpeed.exec(html),
                hp_speed = (hp_speed_re != null) ? hp_speed_re[2] : false,
                second = (hp_start && hp_max && hp_speed) ? parseInt( (hp_max-hp_start) / hp_speed ) : false,
                second80 = (hp_start && hp_80 && hp_speed && (hp_80-hp_start)>0) ? parseInt( (hp_80-hp_start) / hp_speed ) : false,
                menuBegin = root.document.querySelectorAll("#hpheader")[0];

			if (second != false && me.showFull == 1) {
				var span = me.createElement(second);
				menuBegin.parentNode.insertBefore(span, menuBegin);
				me.startIntervalTimer(span, second, me.sound);
			}
            if (second80 != false && me.show80 == 1) {
				var span80 = me.createElement(second80, '#000099');
				menuBegin.parentNode.insertBefore(span80, menuBegin);
				me.startIntervalTimer(span80, second80, me.sound80);
			}
		},
		createElement: function(sec, color) {
			let span = document.createElement('span');
			span.style.color = color || 'red';
			span.style.marginRight = '5px';
			span.innerHTML = sec;
			span.id = 'regenTimeLeft';

			return span;
		},
		startIntervalTimer: function(span, second, sound) {
			let interval = setInterval(function() {
                let min = (second - (second % 60))/60,
                    sec = second % 60;
                sec = (sec < 10) ? '0'+sec : sec;
				if (second < 1) {
					clearInterval(interval);
					span.style.display = 'none';
					if (sound != null) {
						var audio = new Audio();
	                    audio.src = '/sounds/'+sound+'.mp3';
	                    audio.autoplay = true;
					}
				}
                span.innerHTML = min+':'+sec;
                second--;
			}, 1000);
		}
	}

	/**
	* create object, set setting here
	* @1 - show full hp regen timer (1|0)
	* @2 - show 80% hp regen timer (1|0)
    * @3,4 sound that plays when timer is off
	*/
	let oShowHpTimer = new ShowHpTimer(1, 1, 5, 11);
})();