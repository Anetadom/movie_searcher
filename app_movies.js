
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

//filter value

function dateValue() {
  const MovieSortByValue = document.getElementById("sort-by").value;
  const olderDateValue = document.querySelector('.older').value;
  const newerDateValue = document.querySelector('.newer').value;
  API(MovieSortByValue, olderDateValue, newerDateValue);
}

//LOAD Genres 

async function APIGenres (){
  const page = localStorage.getItem("pageValue");
  const genres = await fetch(`https://api.themoviedb.org/3/genre/${page}/list?api_key=57e2a7b6bb030ad38f924e126dc9e94a`);
  const genresData = await (genres.json())
  const GenresFilter = document.getElementById("with_genres")
  GenresFilter.innerHTML =  genresData.genres.map((genre) => GenresHTML(genre)).join("");
  
  
  function GenresHTML(genre) {
    return `<li data-value="${genre.id}">
    <button class="no__click" onclick="activeGenres(event)">
      ${genre.name}
    </button></li>`}

  } 
  


// API zmiany
async function API(MovieSortByValue, olderDateValue = "1900-01-01", newerDateValue = "9999-12-31") {
  const page = localStorage.getItem("pageValue");
  let olderDateType ="";
  let newerDateType ="";
  if(page === "movie"){
    olderDateType = "&primary_release_date.gte=";
    newerDateType = "&primary_release_date.lte=";
  }
  else{
    olderDateType = "&first_air_date.gte=";
    newerDateType = "&first_air_date.lte=";
  };




  const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
  const ApiBase = `https://api.themoviedb.org/3/discover/${page}?`;
  const APIMovieRatingDescURL = ApiBase + "sort_by=" + MovieSortByValue + "&vote_count.gte=500&with_genres=" + dataValuesGenre + olderDateType + olderDateValue + newerDateType + newerDateValue + ApiKey;


  const moviesTrending = await fetch(APIMovieRatingDescURL);
  const moviesTrendingData = await moviesTrending.json();
  const moviesTrendingList = document.querySelector(".results__wrapper");
  const noResultsMessage = document.querySelector(".noresults__message");

  if (moviesTrendingData.results.length === 0) {
    moviesTrendingList.style.display = "none";
    noResultsMessage.style.display = "block";
  } else {
   
    moviesTrendingList.style.display = "grid";
    noResultsMessage.style.display = "none";
    moviesTrendingList.innerHTML = moviesTrendingData.results.map((movie) => moviesPage(movie)).join("");
  }
}


//HTML code
function moviesPage(movie) {
  let date = movie.release_date || movie.first_air_date;
  let title = movie.title || movie.name;
  const ApiImageBase = 'https://image.tmdb.org/t/p/w500';
  if (movie.poster_path === null) {
    poster = "./assets/imgnotfound.jpg";
  } else {
    poster = ApiImageBase + movie.poster_path;
  }
  let releaseYear = (new Date(date)).getFullYear();
  return `<div id=${movie.id} class="result" onclick="getID(this)" >
  <figure class="result__img--wrapper">
  <img
  src="${poster}"
  alt=""
  class="result__img"
  />
  </figure>
  <div>
  <p class="result__title">${title}</p>
    <p class="result__year">${releaseYear}</p>
    </div>
    <figure class="know-more" >
    <i class="fa-solid fa-ellipsis-vertical"></i>
    </figure>
    </div>`;
}

function getID(event) {
  const ID = event.closest('.result').id;
  IDFilter = document.getElementById("filter");
  IDModal = document.getElementById("modal");

 

  setTimeout(() => {
    IDFilter.classList.add("hide");
    IDModal.classList.remove("hide");
  }, 300)
  APIDetails(ID);
}

let detailsData = ""

async function APIDetails(ID) {
  const page = localStorage.getItem("pageValue")
  const details = await fetch(`https://api.themoviedb.org/3/${page}/${ID}?api_key=57e2a7b6bb030ad38f924e126dc9e94a`);
  detailsData = await (details.json());
  const genresList = detailsData.genres.map((genres) => genres.name).join(", ")



  //Adding modal
  let date = detailsData.release_date || detailsData.first_air_date;
  let title = detailsData.title || detailsData.name;
  let poster = "";
  const ApiImageBase = 'https://image.tmdb.org/t/p/w500';
  let releaseYear = new Date(date).getFullYear();
  if (detailsData === null) {
    poster = "./assets/imgnotfound.jpg";
  } else {
    poster = ApiImageBase + detailsData.poster_path;
  }
  
  const movieDetails = document.getElementById("modal");
  const ratings = Math.round(detailsData.vote_average * 10) / 10 + " / 10";
  movieDetails.innerHTML = `
  <div class="container__modal">
  <div class="backdrop-overlay"></div>
  <img src="" alt="" />
  <div class="modal__wrapper fade-in">
  <div class="modal__img--wrapper">
          <img src="https://image.tmdb.org/t/p/w500/${poster}" alt="" class="modal__img"/>
          <div class="modal__ratings--wrapper"> <h2 class="modal__ratings">${ratings} </h3></div>
          </div>
          <div class="modal__content--wrapper">
          <div class="modal__info">
          <div class="modal__title--wrapper">
              <h1 class="modal__title">${title}<span class="modal__year">&nbsp;(${releaseYear})</span></h1>
            </div>
            <h3 class="modal__genres">${genresList}</h3>
            </div>
            <div class="modal__description">
            ${detailsData.overview}
          </div>
        </div>
        <button class="modal__close" onclick="closeModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      </div>
      `;

  //ratings color
  function ratingsColor() {
    const ratings = document.querySelector(".modal__ratings");
    const voteAverage = detailsData.vote_average;
    if (voteAverage >= 7.5) {
      ratings.style.color = "#299947";
    } else if (7.5 > voteAverage && voteAverage >= 5) {
      ratings.style.color = "#f7f705";
    } else if (5 > voteAverage && voteAverage >= 2.5) {
      ratings.style.color = "#f79e05";
    } else if (voteAverage < 2.5) {
      ratings.style.color = "#f70505";
    }

    
  }

  ratingsColor();




 // MODAL BACKGROUND 

 function setModalBackground() {
  const modalBackground = document.querySelector(".container__modal");
  let modalBackgroundImg = "";

  if (screen.width < 768) {
    modalBackgroundImg = detailsData.poster_path;
  } else {
    modalBackgroundImg = detailsData.backdrop_path;
  }

  modalBackground.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${modalBackgroundImg})`;
}
setModalBackground();
}

// close modal

function closeModal() {
  IDModal.classList.add("hide")
  IDFilter.classList.remove("hide")
  IDModal.classList.remove("fade-in")
}

//loading 

document.addEventListener("DOMContentLoaded", function () {
  const IDFilter = document.getElementById("filter")
  const IDModal = document.getElementById("modal")
  collectDataValuesGenre();
  API(dataValuesGenre);
  APIGenres();
});

// new page 
function newPage (event){
  const newPage = event.target
  const newPageValue = newPage.getAttribute ("value");
  localStorage.setItem ("pageValue", newPageValue)
  window.location.href = `${window.location.origin}/movie_searcher/movies.html`
}

// SHOW FILTER LIST 

function showFilterList(event){
    const filterList = document.querySelector(".filter__parameters")
    filterList.classList.toggle('show');
  console.log(filterList);
  
}

// Rotate arrow 
  let angle = 0
function rotate(){
  const arrow = document.querySelector(".fa-chevron-down"); 
  angle +=180
  arrow.style.transform = `rotate(${angle}deg)`
}