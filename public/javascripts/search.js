var socket = io.connect('http://localhost:3700');

window.onload = function() {

    var search = document.getElementById('search');
    var content = document.getElementById('itemlist');
    var autocomplete = document.getElementById('autocomplete');

    var resultList = [];
    socket.on('results', function (data) {
        console.log(data);
        console.log('results received');
        //resultList = [];
        for (var i = 0; i < data.length; i++) {
            var json = { value: data[i].text};
            resultList.push(json);
        }

        console.log(resultList);

        // setup autocomplete function pulling from currencies[] array
        $('#autocomplete').autocomplete({
            lookup: resultList,
            onSelect: function (suggestion) {
                console.log(resultList);
                var thehtml = '<strong>Item Name:</strong> ' + suggestion.value;// + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
                $('#outputcontent').html(thehtml);
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

    var searched = false;
    document.onkeydown = function (event) {
        if (autocomplete.value.length > 2 && !searched){
            var text = autocomplete.value;
            socket.emit('test', {q: text} );
            searched = true;
        }

        if (autocomplete.value.length < 2){
            var text = autocomplete.value;
            socket.emit('test', {q: text} );
            searched = false;
        }

        if (window.event.keyCode == '13') {
            var text = autocomplete.value;
            socket.emit('test', {q: text} );
            searched = false;
        }
    };

};