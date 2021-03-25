process.env.TZ = "America/Sao_Paulo";

const app = require("express")();
const http = require("http").createServer(app);

const io = require("socket.io")(http);
const bodyParser = require("body-parser");
var cors = require("cors");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(cors());



require("./api/client")(app);



var port = process.env.PORT || 3001;
http.listen(port, function () {
  console.log("Listening on port " + port);
});







// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
