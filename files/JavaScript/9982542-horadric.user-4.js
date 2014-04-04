// ==UserScript==
// @name        horadric.ru pony theme
// @namespace   http://horadric.ru/
// @include     http://horadric.ru/*
// @version     2
// @grant       none
// ==/UserScript==
(function()
{
    var background = document.body.style.backgroundImage = 'url(http://horadric.ru/sites/default/themes/horadric_zen/images/bg1ap.jpg)';
    var logo = document.querySelector("img[src$='horad_logo_249x122_0.png']");    
    if (logo)
        logo.src = 'http://horadric.ru/sites/default/files/logo1ap.png';
}) ();