document.addEventListener('DOMContentLoaded', function() {
  fetchQuotes();

  const newQuoteForm = document.getElementById('new-quote-form');
  newQuoteForm.addEventListener('submit', createQuote);

  function fetchQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
      .then(response => response.json())
      .then(quotes => {
        quotes.forEach(quote => displayQuote(quote));
      });
  }

  function displayQuote(quote) {
    const quoteList = document.getElementById('quote-list');

    const li = document.createElement('li');
    li.className = 'quote-card';

    const blockquote = document.createElement('blockquote');
    blockquote.className = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0';
    p.textContent = quote.quote;

    const footer = document.createElement('footer');
    footer.className = 'blockquote-footer';
    footer.textContent = quote.author;

    const likeButton = document.createElement('button');
    likeButton.className = 'btn-success';
    likeButton.textContent = `Likes: ${quote.likes.length}`;
    likeButton.addEventListener('click', () => addLike(quote.id));

    const deleteButton = document.createElement('button');
    deleteButton.className = 'btn-danger';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteQuote(quote.id, li));

    blockquote.append(p, footer, document.createElement('br'), likeButton, deleteButton);
    li.appendChild(blockquote);
    quoteList.appendChild(li);
  }

  function createQuote(e) {
    e.preventDefault();

    const newQuote = e.target.elements['new-quote'].value;
    const author = e.target.elements.author.value;

    fetch('http://localhost:3000/quotes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quote: newQuote,
        author: author,
      }),
    })
    .then(response => response.json())
    .then(quote => {
      quote.likes = [];
      displayQuote(quote);
    });
  }

  function deleteQuote(id, li) {
    fetch(`http://localhost:3000/quotes/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      li.remove();
    });
  }

  function addLike(quoteId) {
    fetch('http://localhost:3000/likes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteId: quoteId,
        createdAt: Math.floor(Date.now() / 1000),
      }),
    })
    .then(() => {
      fetchQuotes();
    });
  }
});
