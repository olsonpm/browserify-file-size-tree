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
