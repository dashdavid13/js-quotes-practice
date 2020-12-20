// Get all quotes 
const quoteCollection = document.querySelector("ul#quote-list")
const form = document.querySelector("form#new-quote-form")

function renderOneQuote(quoteObj) {
    let likes = 0
    if (quoteObj.likes) {
    likes = quoteObj.likes.length
    }

    
    const li = document.createElement("li")
    li.className = "quote-card"
    li.innerHTML = `
    <blockquote class="blockquote">
    <p class="mb-0">${quoteObj.quote}</p>
    <footer class="blockquote-footer">${quoteObj.author}</footer>
    <br>
    <button class='btn-success'data-id= "${quoteObj.id}">Likes: <span>${likes}</span></button>
    <button class='btn-danger' data-id= "${quoteObj.id}">Delete</button>
    </blockquote>
    `
    quoteCollection.append(li)
  }
  
  
  
  function getQuotes() {
    return fetch("http://localhost:3000/quotes?_embed=likes")
    .then(res => res.json()) 
}
    getQuotes().then(quotesArray => {
        quotesArray.forEach(quotesArray => {
            renderOneQuote(quotesArray)
        }) 
    }) 

// Render a new form for a new quote

form.addEventListener("submit", function (event) {
    event.preventDefault();
  
    const newQuoteObject = {
      quote: event.target.quote.value,
      author: event.target.author.value,
      likes: 0,
    };
  
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuoteObject),
    })
      .then((response) => response.json())
      .then((actualNewQuoteFromServer) => {
        console.log("Success:", actualNewQuoteFromServer);
        // and slap the new post on the DOM
        renderOneQuote(actualNewQuoteFromServer);
      });
  
    event.target.reset();
  });

//  Like button 

quoteCollection.addEventListener("click", event => {
    if (event.target.matches(".btn-success")) {
        
        
      const id = parseInt(event.target.dataset.id)
      const newLikeObj = {
        quoteId: id
      }

      createLike(newLikeObj)

      const span = event.target.querySelector("span")
      const numberOfLikes = parseInt(span.textContent) + 1
      span.textContent = numberOfLikes
  
    
     
  }
})
  




// Delete button 
quoteCollection.addEventListener("click", event => {
    if (event.target.matches(".btn-danger")) {
        const id = event.target.dataset.id
        const quoteLi = event.target.closest(".quote-card")
        deleteQuote(id)
        quoteLi.remove()
    }
})



// like fetch function 
function createLike(likeObj){
fetch(`http://localhost:3000/likes`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(likeObj),
})
  .then(response => response.json())
  .then(data => {
      console.log(data)
  })

}

function deleteQuote(id) {
    fetch (`http:localhost:3000/quotes/${id}`, {
        method: 'DELETE',
    })
}
