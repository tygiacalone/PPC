window.onload = function() {
    var socket = io.connect(window.location.hostname + ':3700');

    var search = document.getElementById('search');
    var content = document.getElementById('itemlist');
    var autocomplete = document.getElementById('autocomplete');
    var searchDict = [];
    var resultDict = [];
    var resultList = [];

    $('#example').nutritionLabel();

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
                socket.emit('search', suggestion.value);

                socket.on('testings', function(data) {
                    console.log(data);
                    console.log('response received on frontend');
                    console.log(data[0]);
                    var thehtml = '<strong>Item: </strong>' + data.item_name + '<br>';
                    thehtml += '<strong>Brand: </strong>' + data.brand_name + '<br>';
                    thehtml += '<strong>Calories: </strong>' + data.nf_calories + '<br>';
                    thehtml += '<strong>Protein: </strong>' + data.nf_protein + '<br>';
                    thehtml += '<strong>Protein / Calorie: </strong>' + 10 * (data.nf_protein / data.nf_calories) + '<br>';
                    $('#outputcontent').html(thehtml);
                });
                //var thehtml = '<strong>Item Name:</strong> ' + suggestion.value;// + ' <br> <strong>Symbol:</strong> ' + suggestion.data;
                //$('#outputcontent').html(thehtml);
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
        //$('#outputcontent').html(thehtml);
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
                socket.emit('suggestion', {q: text});
                searched = true;
            }
        }

        if (autocomplete.value.length < 2 && autocomplete.value.length > 0){
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                socket.emit('suggestion', {q: text});
                searched = false;
            }
        }

        if (autocomplete.value.length == 0){
            searched = false;
        }

        if (window.event.keyCode == '13') {
            var text = autocomplete.value;
            if (!(text in searchDict)) {
                searchDict[text] = text;
                socket.emit('suggestion', {q: text});
                searched = false;
            }
        }
    };

};