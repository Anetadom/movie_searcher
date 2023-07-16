//Filter Data

function collectDataValuesGenre() {
  const dataValuesGenre = [];

  const buttons = document.querySelectorAll('#with_genres li button');
  buttons.forEach(function(button) {
    if (button.classList.contains('active')) {
      dataValuesGenre.push(button.parentNode.getAttribute('data-value'));
    }
  });

  return dataValuesGenre;
}


//Active Genres
function activeGenres(event) {
  const button = event.target;

  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    button.classList.add('active');
  }
//zmiany
  const dataValuesGenre = collectDataValuesGenre().join("%20or%20");
  const MovieSortBy = document.getElementById("sort-by");
  const MovieSortByValue = MovieSortBy.value;
  API( MovieSortByValue, dataValuesGenre);
}

// sort by 

function sortBy(){
const MovieSortBy = document.getElementById("sort-by");
const MovieSortByValue = MovieSortBy.value;
console.log(MovieSortByValue);
const dataValuesGenre = collectDataValuesGenre().join("%20or%20");
API( MovieSortByValue, dataValuesGenre)
}

//API 
async function API( MovieSortByValue, dataValuesGenre) {
  const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
  const ApiBase = "https://api.themoviedb.org/3/discover/movie?";
  const APIMovieRatingDescURL = ApiBase + "sort_by=" + MovieSortByValue +"&vote_count.gte=500&with_genres=" + dataValuesGenre + ApiKey;
  console.log(APIMovieRatingDescURL);
  const moviesTrending = await fetch(APIMovieRatingDescURL);
  const moviesTrendingData = await (moviesTrending.json());
  const moviesTrendingList = document.querySelector(".results__wrapper");
  moviesTrendingList.innerHTML = moviesTrendingData.results.map( (movie) => moviesPage(movie)).join("");
}

//HTML code
function moviesPage (movie) {
  const ApiImageBase = 'https://image.tmdb.org/t/p/w500/';
  let releaseYear = (new Date(movie.release_date)).getFullYear();
  return  `<div class="result">
  <figure class="result__img--wrapper">
    <img
      src="${ApiImageBase + movie.poster_path}"
      alt=""
      class="result__img"
    />
  </figure>
  <div>
    <p class="result__title">${movie.title}</p>
    <p class="result__year">${releaseYear}</p>
  </div>
  <figure class="know-more">
    <i class="fa-solid fa-ellipsis-vertical"></i>
  </figure>
</div>`;
}

//loading 
document.addEventListener("DOMContentLoaded", function() {
  const dataValuesGenre = collectDataValuesGenre().join(",");
  API(dataValuesGenre);
});