(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var roundn = require('compute-roundn');

$(function() {
    // init percentage bars
    $('.directory > .row').each(function() {
        var percentage = $(this).children('.percentage').text();
        var fillWidth = roundn((percentage / 2), 0);
        $(this).find('.percentage-bar > .fill').css('width', fillWidth + 'px');
    });

    $('.directory').on('mouseover', function(e) {
        e.stopPropagation();
        $(this).css('background-color', '#FFE2A5');
    }).on('mouseout', function() {
        $(this).css('background-color', '');
    }).click(function(e) {
        e.stopPropagation();
        var children = $(this).children('.children');

        // if not expanded, then expand
        if (parseInt(children.css('height'), 10) === 0) {
            children.css('height', 'auto');
            var childrenHeight = children.css('height');
            children.css('height', '0');

            TweenLite.to(children, 0.4, {
                css: {
                    'height': childrenHeight
                }
                , ease: Power3.easeOut
                , onComplete: function() {
                    children.css('height', 'auto');
                }
            });
        } else { // else collapse
            TweenLite.to(children, 0.4, {
                css: {
                    'height': 0
                }
                , ease: Power3.easeOut
            });
        }
    });

    $('select.file-size').change(function() {
        var val = $(this).val();
        $('.size').each(function(sizeEl) {
            var bytes = $(this).data('bytes');
            var resultSize;
            switch (val) {
                case 'B':
                    resultSize = bytes;
                    break;
                case 'KB':
                    resultSize = (bytes / 1024).toFixed(2);
                    break;
                case 'MB':
                    resultSize = (bytes / 1024 / 1024).toFixed(2);
                    break;
            }
            $(this).text(resultSize + ' ' + val);
        });
    });
});

},{"compute-roundn":2}],2:[function(require,module,exports){
/**
*
*	COMPUTE: roundn
*
*
*	DESCRIPTION:
*		- Round values to the nearest multiple of 10^n.
*
*
*	NOTES:
*		[1]
*
*
*	TODO:
*		[1]
*
*
*	LICENSE:
*		MIT
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. kgryte@gmail.com. 2014.
*
*/

'use strict';

/**
* FUNCTION: roundn( x, n )
*	Rounds values to the nearest multiple of 10^n. Notes: if provided an array, mutates the array.
*
* @param {Array|Number} x - value(s) to be rounded
* @param {Number} n - power of 10; should be an integer value
* @returns {Array|Number} rounded value(s). If `x` is an empty array, returns `null`.
*/
function roundn( x, n ) {
	var isArray = Array.isArray( x ),
		scalar,
		len;
	if ( !isArray && ( typeof x !== 'number' || x !== x ) ) {
		throw new TypeError( 'roundn()::invalid input argument. Must provide either a single numeric value or a numeric array.' );
	}
	if ( typeof n !== 'number' || n !== n || n !== ( n | 0) ) {
		throw new TypeError( 'roundn()::invalid input argument. Power of 10 must be an integer value.' );
	}
	n = -n;
	scalar = Math.pow( 10, n );
	if ( !isArray ) {
		return Math.round( x*scalar ) / scalar;
	}
	len = x.length;
	if ( !len ) {
		return null;
	}
	for ( var i = 0; i < len; i++ ) {
		x[ i ] = Math.round( x[i]*scalar ) / scalar;
	}
	return x;
} // end FUNCTION roundn()


// EXPORTS //

module.exports = roundn;

},{}]},{},[1]);
