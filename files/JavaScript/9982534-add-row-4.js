$('#add-row').on('click', function(event) {
        var $tbody = $('#sheet tbody');
        var width = $('thead tr th').length;

        var $tr = $('<tr>').appendTo($tbody);
        for (var i = 0; i < width; i++) {
            $('<td></td>').appendTo($tr);
        }
    });