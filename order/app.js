/**
 * Le fichier principal du microservice des commandes.
 * @author GAURE Warren
 * @version 1.0
*/

require("dotenv").config();

const app = require('../shared/config/appConfig');

const port = process.env.ORDER_PORT || 3005;

app.get('/hello', function(req, res) {
    res.send("Hello World !");
});

app.listen(port, function() {
    console.log(`Listens to port ${port}`);
});