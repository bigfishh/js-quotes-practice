const quoteList = document.querySelector("ul#quote-list")
const quoteForm = document.querySelector("#new-quote-form")

// 1. Wrote the fetch 
// 2. Create two helper function 
    // - loop through the array of quotes
    // - render the quotes -> taking the object and turning it into HTML


fetch("http://localhost:3000/quotes?_embed=likes")
.then(resp => resp.json())
.then(quotesArray => {
    quotesArray.forEach(quote => {
        renderQuote(quote)
    });
})

const renderQuote = (quote) => {
    const card = document.createElement("li")
        card.classList.add("quote-card")
        card.dataset.id = quote.id
    const blockquote = document.createElement("blockquote")
        blockquote.classList.add("blockquote")
    const quoteP = document.createElement("p")
        quoteP.classList.add("mb-0")
        quoteP.textContent = quote.quote
    const footer = document.createElement("footer")
        footer.classList.add("blockquote-footer")
        footer.textContent = quote.author
    const quoteBreak = document.createElement("br")
    const likeButton = document.createElement("button")
        likeButton.classList.add("btn-success")
        likeButton.innerHTML = `Likes: <span>${quote.likes.length}</span>`
    const deleteButton = document.createElement("button")
        deleteButton.classList.add("btn-danger")
        deleteButton.textContent = "Delete"

    blockquote.append(quoteP, footer, quoteBreak, likeButton, deleteButton)
    card.append(blockquote)
    quoteList.append(card)


    deleteButton.addEventListener("click", (e) => {
        deleteQuote(quote)
    })

    likeButton.addEventListener("click", (e) => {
        handleButton(card, quote)
    })
}

// 1. Add event listener to the delete button 
// 2. on click write a fetch to delete w/ the quote id
// 3. remove card from DOM 

function deleteQuote(quote) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
    })
    .then(resp => resp.json())
    .then(emptyObj => {
        // card.remove()
        const card = document.querySelector(`[data-id='${quote.id}']`)
        card.remove()
    })
}

function handleButton(card, quote) {
    fetch("http://localhost:3000/likes", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            quoteId: parseInt(card.dataset.id),
            createdAt: Date.now()
        })
    })
    .then(resp => resp.json())
    .then(newLikeObj => {
        quote.likes.push(newLikeObj)
        const likeBtn = card.querySelector(".btn-success")
        const likeSpan = likeBtn.querySelector("span")
        likeSpan.textContent = quote.likes.length
    })
}

quoteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let {author, quote} = e.target 
    fetch("http://localhost:3000/quotes", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }, 
        body: JSON.stringify({
            quote: quote.value,
            author: author.value
        })
    })
    .then(resp => resp.json())
    .then(quoteObj => {
        quoteObj.likes = []
        renderQuote(quoteObj)
    })
    e.target.reset()
})