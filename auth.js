const {APIKEY} = require("../config");

const auth = (req, res, next) => {
  console.log("corrio la autoriazcion");
  if (!req.headers.authorization && !req.query.apiKey && !req.headers["book-api-key"]) {
    res.statusMessage = "Necesitas mandar la llave del API";
    res.status(401).end();
  } else{
    if (req.headers.authorization === `Bearer ${APIKEY}` || req.query.apiKey === APIKEY || req.headers["book-api-key"] === APIKEY){
      next();
    } else{
      res.statusMessage = "LLave del API inválida";
      return res.status(401).end();
    }
  }
};
  module.exports = auth;