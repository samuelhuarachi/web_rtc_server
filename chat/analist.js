const chatControllerService = require('../services/chatControllerService');
// const analistService = require('../services/analistsServices')
const db = require('../db')


exports = module.exports = function (io) {
    io.sockets.on('connection', function (socket) {

        socket.on('register_analist', async (data) => {
            console.log("registrando analista.... ...")
            //console.log(analistToken)

            const dataParce = JSON.parse(data)

            const analistFind = await db.AnalistCollection.findOne({
                _token: dataParce.token
            })

            console.log(analistFind)

            if (!analistFind) {
                return;
            }

            /**
             * procuro o analista no chatcontroller, e removo pelo slug
             */
            let findAnalistInChat = await db.ChatControllerCollection.find({
                slug: analistFind.slug
            })

            findAnalistInChat.forEach(async function (elem) {
                await elem.remove()
            })

            /**
             * adiciono a nova no mongo
             */
            chatControllerService.addRoom(analistFind.slug, socket.id)
        })
    })
}