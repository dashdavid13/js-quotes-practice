let ul = document.querySelector("#quote-list")
let form = document.querySelector("#new-quote-form")


fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then((data) =>{
    data.forEach((quoteObj) => {
      renderQuotes(quoteObj)
    })
  })


form.addEventListener("submit", (event) => {
  event.preventDefault();
  
  let author = event.target["author"].value
  let quoteContent = event.target["new-quote"].value

  fetch('http://localhost:3000/quotes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      author: author,
      quote: quoteContent,
    }),
  })
  .then(response => response.json())
  .then(newQuote => {

    newQuote.likes = []
    renderQuotes(newQuote);
  })

});



function renderQuotes(quoteObj){
 let  outerElement = document.createElement("li")
 outerElement.className = "quote-card"

  let block = document.createElement("blockquote")
  block.setAttribute('class', 'blockquote')

  let p = document.createElement("p")
  p.setAttribute('class', 'mb-0')
  p.innerText = quoteObj.quote

  let footer = document.createElement("footer")
  footer.setAttribute('class','blockquote-footer')
  footer.innerText = quoteObj.author

  let likeButton = document.createElement("button")
  likeButton.setAttribute('class', 'btn-success')
  likeButton.innerText = "Likes:"

  let span = document.createElement("span")
  span.innerText = `${quoteObj.likes.length}`


  let deleteButton = document.createElement("button")
  deleteButton.className = "btn-danger"
  deleteButton.textContent = "Delete"

  likeButton.append(span)
  block.append(p,footer,likeButton,deleteButton)
  outerElement.append(block)
  ul.append(outerElement)

 deleteButton.addEventListener("click", (e) => {
   fetch(`http://localhost:3000/quotes/${quoteObj.id}`,{
     method: "DELETE"
   })
   .then(r => r.json())
   .then(() => {
    outerElement.remove()
   })
 })

 likeButton.addEventListener("click", (e) => {

  fetch('http://localhost:3000/likes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quoteId: quoteObj.id
    }),
  })
  .then(response => response.json())
  .then(newLike => {
    quoteObj.likes.push(newLike)
    span.innerHTML = quoteObj.likes.length
  })
 })

};

