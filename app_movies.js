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
  console.log(ID);
  const hideElement = document.getElementById("filter") 
  const showElement = document.getElementById("modal")
  hideElement.classList.add("hide")
  showElement.classList.remove("hide")
  APIDetails(ID);
}

async function APIDetails(ID){
const details = await fetch(`https://api.themoviedb.org/3/movie/${ID}?api_key=57e2a7b6bb030ad38f924e126dc9e94a`); 
const detailsData = await (details.json());
console.log(detailsData);
const actors = await fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?api_key=57e2a7b6bb030ad38f924e126dc9e94a`); 
const actorsData = await (actors.json());
console.log(actorsData);

const genresListMovie = detailsData.genres.map((genres) => genres.name).join(", ")
console.log (genresListMovie)


//Adding html
const movieDetails = document.getElementById("modal");
movieDetails.innerHTML = `
    <div class="container__modal">
      <img src="" alt="" />
      <div class="modal__wrapper">
        <div class="modal__img--wrapper">
          <img src="https://image.tmdb.org/t/p/w500/${detailsData.poster_path}" alt="" class="modal__img"/>
          <div class="modal__ratings">${detailsData.vote_average}</div>
        </div>
        <div class="modal__content--wrapper">
          <div class="modal__info">
            <div class="modal__title--wrapper">
              <h1 class="modal__title">${detailsData.title}<span class="modal__year">&nbsp;(${detailsData.release_date.slice(0, 4)})</span></h1>
            </div>
            <h3 class="modal__genres">${genresListMovie}</h3>
          </div>
          <div class="modal__description">
            ${detailsData.overview}
          </div>
        </div>
        <button class="modal__close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>
  `;
}

// close modal

function closeModal(){
  const close = document.getElementById("modal")
  const show = document.getElementById("filter") 
  close.classList.add("hide")
  show.classList.remove("hide")
}


//loading 

document.addEventListener("DOMContentLoaded", function() {
  collectDataValuesGenre();
  API(dataValuesGenre);
});

