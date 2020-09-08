import '../css/style.css'
import SearchMovie from './models/SearchMovie'



// central state of app
const state = {}



const controlSearch = async () => {

    const query = 'batman'

    if (query) {
        state.searchMovie = new SearchMovie(query)
        
        await state.searchMovie.getMovies(query)
    }

}


controlSearch()













//onhashchange routing 

window.addEventListener('hashchange', e => {
    const hash = window.location.hash.replace('#', '')
    switch (hash) {
        case 'about':
            console.log('aboutttttt')
            break;
        case 'compare-movies':
            console.log('Compare Movies')
            break;
        case 'favourite':
            console.log('favourite')
            break;

        default:
            console.log('error 404')
            break;
    }
})

//onload routing

window.addEventListener('load', e => {
    const hash = window.location.hash.replace('#', '')
    switch (hash) {
        case 'about':
            console.log('aboutttttt')
            break;
        case 'compare-movies':
            console.log('Compare Movies')
            break;
        case 'favourite':
            console.log('favourite')
            break;
        case '':
            break;

        default:
            console.log('error 404')
            break;
    }
})