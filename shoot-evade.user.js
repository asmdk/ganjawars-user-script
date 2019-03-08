// ==UserScript==
// @name        Auto set an aim and evade direction [GW]
// @namespace   undercity
// @description set right and left hand direction to shoot and evade
// @include     http://www.gwars.ru/b0/b.php*
// @updateURL   https://github.com/asmdk/ganjawars-user-script/blob/shoot-evade.user.js
// @version     1.0
// @grant       none
// @author		asmdk <asmdk@tut.by>
// ==/UserScript==
(function() {

	let root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	// do not edit this code, settings you can change in bottom
	let ShootEvade = function(left, right, evade) {
        this.evadeArr = [1, 1, 2, 3, 1, 1];
        this.shootArr = [1, 2, 3];
		this.leftHand = left || 2;
		this.rightHand = right || null;
		this.evade = evade || null;
		this.init();
	}

	ShootEvade.prototype = {
		init: function() {
			let me = this;
            if (me.rightHand == null) {
                let rand = Math.floor( Math.random() * me.shootArr.length );
            	me.rightHand = me.shootArr[rand];
            }
            if (me.evade == null) {
                var rand = Math.floor( Math.random() * me.evadeArr.length );
            	me.evade = me.evadeArr[rand];
            }
			let leftHand = root.document.getElementById("left_attack"+me.leftHand);
			if (leftHand != null) {
				leftHand.click();
			}
			let rightHand = root.document.getElementById("right_attack"+me.rightHand)
			if (rightHand != null) {
				rightHand.click();
			}
			let evade = root.document.getElementById("defence"+me.evade);
			if (evade != null) {
				evade.click();
			}

            let submitButton = root.document.querySelectorAll("a[href='javascript:void(fight())']"),
                walk = root.document.getElementById('walk');
            if (submitButton != null && walk != null) {
                let div = me.createElement();
                walk.parentNode.insertBefore(div, walk);
                me.autoSubmit(submitButton[0]);
            }
		},
        autoSubmit: function(submitButton) {
            let checkbox = root.document.getElementById('autoSubmitStatus'),
                timeout = (secback - 5) * 1000;
            if (timeout > 3000) {
                let interval = setInterval(function() {
                if (checkbox.checked == true) {
                    submitButton.click();
                }
            }, timeout);
            }
        },
        createElement: function() {
            let div = document.createElement('div');
            div.innerHTML = '<input type=checkbox  name=autoSubmitStatus id=autoSubmitStatus checked=checked value=1><label for=walk>Автоход</label>';
            div.id = 'autoSubmitStatusDiv';

            return div;
        },
	}

	/**
	* create object, set setting here
	* 1 - set left hand direction; 1 - left, 2 middle, 3 right
	* 2 - set right hand direction; ***
	* 3 -  set evade direction; ***
	*/
	var oShootEvade = new ShootEvade();
})();