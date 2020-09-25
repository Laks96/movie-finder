import '../css/style.css'
import SearchMovie from './models/SearchMovie'
import * as domElements from './base'
import * as SearchMovieView from './views/SearchMovieView'
import { compareMovieView, compareValues } from './views/CompareMovieView'
import { SingleMovie } from './models/SingleMovie'
import { singleMovieView } from './views/SingleMovieView'
import { createHashHistory } from 'history';
import CompareMovie from './models/CompareMovie'
import AutoComplete from './models/AutoComplete'
import * as autoCompleteView from './views/AutoCompleteView'
import { card } from '../shared/Card'
let history = createHashHistory();

/* ROUTING */

history.listen(({ location, action }) => {
    console.log(location)
    switch (location.pathname) {
        case '/':
            window.location.reload()
            break;
        case '/movies':
            const query = new URLSearchParams(location.search).get('searched')
            controlSearch(query)
            break;
        case 'about':
            console.log('about')
            break;
        case '/compare-movies':
            const first = new URLSearchParams(location.search).get('first')
            const second = new URLSearchParams(location.search).get('second')

            if (first) {
                controlCompareMovie(first, 'first')
            }

            else if (second) {
                controlCompareMovie(second, 'second')
            }

            else {
                controlCompareMovie()
            }
            break;
        case 'favourite':
            console.log('about')
            break;
        case '/single-movie':
            const movieId = new URLSearchParams(location.search).get('movieId')
            controlSingleMovie(movieId)
            break;
        default:
            break;
    }

});

/* ONLOAD ROUTING */
window.addEventListener('load', e => {
    switch (history.location.pathname) {
        case '/movies':
            if (history.location.search) {
                history.push({
                    pathname: history.location.pathname,
                    search: history.location.search
                })
            }
            break;

        case '/single-movie':
            if (history.location.search) {
                history.push({
                    pathname: history.location.pathname,
                    search: history.location.search
                })
            }
        case '/compare-movies':
        default:
            break;
    }

})

/* CENTRAL STATE */
const state = {}

/* CONTROL SEARCH - LANDING PAGE */
const controlSearch = async (input) => {

    const query = input

    if (query) {
        state.searchMovie = new SearchMovie(query)
        await state.searchMovie.getMovies(query)
        SearchMovieView.renderSearchView(state.searchMovie.moviesData)
    }

}
/* ON SEARCH - LANDING PAGE */
domElements.searchForm.addEventListener('submit', event => {
    event.preventDefault()
    history.push(
        {
            pathname: '/movies',
            search: `?searched=${SearchMovieView.getInput()}`
        }
    )
})

/* CONTROL SINGLE MOVIE */
const controlSingleMovie = async (id) => {

    try {
        if (id) {
            state.singleMovie = new SingleMovie(id)
            await state.singleMovie.getSingleMovie()
            singleMovieView(state.singleMovie.singleMovieData)
        }

    } catch (error) {

    }
}

/* ON SINGLE MOVIE CLICK */
domElements.contentDiv.addEventListener('click', e => {
    const card = e.target.closest('.card-img')
    if (card) {
        let singleMovieId = card.dataset.movieid
        history.push({
            pathname: '/single-movie',
            search: `?movieId=${singleMovieId}`

        })
    }
})

/* CONTROL COMPARE MOVIE */
const controlCompareMovie = async (id, sideInput) => {
    //Check if id is valid
    if (id) {
        state.compareSingleMovie = new CompareMovie(id)
        //Right side
        if (sideInput === 'first') {
            await state.compareSingleMovie.getSingleMovieCompare(id)

            //Check if compare movie container alredy exist.
            if (document.querySelector('.compare-movie-container')) {
                compareValues(state.compareSingleMovie.movieToCompare, 'first')
                // Set input value to value of clicked movie title.
                document.querySelector('.autocomplete-left').value = state.compareSingleMovie.movieToCompare.Title;
            }
            else {
                //If it not exist make html strcture and put the movie on it.
                compareMovieView()
                compareValues(state.compareSingleMovie.movieToCompare, 'first')
                // Set input value to value of clicked movie title.
                document.querySelector('.autocomplete-left').value = state.compareSingleMovie.movieToCompare.Title;
            }
        }

        //Left side
        else {
            await state.compareSingleMovie.getSingleMovieCompare(id)
            document.querySelector('.autocomplete-right').value = state.compareSingleMovie.movieToCompare.Title;
            if (document.querySelector('.compare-movie-container')) {
                compareValues(state.compareSingleMovie.movieToCompare, 'second')

            }
            else {
                compareMovieView()
                compareValues(state.compareSingleMovie.movieToCompare, 'second')

            }
        }
    }

    else {
        //If there is no Id thaht means - user just click the navigation item and we need just HTML.
        compareMovieView()
    }
}

/* LEFT MOVIE - COMPARE - CARD*/

domElements.contentDiv.addEventListener('click', event => {

    const cardButton = event.target.closest('.btn-compare')


    if (cardButton) {
        const id = cardButton.dataset.movieid
        history.push({
            pathname: '/compare-movies',
            search: `?first=${id}`
        })
    }
})


/* LEFT MOVIE - COMPARE - SINGLE CARD */
domElements.contentDiv.addEventListener('click', event => {

    const inCardBtn = event.target.closest('.btn-singleMovie-compare')


    if (inCardBtn) {
        const id = inCardBtn.dataset.movieid
        history.push({
            pathname: '/compare-movies',
            search: `?first=${id}`
        })
    }
})


/* AUTOCOMPLETE */
const controlAutoComplete = async (query, side) => {
    //Clear results and old class
    autoCompleteView.clearResults(side)
    // Toggle dropdown active or isActive
    autoCompleteView.toggleClass(side, query !== '')

    if (query) {
        try {
            if (!state.autoComplete) {
                state.autoComplete = new AutoComplete(query)
            }

            await state.autoComplete.getAutoCompleteData(query)
            autoCompleteView.toggleClass(side, state.autoComplete.autocompleteList)
            if (state.autoComplete.autocompleteList) {
                //remove dropdown if results are undefined
                autoCompleteView.dropDownMenu(state.autoComplete.autocompleteList, side)

            }

            if (state.autoComplete.autocompleteList.Error) {
                alert(state.autoComplete.autocompleteList.Error)
            }
        } catch (error) {

        }
    }


}

/* ONSEARCH IN COMPARE */
let timeoutId;
domElements.contentDiv.addEventListener('input', e => {
    const input = e.target.closest('.compare-movie-input ')

    let setSide = ''

    if (input) {
        e.target.classList.contains('autocomplete-left') ?
            setSide = 'left' :
            setSide = 'right';

        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        timeoutId = setTimeout(() => {
            controlAutoComplete(e.target.value, setSide)

        }, 1000);
    }
})

/* HANDLE MOVIE CLICK IN DROPDOWN */
domElements.contentDiv.addEventListener('click', e => {
    const item = e.target.closest('.dropDownItem')


    if (item) {
        const id = item.dataset.movieid
        let setSide = ''
        console.log(item.parentNode.classList)
        item.parentNode.classList.contains('dropdown-left') ?
            setSide = 'first' :
            setSide = 'second';
        history.push({
            pathname: '/compare-movies',
            search: `?${setSide + '=' + id}`
        })
    }
})

/* CLOSE DROPDOWN */

document.addEventListener('click', e => {
    const summary = document.querySelector('.summary')
    if (summary) {
        if (!summary.contains(e.target)) {
            document.querySelector('.dropdown-right').classList.add('isActive')
            document.querySelector('.dropdown-left').classList.add('isActive')
        }
    }

})

