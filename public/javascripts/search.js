var socket = io.connect('http://localhost:3700');

window.onload = function() {

    var search = document.getElementById('search');
    var content = document.getElementById('itemlist');
    var autocomplete = document.getElementById('autocomplete');
    var searchDict = [];
    var resultDict = [];
    var resultList = [];

    socket.on('results', function (data) {
        console.log(data);
        console.log('results received');
        //resultList = [];
        for (var i = 0; i < data.length; i++) {
            var json = { value: data[i].text};
            if (!(json.value in resultDict)) {
                resultDict[json.value] = json.value;
                resultList.push(json);
            }
        }

        console.log(resultList);

        // setup autocomplete function pulling from currencies[] array
        $('#autocomplete').autocomplete({
            lookup: resultList,
            onSelect: function (suggestion) {
                console.log(resultList);
                var thehtml = '<strong>Item Name:</strong> ' + suggestion.value;// + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
                $('#outputcontent').html(thehtml);
                socket.emit('search', suggestion.value);
            }
        });
        /*
        var list = '';
        for (var i = 0; i < data.length; i++) {
            var text = data[i].text;
            list += '<li class="list-unstyled">' + data[i].text + '</li>';
            console.log(text);
        }
        content.innerHTML = list;
        */
    });

    socket.on('searchResults', function(data) {
        console.log(data);
        console.log('searchResults received');
        var thehtml = '<strong>Item Name:</strong> ' + data;// + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
        $('#outputcontent').html(thehtml);
    });

    /*
    Activating autoselect query when user types more than 3 characters
     */
    var searched = false;
    document.onkeyup = function (event) {
        if (window.event.keyCode >= 37 && window.event.keyCode <= 40) {
            return;
        }

        if (autocomplete.value.length > 2 && !searched){
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                socket.emit('test', {q: text});
                searched = true;
            }
        }

        if (autocomplete.value.length < 2 && autocomplete.value.length > 0){
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                socket.emit('test', {q: text});
                searched = false;
            }
        }

        if (autocomplete.value.length == 0){
            searched = false;
            resultList = [];
        }

        if (window.event.keyCode == '13') {
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                socket.emit('test', {q: text});
                searched = false;
            }
        }
    };

};