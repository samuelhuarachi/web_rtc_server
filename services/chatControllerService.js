let {
    ChatControllerCollection
} = require('../db');

const addRoom = (slug, socketID) => {

    let chatControllerSchema = new ChatControllerCollection({
        slug,
        socketID
    })

    chatControllerSchema.save()
}

const getAll = async () => {
    let allChat = await ChatControllerCollection.find({})
    return allChat
}

const getBySlug = async (slug) => {
    let chat = await ChatControllerCollection.findOne({
        slug
    })
    return chat
}

const removeBySocketID = async (socketID) => {
    return await ChatControllerCollection.deleteOne({
        socketID
    })
}

const removeWhenDisconnectedBySocketID = async (socketID) => {
    let findChatController = await ChatControllerCollection.
    findOne({
        socketID: socketID
    })

    if (findChatController) {
        return findChatController.remove()
    }
}

module.exports = {
    addRoom,
    getAll,
    removeBySocketID,
    removeWhenDisconnectedBySocketID,
    getBySlug
}