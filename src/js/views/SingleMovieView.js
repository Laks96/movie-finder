import * as domElements from '../base'




export const singleMovieView = (movieData, checkClassFavourite) => {


    const singleMovie = domElements.contentDiv.innerHTML =  `
    <div class = 'singleMovie-content flex-container'> 
        <div class = 'imgMovie-container'>
            <img src = ${movieData.image} />
        </div>
        <div class = 'singleMovie-mainInfo'>
            <h3>${movieData.title} </h3>
            <p>${movieData.description} </p>
            <h3>Actors</h3>
            <p>${movieData.actors} </p>
            <h3>Awards</h3>
            <p>${movieData.awards} </p>
                <div class = 'singleMovie-buttons'>   
                    <button class = 'btn-singleMovie-favourite ${checkClassFavourite(movieData.imdbID)  ? 'favourited' : ''}' data-movieid=${movieData.imdbID}>Favourite</button>
                    <button class = 'btn-singleMovie-compare' data-movieid=${movieData.imdbID}>Compare</button>
                 </div>
         
        </div>
    </div>
`


    return singleMovie

}