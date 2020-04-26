const apiKey = "2abbf7c3-245b-404f-9473-ade729ed4653";

const auth = (req, res, next) => {
  console.log("corrio la autoriazcion");
  if (!req.headers.authorization && !req.query.apiKey && !req.headers["book-api-key"]) {
    res.statusMessage = "Necesitas mandar la llave del API";
    res.status(401).end();
  } else{
    if (req.headers.authorization === `Bearer ${apiKey}` || req.query.apiKey === apiKey || req.headers["book-api-key"] === apiKey){
      next();
    } else{
      res.statusMessage = "LLave del API inválida";
      return res.status(401).end();
    }
  }
};
  module.exports = auth;