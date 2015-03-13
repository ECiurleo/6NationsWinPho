$(function() {
    var client = new WindowsAzure.MobileServiceClient('https://sixnations.azure-mobile.net/', 'ytAZioMpsGFJFukIHxarxjxjnbqPVB91'),
        sixnationsTable = client.getTable('sixnations');

    // Read current data and rebuild UI.
    // If you plan to generate complex UIs like this, consider using a JavaScript templating library.
    function refreshsixnationss() {
        var query = sixnationsTable.where({ complete: false });

        query.read().then(function(sixnationss) {
            var listItems = $.map(sixnationss, function(item) {
                return $('<li>')
                    .attr('data-sixnations-id', item.id)
                    .append($('<button class="item-delete">Delete</button>'))
                    .append($('<input type="checkbox" class="item-complete">').prop('checked', item.complete))
                    .append($('<div>').append($('<input class="item-text">').val(item.text)));
            });

            $('#todo-items').empty().append(listItems).toggle(listItems.length > 0);
            $('#summary').html('<strong>' + sixnationss.length + '</strong> item(s)');
        }, handleError);
    }

    function handleError(error) {
        var text = error + (error.request ? ' - ' + error.request.status : '');
        $('#errorlog').append($('<li>').text(text));
    }

    function getsixnationsId(formElement) {
        return $(formElement).closest('li').attr('data-sixnations-id');
    }

    // Handle insert
    $('#add-item').submit(function(evt) {
        var textbox = $('#new-item-text'),
            itemText = textbox.val();
        if (itemText !== '') {
            sixnationsTable.insert({ text: itemText, complete: false }).then(refreshsixnationss, handleError);
        }
        textbox.val('').focus();
        evt.preventDefault();
    });

    // Handle update
    $(document.body).on('change', '.item-text', function() {
        var newText = $(this).val();
        sixnationsTable.update({ id: getsixnationsId(this), text: newText }).then(null, handleError);
    });

    $(document.body).on('change', '.item-complete', function() {
        var isComplete = $(this).prop('checked');
        sixnationsTable.update({ id: getsixnationsId(this), complete: isComplete }).then(refreshsixnationss, handleError);
    });

    // Handle delete
    $(document.body).on('click', '.item-delete', function () {
        sixnationsTable.del({ id: getsixnationsId(this) }).then(refreshsixnationss, handleError);
    });

    // On initial load, start by fetching the current data
    refreshsixnationss();
});