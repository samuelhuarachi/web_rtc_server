
const {
    AnalistCollection
  } = require("../db");


const newAnalistHelp = async (name, lastname, slug, password, _token) => {

    let newAnalist = new AnalistCollection({
        name,
        lastname,
        slug, // nao pode haver 2 slugs iguais no mongodb
        password,
        _token
    });

    const analistCreated = await newAnalist.save();
    return analistCreated;
  };

const getBySlug = async (slug) => {
  return await AnalistCollection.
  findOne({
      slug
  })
}


  module.exports = {
    newAnalistHelp,
    getBySlug
  };