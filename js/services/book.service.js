const STORAGE_KEY = 'bookDB'
const PAGE_SIZE = 5
var gPageIdx = 0

var gFilterBy = { sortBy: '', minRate: 0 }
var gBooks = [
    'To Kill a Mockingbird',
    'The Great Gatsby',
    'Ulysses',
    'The Catcher in the Rye',
    'Pride and Prejudice',
    'Adventures of Huckleberry Finn',
    'Alice’s Adventure in Wonderland',
    'To the Lighthouse',
]

_createBooks()

function _createBook(bookName, imgURL) {
    return {
        id: makeId(),
        bookName,
        price: getRandomInt(30, 121),
        rate: 0,
        imgURL,
    }
}


// FIXME: bookName - change to a real books names
function _createBooks() {

    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []

        for (let i = 0; i < gBooks.length; i++) {
            var bookName = gBooks[i]
            var imgURL = '📸'
            books.push(_createBook(bookName, imgURL))
        }
    }
    gBooks = books
    _saveCarsToStorage()
}


function _saveCarsToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}


// TODO: use filter in this func
function getBooks() {
    var books = gBooks.filter(book =>
        book.rate >= gFilterBy.minRate)


    var startIdx = gPageIdx * PAGE_SIZE
    books = gBooks.slice(startIdx, startIdx + PAGE_SIZE)
    return books
}

function nextPage() {
    gPageIdx++;
    console.log("gPageIdx", gPageIdx)
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        // gPageIdx = Math.floor((gBooks.length - 1) / PAGE_SIZE)
        gPageIdx--
        return
    }
}

function prevPage() {
    gPageIdx--
    console.log("gPageIdx", gPageIdx)
    if (gPageIdx < 0) {
        gPageIdx = 0
    }
}

function removeBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveCarsToStorage()
}

function addBook(newBook, price) {
    const book = _createBook(newBook, price, 'fix')
    gBooks.unshift(book)
    _saveCarsToStorage()
    return book
}

function updateBook(bookId, newPrice) {
    const currBook = gBooks.find(book => bookId === book.id)
    currBook.price = newPrice
    _saveCarsToStorage()
    return
}




function updateRate(bookId, newRate) {
    const currBook = gBooks.find(book => bookId === book.id)
    currBook.rate = newRate
    _saveCarsToStorage()
    return
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function setFilterBy(filterBy = {}) {
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.sortBy !== undefined) gFilterBy.sortBy = filterBy.sortBy

    console.log('filterBy.minRate', filterBy.minRate)
    console.log('filterBy.sortBy', filterBy.sortBy)

    return gFilterBy
}

function setSortBy(sortBy = {}) {
    if (sortBy.name !== undefined) {
        gBooks.sort((book1, book2) => book1.bookName.localeCompare(book2.bookName) * sortBy.name)
    } else if (sortBy.price !== undefined) {
        gBooks.sort((book1, book2) => (book1.price - book2.price) * sortBy.price)
    }

}

function groupCategory(books) {

    return books.reduce((map, book) => {
        if (book.price > 100) map.expensive++
        else if (book.price > 65) map.normal++
        else map.cheap++

        return map
    }, { expensive: 0, normal: 0, cheap: 0, })
}


