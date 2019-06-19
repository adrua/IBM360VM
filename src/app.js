const port = process.env.PORT || 3000;

var express = require('express');
var app = express();
const path = require('path');

app.use('/src', express.static(__dirname));
app.use('/assembler', express.static(path.join(__dirname, '../assembler')));
app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use('/manifest', express.static(path.join(__dirname, '../manifest')));
app.use('/assets', express.static(path.join(__dirname, '../assets')));
app.use('/', express.static(path.join(__dirname, '../')));

app.get('/', function (req, res) {
    res.status(200).sendFile('index.html', { root: path.join(__dirname, '../') });
});

app.listen(port, function()  {
    console.log('Escuchando en el puerto ' + port)
})
