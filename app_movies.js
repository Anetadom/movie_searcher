// onclick genres


function activeGenres(event) {
    const button = event.target;
    
    if (button.classList.contains('active')) {
      button.classList.remove('active');
    } else {
      button.classList.add('active');
    }
  }

  // API

const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
const ApiBase = "https://api.themoviedb.org/3/discover/";
const APIMovieRatingDesc = "sort_by=vote_average.desc";

console.log(ApiBase+ApiKey+APIMovieRatingDesc)

