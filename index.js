process.env.TZ = "America/Sao_Paulo";

const app = require("express")();
const http = require("http").createServer(app);

const io = require("socket.io")(http);
const bodyParser = require("body-parser");
var cors = require("cors");
var faker = require("faker");
const analistsServices = require("./services/analistService");
const chatControllerService = require("./services/chatControllerService")

let {
  RoomClientCollection
} = require("./db");


let { 
  newAnalistHelp
} = require("./services/analistService")

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);
app.use(cors());


require("./api/client")(app);
require("./chat/analist")(io);

var port = process.env.PORT || 3001;
http.listen(port, function () {
  console.log("Listening on port " + port);
});

io.on("connection", (socket) => {

  socket.on("receive_client", async () => {
    socket.broadcast.emit("msg", "client send test message from server");
  })

  socket.on("INeedAnalistOffer", async () => {

    const slug = Object.keys(io.sockets.adapter.sids[socket.id]).filter(
        (item) => item != socket.id
    );

    // Executar a linha abaixo, apenas para criar novos analistas no sistema
    // newAnalistHelp("samuel", "gomes", "samuel-gomes", "senha123", "token1") 
    // newAnalistHelp("luisa", "pereira", "luisa-pereira", "senhaluisa", "token2") 

    const analist = await chatControllerService.getBySlug(slug);

    const analistFind = await analistsServices.getBySlug(analist.slug)
    if (!analistFind) {
        return
    }

    io.to(analist.socketID).emit("generateAnalistOffer", socket.id)
  })

  socket.on("join-in-room", async (objectJoin) => {
    const slug = objectJoin.slug;

    const findAnalist = await analistsServices.getBySlug(slug);
    if (!findAnalist) {
        return;
    }

    socket.join(slug);

    // se tiver um token,
    // ele procura o usuario com esse token
    // na roomclient, e apaga ele
    // para logo em seguida, adicionar o novo
    let findClientInRoom = null;
    if (objectJoin.token) {
        findClientInRoom = await RoomClientCollection.find({
            token: objectJoin.token,
            slug,
        });
    } else {
        findClientInRoom = await RoomClientCollection.find({
            socketID: socket.id,
        });
    }

    // isso aqui soh eh executado quando o cliente esta logado
    // para mantermos 1 socket id no sistema
    if (findClientInRoom) {
        findClientInRoom.forEach(async function (elem) {
            await elem.remove();
        });
    }

    let roomClient = new RoomClientCollection({
        slug: slug,
        socketID: socket.id,
        created_at: new Date(),
        nickname: faker.internet.userName(),
        token: objectJoin.token,
    });
    await roomClient.save();

  });

  socket.on("sendNewAnalistOffer", async(data) => {
    const analistFind = await analistsServices.getBySlug(JSON.parse(data).slug)

    if (!analistFind) {
        return
    }

    const dataParse = JSON.parse(data);
    io.to(dataParse.clientId).emit("sendAnalistOfferToClient", data);
  });

  socket.on("sendClientSDP", async (data) => {
    const slug = Object.keys(io.sockets.adapter.sids[socket.id]).filter(
        (item) => item != socket.id
    );

    const analist = await chatControllerService.getBySlug(slug);

    io.to(analist.socketID).emit("receiveClientSDP", data);
  });

  socket.on("sendAnalistICE", (data) => {
    const dataParse = JSON.parse(data);
    io.to(dataParse.clientId).emit("receiveAnalistICE", data);
  });
  
})



// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))
