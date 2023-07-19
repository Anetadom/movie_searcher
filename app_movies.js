//Filter Data
let dataValuesGenre = [];

function collectDataValuesGenre() {
  dataValuesGenre = []
  const buttons = document.querySelectorAll('#with_genres li button');
  buttons.forEach(function(button) {
    if (button.classList.contains('active')) {
      dataValuesGenre.push(button.parentNode.getAttribute('data-value'));
    }
  });
}



//Relese date

function dateValue(){
  const MovieSortBy = document.getElementById("sort-by");
  const MovieSortByValue = MovieSortBy.value;
  const olderDate = document.querySelector('.older')
  const newerDate = document.querySelector('.newer')
  const olderDateValue = olderDate.value 
  const newerDateValue = newerDate.value
  API(MovieSortByValue, olderDateValue, newerDateValue)
}

//Active Genres
function activeGenres(event) {
  const button = event.target;

  if (button.classList.contains('active')) {
    button.classList.remove('active');
  } else {
    button.classList.add('active');
  }

  collectDataValuesGenre();
  const MovieSortBy = document.getElementById("sort-by");
  const MovieSortByValue = MovieSortBy.value;
  const olderDate = document.querySelector('.older');
  const newerDate = document.querySelector('.newer');
  const olderDateValue = olderDate.value; 
  const newerDateValue = newerDate.value;
  API(MovieSortByValue, olderDateValue, newerDateValue);
}

// sort by 
function sortBy(){
  const MovieSortBy = document.getElementById("sort-by");
  const MovieSortByValue = MovieSortBy.value;
  collectDataValuesGenre();

  const olderDate = document.querySelector('.older');
  const newerDate = document.querySelector('.newer');
  const olderDateValue = olderDate.value;
  const newerDateValue = newerDate.value;
  API(MovieSortByValue, olderDateValue, newerDateValue);
}

//API 
async function API (MovieSortByValue , olderDateValue = "1900-01-01", newerDateValue = "9999-12-31"){
  const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
  const ApiBase = "https://api.themoviedb.org/3/discover/movie?";
  const APIMovieRatingDescURL = ApiBase + "sort_by=" + MovieSortByValue +"&vote_count.gte=500&with_genres=" + dataValuesGenre + "&primary_release_date.gte="+ olderDateValue + "&primary_release_date.lte=" + newerDateValue + ApiKey;
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
  return  `<div id=${movie.id} class="result" onclick="getID(this)" >
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
  <figure class="know-more" >
    <i class="fa-solid fa-ellipsis-vertical"></i>
  </figure>
</div>`;
}

function getID(event) {
  const ID = event.closest('.result').id;
  console.log(ID)

}

//loading 

document.addEventListener("DOMContentLoaded", function() {
  collectDataValuesGenre();
  API(dataValuesGenre);
});


async function APIDetails(i)
{}