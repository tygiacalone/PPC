var x = 3;

var socket = io.connect('http://localhost:3700');

window.onload = function() {

    socket.emit('test', { q: 'ham'});

    socket.on('results', function (data) {
        console.log(data);
        console.log('results received');
        for (var i = 0; i < data.length; i++) {
            var text = data[i].text;
            console.log(text);
        }
    });
}