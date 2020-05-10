const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

function firstBookmarks() {
    console.log("funcion");
    const settings = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${API_TOKEN}`
        }
    }
    fetch("/bookmarks", settings)
        .then(response => {
            console.log("funcion2");
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.statusText);
            }
        })
        .then(responseJson => {
            document.querySelector(".results").innerHTML = "";
                responseJson.forEach(element => {
                    document.querySelector(".results").innerHTML += `
                    <div>
                        <p>
                            ID: ${element.id}
                        </p>
                        <p>
                            Title: ${element.title}
                        </p>
                        <p>
                            Description: ${element.description}
                        </p>
                        <p>
                            URL: ${element.url}
                        </p>
                        <p>
                            Rating: ${element.rating}
                        </p>
                        <hr>
                    </div>
                `;
                });
        })
        .catch(err => {
            document.querySelector(".results").innerText = err.message;
        });
}


function addbookmarkFech( title, description, url, rating){
    // let url = '/api/createbookmark';

    let data = {
        title : title,
        description: description,
        url: url,
        rating:rating
    }

    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector( '.results' );

    fetch( `/bookmarks`, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJSON => {
            fetchbookmarks();
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
}

function fetchbookmarks(){

    let url = '/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    let results = document.querySelector( '.results' );

    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                return response.json();
            }
            throw new Error( response.statusText );
        })
        .then( responseJson => {
            results.innerHTML = "";
            document.querySelector(".results").innerHTML = "";
                responseJson.forEach(element => {
                    document.querySelector(".results").innerHTML += `
                    <div>
                        <p>
                            ID: ${element.id}
                        </p>
                        <p>
                            Title: ${element.title}
                        </p>
                        <p>
                            Description: ${element.description}
                        </p>
                        <p>
                            URL: ${element.url}
                        </p>
                        <p>
                            Rating: ${element.rating}
                        </p>
                        <hr>
                    </div>
                `;
                });
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });
    
}


function deleteBookmark(id){
    let results = document.querySelector( '.results' );
    let url = `/bookmark/${id}/`;
    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }
    fetch( url, settings )
        .then( response => {
            if( response.ok ){
                results.innerHTML = '';
                fetchbookmarks();
                return response.json;
            }
            throw new Error( response.statusText );
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}

function updateBookmark(newId,title,description,url2,rating){
    console.log("funcion3");

    let results = document.querySelector( '.results' );
    let url = `/bookmark/${newId}/`;
    let data = {
        id : newId,
        title : title,
        description: description,
        url: url2,
        rating:rating
    }
    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            "Content-Type": "application/json"
        },
            body : JSON.stringify( data )
    }
    fetch( `/bookmark/${newId}`, settings )
        .then( response => {
            console.log("funcion4");

            if( response.ok ){
                return response.json();
            } else{
                throw new Error( response.statusText );
            }
        })
        .then (newResponse =>{
            console.log("funcion5");

            results.innerHTML = "";
            results.innerHTML += `
                <div>
                    <p>
                        ID: ${newResponse.id}
                    </p>
                    <p>
                        Title: ${newResponse.title}
                    </p>
                    <p>
                        Description: ${newResponse.description}
                    </p>
                    <p>
                        URL: ${newResponse.url}
                    </p>
                    <p>
                        Rating: ${newResponse.rating}
                    </p>
                    <hr>
                </div>
            `;
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}
function watchUpdateForm(){
    let bookmarksForm = document.querySelector( '.update-bookmark-form' );

    bookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let newId = document.getElementById('bookmarkId').value;
        let title = document.getElementById('bookmarkTitle').value;
        let description = document.getElementById('bookmarkDescription').value;
        let url2 = document.getElementById('bookmarkUrl').value;
        let rating = document.getElementById('bookmarkRating').value;

        updateBookmark(newId,title,description,url2,rating);
    });
}

function watchDeleteForm(){
    let bookmarksForm = document.querySelector( '.delete-bookmark-form' );

    bookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();
        let id = document.getElementById('bookmarkId').value;

        deleteBookmark(id);
    });
}


function watchbookmarksForm(){
    let bookmarksForm = document.querySelector( '.bookmarks-form' );

    bookmarksForm.addEventListener( 'submit', ( event ) => {
        event.preventDefault();

        fetchbookmarks();
    });
}

function watchAddbookmarkForm(){
    let bookmarksForm = document.querySelector( '.add-bookmark-form' );

    bookmarksForm.addEventListener( 'submit' , ( event ) => {
        event.preventDefault();
        let title = document.getElementById( 'bookmarkTitle' ).value;
        let description = document.getElementById( 'bookmarkDescription' ).value;
        let url = document.getElementById( 'bookmarkUrl' ).value;
        let rating = document.getElementById( 'bookmarkRating' ).value;

        addbookmarkFech( title, description, url, rating );
    });
}

function init(){
    firstBookmarks();
    watchbookmarksForm();
    watchAddbookmarkForm();
    watchDeleteForm();
    watchUpdateForm();
}

init();