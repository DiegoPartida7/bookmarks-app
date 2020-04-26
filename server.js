const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require("morgan");
const uuid = require ('uuid');
const jsonParser = bodyParser.json();
const app = express();
app.use(morgan("dev"));

const auth = require("./auth");
app.use(auth);

let bookmarks = [
  {
    "title" : "prueba",
    "description" : "esta es una prueba",
    "url" : "lol",
    "rating" : 10,
    "id" : "123"
  },
  {
    "title" : "cod",
    "description" : "warzone",
    "url" : "lolazo",
    "rating" : 10,
    "id" : "1234"
  },
  {
    "title" : "prueba2",
    "description" : "esta es una prueba 2",
    "url" : "lol 2",
    "rating" : 10,
    "id" : "12345"
  }
];

app.post('/bookmarks/',jsonParser, (req,res) =>{
  // let id = req.body.id;
  let title = req.body.title;
  console.log("body", req.body);
  console.log(title);
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;  
  let id = uuid.v4();
  console.log(title,description,url,rating);
  if (!title || !description || !url || !rating) {
    res.statusMessage = "One of the params is missing";
    return res.status(406).end();
    
  } else {

    let newBookmark = {id,title,description,url,rating};
    bookmarks.push(newBookmark);
    console.log("New Bookmark", newBookmark);
    return res.status(201).json(newBookmark);
  }
});

app.delete('/bookmark/:id/',(req,res)=>{
  let id = req.params.id;

  let result = bookmarks.findIndex((book)=>{
    console.log(book);
    console.log(book.id);
    console.log(id);
    if (book.id == id) {
      return true;
    }
  });
  if( result < 0 ){
    res.statusMessage = "That 'id' was not found in the list of bookmarks.";
    return res.status( 400 ).end();
  } else{
    bookmarks.splice( result, 1 );
    return res.status( 200 ).end();
  }
});


app.get('/bookmarks/',(req,res)=>{
  console.log(bookmarks);
  return res.status(200).json(bookmarks);
});


app.get('/bookmarks/byTitle/',(req,res)=>{
  let title = req.query.title;
  let searchVar=[];
  if (!title) {
    res.statusMessage = "No mandaste el titulo";
    return res.status(406).end();
  }else{
  bookmarks.filter((titles)=>{
  if (title == titles.title) {
    searchVar.push(titles);
  }
  });

  if(searchVar.length<1){
    res.statusMessage= "El bookmark con el titulo ingresado no existe";
    return res.status(404).end();
  } else{
    return res.status(200).json(searchVar);
  }
}
});


app.patch('/bookmark/:id/',jsonParser, (req,res)=>{
  let id = req.params.id;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;  
  let title = req.body.title;
  let id2 = req.body.id;
  if (!id) {
    res.statusMessage = "El id no existe";
    return res.status(406);
  }
  if (id !== id2) {
    res.statusMessage = "Los Id no hacen match";
    return res.status(409).end();
  } else{

    let book = bookmarks.find(i => {
      if (i.id === id) {
        return i;
      }
    });

    if (!book) {
      res.statusMessage = "No existe un bookmark con ese Id";
      return res.status(404).end();
    }

    if (title) {
      book.title = title;
    }

    if (description) {
      book.description = description;
    }

    if (url) {
      book.url = url;
    }

    if (rating) {
      book.rating = Number(rating);
    }

    res.status(202).json(book);
    }
});


app.listen(8080, ()=>{
  console.log("The server is up and running");
});














































// let listOfStudents = [
//   {
//     name : "Marcel",
//     id : 123
//   },
//   {
//     name : "Martha",
//     id : 456
//   },
//   {
//     name : "Julieta",
//     id : 789
//   },
//   {
//     name: "Alfredo",
//     id : 847
//   }
// ];


// app.get('/api/students',(req,res)=>{
//   console.log("Getting students");
//   return res.status(200).json(listOfStudents);
// });

// app.get('/api/studentById',(req,res)=>{
//   console.log(req.query);
//   console.log("Getting students by ID");
//   return res.status(200).json({});
// });

// app.post('/api/createStudent',jsonParser,(req,res)=>{
//   console.log( "Getting a student by id using the integrated param." );
//   console.log( req.body );
//   return res.status(200).json({});
// });

