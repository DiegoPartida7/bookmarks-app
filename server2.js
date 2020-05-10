const express = require ('express');
const bodyParser = require ('body-parser');
const morgan = require("morgan");
const uuid = require ('uuid');
const jsonParser = bodyParser.json();
const mongoose = require( 'mongoose' );
const cors = require( './cors' );

const { Bookmarks } = require( './bookmarkModel' );

let bookmarks = [
  {
    id: uuid.v4(),
    title: "Facebook",
    description: "videos",
    url: "https://www.facebook.com",
    rating: 10,
  },
  {
    id: uuid.v4(),
    title: "Twitter",
    description: "Tweets",
    url: "https://www.twitter.com",
    rating: 9,
  },
  {
    id: uuid.v4(),
    title: "Instagram",
    description: "Pics",
    url: "https://www.instagram.com",
    rating: 7,
  }
];

const app = express();
app.use( cors );

app.use( express.static( "public" ) );
app.use(morgan("dev"));


const auth = require("./auth");
app.use(auth);

app.get('/bookmarks/',(req,res)=>{
  //   console.log(bookmarks);
  //   return res.status(200).json(bookmarks);
  // });
  // app.get( '/bookmarks/', ( req, res ) => {
  //   console.log( "Getting all bookmarks." );
  
    Bookmarks
      .getAllBookmarks()
      .then( result => {
          return res.status( 200 ).json( result );
      })
      .catch( err => {
          res.statusMessage = "Something is wrong with the Database. Try again later.";
          return res.status( 500 ).end();
      })
  
   });

   app.get('/bookmarks/byTitle/',(req,res)=>{
       let title = req.query.title;
        let searchVar=[];
        if (!title) {
          res.statusMessage = "No mandaste el titulo";
          return res.status(406).end();
        }else{
          Bookmarks
            .getBookmarksByTitle(title)
            .then(d => {
              console.log("Bookmarks", d);
              return res.status(200).json(d);
            })
            .catch(_ => {
                res.statusMessage = "No hubo resultados";
                return res.status(404).end();
          })
        }
        });

app.post('/bookmarks', jsonParser, (req, res) => {
  const {title, description, url, rating} = req.body;

  if (!title || !description || !url || !rating) {
      res.statusMessage = "Field or fields missing in request body";
      return res.status(406).end();
  }
  

  const newBookmark = {
      id: uuid.v4(),
      title: title,
      description: description,
      url: url,
      rating: rating
  }

  Bookmarks
      .createBookmark(newBookmark)
      .then(d => {
        console.log("New Bookmark", newBookmark);
        return res.status(201).json(d);
      })
      .catch(_ => {
          res.statusMessage = "Something went wrong";
          return res.status(500).end();
      });
});


app.delete('/bookmark/:id/',(req,res)=>{
  let id = req.params.id;
  console.log("id", id);
  Bookmarks
    .deleteBookmark(id)
    .then(_ =>{
      return res.status( 200 ).end();
    })
    .catch(_ => {
      res.statusMessage = "El id no existe";
      return res.status(500).end();
  });
    
});

app.patch('/bookmark/:id/',jsonParser, (req,res)=>{
  let id = req.params.id;
  let description = req.body.description;
  let url = req.body.url;
  let rating = req.body.rating;  
  let title = req.body.title;
  let id2 = req.body.id;
  console.log("id", id);
  console.log("id2", id2);

  if (!id2) {
    res.statusMessage = "No mandaste id";
    return res.status(406).end();
  }
  if (id !== id2) {
    res.statusMessage = "Los Id no hacen match";
    return res.status(409).end();
  } else{
    Bookmarks
      .patchBookmark(id,title,description,url,rating)
      .then(result =>{
        return res.status( 202 ).json( result );
      })
      .catch(_ => {
        res.statusMessage = "No existe un bookmark con ese id";
        return res.status(404).end();
    });

  }
});

// app.patch('/bookmark/:id/',jsonParser, (req,res)=>{
//   let id = req.params.id;
//   let description = req.body.description;
//   let url = req.body.url;
//   let rating = req.body.rating;  
//   let title = req.body.title;
//   let id2 = req.body.id;
//   if (!id) {
//     res.statusMessage = "El id no existe";
//     return res.status(406);
//   }
//   if (id !== id2) {
//     res.statusMessage = "Los Id no hacen match";
//     return res.status(409).end();
//   } else{

//     let book = bookmarks.find(i => {
//       if (i.id === id) {
//         return i;
//       }
//     });

//     if (!book) {
//       res.statusMessage = "No existe un bookmark con ese Id";
//       return res.status(404).end();
//     }

//     if (title) {
//       book.title = title;
//     }

//     if (description) {
//       book.description = description;
//     }

//     if (url) {
//       book.url = url;
//     }

//     if (rating) {
//       book.rating = Number(rating);
//     }

//     res.status(202).json(book);
//     }
// });


app.listen( 8080, () => {
  console.log( "This server is running on port 8080" );

  new Promise( ( resolve, reject ) => {

      const settings = {
          useNewUrlParser: true, 
          useUnifiedTopology: true, 
          useCreateIndex: true
      };
      mongoose.connect( 'mongodb://localhost/bookmarksdb', settings, ( err ) => {
          if( err ){
              return reject( err );
          }
          else{
              console.log( "Database connected successfully." );
              return resolve();
          }
      })
  })
  .catch( err => {
      console.log( err );
  });
});

// let bookmarks = [
//   {
//     "title" : "prueba",
//     "description" : "esta es una prueba",
//     "url" : "lol",
//     "rating" : 10,
//     "id" : "123"
//   },
//   {
//     "title" : "cod",
//     "description" : "warzone",
//     "url" : "lolazo",
//     "rating" : 10,
//     "id" : "1234"
//   },
//   {
//     "title" : "prueba2",
//     "description" : "esta es una prueba 2",
//     "url" : "lol 2",
//     "rating" : 10,
//     "id" : "12345"
//   }
// ];


  //  app.get('/bookmarks/byTitle/',(req,res)=>{
  //   let title = req.query.title;
  //   let searchVar=[];
  //   if (!title) {
  //     res.statusMessage = "No mandaste el titulo";
  //     return res.status(406).end();
  //   }else{
  //   bookmarks.filter((titles)=>{
  //   if (title == titles.title) {
  //     searchVar.push(titles);
  //   }
  //   });
  
  //   if(searchVar.length<1){
  //     res.statusMessage= "El bookmark con el titulo ingresado no existe";
  //     return res.status(404).end();
  //   } else{
  //     return res.status(200).json(searchVar);
  //   }
  // }
  // });
  
// app.post('/bookmarks/',jsonParser, (req,res) =>{
//   // let id = req.body.id;
//   let title = req.body.title;
//   console.log("body", req.body);
//   console.log(title);
//   let description = req.body.description;
//   let url = req.body.url;
//   let rating = req.body.rating;  
//   let id = uuid.v4();
//   console.log(title,description,url,rating);
//   if (!title || !description || !url || !rating) {
//     res.statusMessage = "One of the params is missing";
//     return res.status(406).end();
    
//   } else {

//     let newBookmark = {id,title,description,url,rating};
//     bookmarks.push(newBookmark);
//     console.log("New Bookmark", newBookmark);
//     return res.status(201).json(newBookmark);
//   }
// });

// app.delete('/bookmark/:id/',(req,res)=>{
//   let id = req.params.id;

//   let result = bookmarks.findIndex((book)=>{
//     console.log(book);
//     console.log(book.id);
//     console.log(id);
//     if (book.id == id) {
//       return true;
//     }
//   });
//   if( result < 0 ){
//     res.statusMessage = "That 'id' was not found in the list of bookmarks.";
//     return res.status( 400 ).end();
//   } else{
//     bookmarks.splice( result, 1 );
//     return res.status( 200 ).end();
//   }
// });