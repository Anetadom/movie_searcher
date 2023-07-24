
//Active Genres
function activeGenres(event) {
  const button = event.target;
  button.classList.toggle('active');
  collectDataValuesGenre();
  dateValue();
}

//Picked genres

function collectDataValuesGenre() {
  dataValuesGenre = []
  const buttons = document.querySelectorAll('#with_genres li button');
  buttons.forEach(function (button) {
    if (button.classList.contains('active')) {
      dataValuesGenre.push(button.parentNode.getAttribute('data-value'));
    }
  });
}
// ZMIANY

//filter value

function dateValue() {
  const MovieSortByValue = document.getElementById("sort-by").value;
  const olderDateValue = document.querySelector('.older').value;
  const newerDateValue = document.querySelector('.newer').value;
  API(MovieSortByValue, olderDateValue, newerDateValue);
}




//API 
async function API(MovieSortByValue, olderDateValue = "1900-01-01", newerDateValue = "9999-12-31") {
  const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
  const ApiBase = "https://api.themoviedb.org/3/discover/movie?";
  const APIMovieRatingDescURL = ApiBase + "sort_by=" + MovieSortByValue + "&vote_count.gte=500&with_genres=" + dataValuesGenre + "&primary_release_date.gte=" + olderDateValue + "&primary_release_date.lte=" + newerDateValue + ApiKey;
  console.log(APIMovieRatingDescURL);
  const moviesTrending = await fetch(APIMovieRatingDescURL);
  const moviesTrendingData = await (moviesTrending.json());
  const moviesTrendingList = document.querySelector(".results__wrapper");
  moviesTrendingList.innerHTML = moviesTrendingData.results.map((movie) => moviesPage(movie)).join("");
}

//HTML code
function moviesPage(movie) {
  const ApiImageBase = 'https://image.tmdb.org/t/p/w500/';
  let releaseYear = (new Date(movie.release_date)).getFullYear();
  return `<div id=${movie.id} class="result" onclick="getID(this)" >
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
  IDFilter = document.getElementById("filter");
  IDModal = document.getElementById("modal");

 

  setTimeout(() => {
    IDFilter.classList.add("hide");
    IDModal.classList.remove("hide");
  }, 300)
  APIDetails(ID);
}



async function APIDetails(ID) {
  const details = await fetch(`https://api.themoviedb.org/3/movie/${ID}?api_key=57e2a7b6bb030ad38f924e126dc9e94a`);
  const detailsData = await (details.json());
  console.log(detailsData);
  const actors = await fetch(`https://api.themoviedb.org/3/movie/${ID}/credits?api_key=57e2a7b6bb030ad38f924e126dc9e94a`);
  const actorsData = await (actors.json());
  console.log(actorsData);

  const genresListMovie = detailsData.genres.map((genres) => genres.name).join(", ")
  console.log(genresListMovie)


  //Adding modal
  const movieDetails = document.getElementById("modal");
  const ratings = Math.round(detailsData.vote_average * 10) / 10 + " / 10"; 
  movieDetails.innerHTML = `
  <div class="container__modal">
  <img src="" alt="" />
  <div class="modal__wrapper fade-in">
  <div class="modal__img--wrapper">
          <img src="https://image.tmdb.org/t/p/w500/${detailsData.poster_path}" alt="" class="modal__img"/>
          <div class="modal__ratings" ">${ratings}</div>
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

  function ratingsColor(){
    const ratings = document.querySelector(".modal__ratings");
    const voteAverage = detailsData.vote_average;
    if ( voteAverage >= 7.5 ){
      ratings.style.color = "green";
    }
    else if (  7.5 > voteAverage && voteAverage >= 5){
      ratings.style.color = "yellow";
    }
    else if (  5 > vvoteAverage && voteAverage >= 2.5){
      ratings.style.color = "orange";
    }
    else if ( voteAverage < 2.5 ){
      ratings.style.color = "red";
    }

}

ratingsColor();
}
//ratings color 


// close modal

function closeModal() {
  IDModal.classList.add("hide")
  IDFilter.classList.remove("hide")
  IDModal.classList.remove("fade-in")
  console.log(IDFilter)
}

//loading 

document.addEventListener("DOMContentLoaded", function () {
  const IDFilter = document.getElementById("filter")
  const IDModal = document.getElementById("modal")
  collectDataValuesGenre();
  API(dataValuesGenre);
});

