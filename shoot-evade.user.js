// ==UserScript==
// @name        Auto set an aim and evade direction [GW]
// @namespace   undercity
// @description set right and left hand direction to shoot and evade
// @include     http://www.gwars.ru/b0/b.php*
// @updateURL   https://github.com/asmdk/ganjawars-user-script/blob/shoot-evade.user.js
// @version     1.1
// @grant       none
// @author		asmdk <asmdk@tut.by>
// ==/UserScript==
(function() {

	let root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	// do not edit this code, settings you can change in bottom
	let ShootEvade = function(left, right, evade) {
        this.evadeArr = [1, 2, 3];
        this.shootArr = [2, 3];
		this.leftHand = left || 1;
		this.rightHand = right || null;
		this.evade = evade || null;
		this.enemyFalse = 'rgb(255, 224, 224)';
		this.enemyTrue = 'rgb(224, 255, 224)';
		this.init();
	}

	ShootEvade.prototype = {
		init: function() {
			let me = this,
                leftHand = root.document.getElementById("left_attack"+me.leftHand);
			if (leftHand != null) {
				leftHand.click();
			}
            if (me.rightHand == null) {
                let rand = Math.floor( Math.random() * me.shootArr.length );
            	me.rightHand = me.shootArr[rand];
            }
			let rightHand = root.document.getElementById("right_attack"+me.rightHand)
			if (rightHand != null) {
				rightHand.click();
			}
             if (me.evade == null) {
                let rand = Math.floor( Math.random() * me.evadeArr.length );
            	me.evade = me.evadeArr[rand];
            }
			let evade = root.document.getElementById("defence"+me.evade);
			if (evade != null) {
				evade.click();
			}

            let submitButton = root.document.querySelectorAll("a[href='javascript:void(fight())']"),
                walk = root.document.getElementById('walk'),
                intervalSecond = (secback*1000-5000) || 25000;
            if (submitButton != null && walk != null) {
                let div = me.createElement();
                walk.parentNode.insertBefore(div, walk);
                me.autoSubmit(submitButton[0], intervalSecond, me);
            }
		},
        autoSubmit: function(submitButton, intervalSecond, me) {
			me.selectEnemy(me);
            let checkbox = root.document.getElementById('autoSubmitStatus'),
                interval = setInterval(function() {
                if (checkbox.checked == true) {
                    submitButton.click();
                }
            }, intervalSecond);
        },
        createElement: function() {
            let div = document.createElement('div');
            div.innerHTML = '<input type=checkbox  name=autoSubmitStatus id=autoSubmitStatus checked=checked value=1><label for=walk>Автоход</label>';
            div.id = 'autoSubmitStatusDiv';

            return div;
        },
		selectEnemy: function(me) {
			let optionValue = 0,
                optionIndex = -1,
                range = 0,
                optionlist = document.getElementById('euids').options;

			for (let option = 0; option < optionlist.length; option++ ) {
				if (optionlist[option].style.backgroundColor == me.enemyTrue) {
					let optionArray = optionlist[option].text.split(' ');
					if (optionArray.length > 0) {
						var enemyRange = optionArray[optionArray.length-1];
						if ( enemyRange == 0 && range <= enemyRange) { optionIndex = option; range=enemyRange; }
						if ( enemyRange/enemyRange && range < enemyRange) { optionIndex = option; range=enemyRange; }
					}
				}
			}
			if (optionIndex >= 0) {
				optionlist[optionIndex].selected=true;
			}
			else {
				//root.document.getElementById('walk').checked=true;
			}
		}
	}

	/**
	* create object, set setting here
	* 1 - set left hand direction; 1 - left, 2 middle, 3 right
	* 2 - set right hand direction; ***
	* 3 -  set evade direction; ***
	*/
	let oShootEvade = new ShootEvade();


})();