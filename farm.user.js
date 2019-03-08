// ==UserScript==
// @name        Farm [GW]
// @namespace   undercity
// @description automatization of ferma
// @include     http://www.gwars.ru/ferma.php*
// @updateURL   https://github.com/asmdk/ganjawars-user-script/blob/farm.user.js
// @version     1.0
// @grant       none
// @author		asmdk <asmdk@tut.by>
// ==/UserScript==
(function() {
	let root = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	let Ferma = function(regionsCount) {
		this.baseUrl = 'http://www.gwars.ru';
		this.actionRegExp = '.ferma.*action=(extract|water|cultivate).(x|y)=(.).(y|x)=(.)&hsh=(.{1,5})>';
		this.regionsCount = regionsCount || 49;
		this.timeout = 1000;
		this.increaseTimeout = 500;
		this.init();
	}

	Ferma.prototype = {
		init: function() {
			let me = this,
                aDo = me.addDoButton();
		},
		addDoButton: function() {
			let me = this,
                menu = root.document.querySelectorAll("a[href='/ratings.php']")[0].parentNode,
                a = document.createElement('a'),
                aText = document.createTextNode("work ferm");
			a.appendChild(aText);
			a.href = "javascript:void(0)";
			a.style = 'text-decoration:none;font-weight: bold;color: #AA07FF;margin-left: 5px;';
			a.addEventListener('click', function() { me.checkFields(me, this) }, false);
			menu.appendChild(a);
		},
		checkFields: function(me, a) {
			root.document.body.style.opacity = '0.3';
			let elements = root.document.querySelectorAll("a[href^='/ferma.php?x=']");
			for (var i = 0; i <= elements.length; i++) {
				a.innerHTML = 'Обработка клетки ' + i;
				me.getAction(elements.item(i).href);
				if (i >= me.regionsCount) break;
			}
			root.document.body.style.opacity = '1';
			root.location.reload();
		},
		getAction: function(href) {
			let me = this,
                xmlhttp=new XMLHttpRequest();
			xmlhttp.onreadystatechange=function()
			{
				if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
					var expr = new RegExp(me.actionRegExp, 'ig');
					var html = xmlhttp.responseText;
					var matches = expr.exec(html);

					if (matches != null) {
						var doUrl = me.baseUrl + '/ferma.php?action=' + matches[1] + '&' + matches[2] + '=' + matches[3] + '&' + matches[4] + '=' + matches[5] + '&hsh=' + matches[6];
						var dohttp=new XMLHttpRequest();
						dohttp.onreadystatechange=function()
						{
							if (xmlhttp.readyState==4 && xmlhttp.status==200)	{
								console.log(doUrl);
							}
						}
						dohttp.open("GET", doUrl, false);
						dohttp.send();
					}
				}
			}
			xmlhttp.open("GET", href, false);
			xmlhttp.send();
		}
	}

    //@param: count of the points (from top left to bottom right)
	let oFerma = new Ferma(48);
})();