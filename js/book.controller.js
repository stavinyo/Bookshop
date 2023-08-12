'use strict'

function onInit() {
    renderFilterByQueryParams()
    renderBooks()
}

function renderBooks() {
    var books = getBooks()
    console.log(groupCategory(books))
    var strHeadHTML = `
        <tr>
            <th>ID</th>
            <th>Book Name</th>
            <th>Price</th>
            <th>Rating</th>
            <th>Image</th>
            <th colspan=3 >Actions</th>
        </tr>`
    document.querySelector('.thead-container').innerHTML = strHeadHTML

    var strHTMLs = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td>${book.bookName}</td>
            <td>${book.price}</td>
            <td>${book.rate}</td>
            <td>${book.imgURL}</td>
            <td><button class="btn btn-read" onclick="onReadBook('${book.id}')" type="button">Read</button></td>
            <td><button class="btn btn-update" onclick="onUpdateBook('${book.id}')" type="button">Update</button></td>
            <td><button class="btn btn-delete" onclick="onRemoveBook('${book.id}')" type="button">delete</button></td>
        </tr>`)
    document.querySelector('.tbody-container').innerHTML = strHTMLs.join('')
}

function onAddBook() {
    var newBook = prompt('Book name ?')
    if (!newBook) return
    var newPrice = prompt('Book price ?')
    if (!newPrice) return

    const book = addBook(newBook, newPrice)
    renderBooks()

    alert(`Book Added: 
    id: ${book.id}
    Name: ${book.bookName}
    Price: ${book.price}`)
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)
}

function onReadBook(bookId) {
    renderModal(bookId)
    const book = getBookById(bookId)
    openModal(book)
}

function renderModal(bookId) {
    var strReadHTML = `
            <button class="btn-close" onclick="onCloseModal()">X</button>
            <h1 class="book-name"></h1>
            <ul>
                <li>Id: <span class="book-id"></span></li>
                <li>Price: <span class="book-price"></span></li>
                <li>Image: <span class="book-img"></span></li>
                <li>Rating: <span class="book-rate"></span></li>
                <input type="number" class="btn-rate" onchange="onChangeRate('${bookId}')" name="tentacles" min="0" max="10" />
            </ul>
            <article class="book-summary"></article>`

    const elModal = document.querySelector('.detail-modal')
    elModal.innerHTML = strReadHTML
}

function onUpdateBook(bookId) {
    const book = getBookById(bookId)
    var newPrice = prompt('New price ?', book.price)
    if (!newPrice) return
    updateBook(bookId, newPrice)
    renderBooks()
    flashMsg(`Book Update`)
}

function openModal(book) {
    setElText('book-name', book.bookName)
    setElText('book-id', book.id)
    setElText('book-price', book.price)
    setElText('book-img', book.imgURL)
    setElText('book-rate', book.rate)

    setElText('book-summary', makeLorem())
    removeClass('hide', 'detail-modal')
}

function onCloseModal() {
    addClass('hide', 'detail-modal')
}

function flashMsg(msg) {
    setElText('small-modal', msg)
    removeClass('hide', 'small-modal')

    setTimeout(() => {
        addClass('hide', 'small-modal')
    }, 3000);
}

function onChangeRate(bookId) {
    const elRate = document.querySelector('.btn-rate').value
    console.log('elRate', elRate)
    setElText('book-rate', elRate)
    updateRate(bookId, elRate)
    renderBooks()
}

function onSetFilterBy(filterBy) {
    console.log('filterBy', filterBy)
    filterBy = setFilterBy(filterBy)
    renderBooks()

    const queryParams = `?sortBy=${filterBy.sortBy}&minRate=${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryParams

    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value
    if (!prop) return
    console.log("prop", prop)

    const sortBy = {}
    sortBy[prop] = 1

    setSortBy(sortBy)
    renderBooks()
}

function renderFilterByQueryParams() {
    console.log("bom bom")
    const queryParams = new URLSearchParams(window.location.search)

    console.log("queryParams", queryParams)
    const filterBy = {
        sortBy: queryParams.get('sortBy') || '',
        minRate: +queryParams.get('minRate') || 0
    }

    if (!filterBy.sortBy && !filterBy.minRate) return

    document.querySelector('.sort-by').value = filterBy.sortBy
    document.querySelector('.filter-rate-range').value = filterBy.minRate
    setFilterBy(filterBy)
}

function onNextPage() {
    nextPage()
    renderBooks()
}
function onPrevPage() {
    prevPage()
    renderBooks()
}

function switchMode(mode) {
    const cardModeButton = document.querySelector('.card-mode')
    const tableModeButton = document.querySelector('.table-mode')
    // const modesContainer = document.querySelector('.modes-container')

    if (mode === 'card') {
        cardModeButton.disabled = true
        tableModeButton.disabled = false
    } else if (mode === 'table') {
        cardModeButton.disabled = false
        tableModeButton.disabled = true
    }
}


