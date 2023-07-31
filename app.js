// API

const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
const ApiBase = "https://api.themoviedb.org/3/discover/";
const ApiTrending = "movie?with_origin_country=US&sort_by=popularity.desc&";
const URLTrending = ApiBase + ApiTrending + ApiKey;
const ApiTrendingTV = "tv?with_origin_country=US&sort_by=popularity.desc&";
const URLTrendingTV = ApiBase + ApiTrendingTV + ApiKey;
const ApiImageBase = "https://image.tmdb.org/t/p/w500/";
console.log(URLTrending);

// Main movies function
async function mainMovies() {
  const moviesTrending = await fetch(URLTrending);
  const moviesTrendingData = await moviesTrending.json();
  const tvTrending = await fetch(URLTrendingTV);
  const tvTrendingData = await tvTrending.json();
  const moviesTrendingList = document.querySelector(".movies__list");
  const tvTrendingList = document.querySelector(".shows__list");

  moviesTrendingList.innerHTML = moviesTrendingData.results
    .map((movie) => moviesTrendingMain(movie))
    .join("");
  tvTrendingList.innerHTML = tvTrendingData.results
    .map((show) => showsTrendingMain(show))
    .join("");

  const carouselSettings = {
    perPage: 6,
    perMove: 1,
    type: "loop",
    pagination: false,
    gap: "20px",
    breakpoints: {
      1500: {
        perPage: 4,
        gap: ".7rem",
      },
      1200: {
        perPage: 3,
        gap: ".7rem",
      },
      900: {
        perPage: 2,
        gap: ".7rem",
      },
      768: {
        perPage: 1,
        gap: "0rem",
      },
    },
  };

  const carousel1 = new Splide("#carousel1", carouselSettings);
  const carousel2 = new Splide("#carousel2", carouselSettings);

  carousel1.mount();
  carousel2.mount();
  // CAROUSEL
}

function moviesTrendingMain(movie) {
  let releaseYear = new Date(movie.release_date).getFullYear();
  return `<div class="splide__slide" >
    <div class="main__box" id=${movie.id} value="movie" onclick="getID(this)">
    <figure class="main__img--wrapper">
        <img src="${
          ApiImageBase + movie.poster_path
        }" alt="" class="main__img"/>
    </figure>
      <div class="main__info--wrapper">
        <p class="main__title">${movie.title}</p>
        <p class="main__year">${releaseYear}</p>
      </div>
      <div class="main__description--wrapper">
        <p class="main__description">${movie.overview}</p>
      </div>
    </div>
  </div>`;
}

function showsTrendingMain(show) {
  let releaseYear = new Date(show.first_air_date).getFullYear();
  return `<div class="splide__slide" >
    <div class="main__box" id=${show.id} value="tv"onclick="getID(this)">
    <figure class="main__img--wrapper">
        <img src="${ApiImageBase + show.poster_path}" alt="" class="main__img"/>
    </figure>
      <div class="main__info--wrapper">
        <p class="main__title white__color">${show.name}</p>
        <p class="main__year white__color"> ${releaseYear}</p>
      </div>
      <div class="main__description--wrapper">
        <p class="main__description ">${show.overview}</p>
      </div>
    </div>
  </div>`;
}

mainMovies();

// search list

async function searchList(searchTerm) {
  // let searchElement =""
  // try{
   const searchElement = await fetch(
    `https://api.themoviedb.org/3/search/multi?language=en&query=${searchTerm}&api_key=57e2a7b6bb030ad38f924e126dc9e94a`)
  // catch (error) {
  //   console.error(error)
  // }
  const searchElementData = await searchElement.json();
  const filteredResults = searchElementData.results.filter((item) => item.media_type !== "person");

  // Show elements on the page
  const searchElementsList = document.querySelector(".search__list");
  searchElementsList.innerHTML = filteredResults
    .map((movie) => elementsListHTML(movie))
    .join("");

  const searchResultsDiv = document.querySelector(".search__results--wrapper")  
  searchResultsDiv.innerHTML = filteredResults
  .map((movie) => searchResults(movie))
  .join("");

  // search list html

  function elementsListHTML(movie) {
    let date = movie.release_date || movie.first_air_date;
    let releaseYear = new Date(date).getFullYear();
    let title = movie.title || movie.name;
    let poster = "";

    if (movie.poster_path === null) {
      poster = "./assets/imgnotfound.jpg";
    } else {
      poster = ApiImageBase + movie.poster_path;
    }

    return `<div class="search__list--element" id=${movie.id} value="${movie.media_type}" onclick="getID(this)">
    <img src="${poster}" alt="" class="search__element--img">
    <div class="search__list--info">
    <h3 class="search__element--title">${title}</h3>
    <h3 class="search__element--year">${releaseYear}</h3>
    </div>
    </div>`;
  }

  function searchResults(movie) {
    let date = movie.release_date || movie.first_air_date;
    let releaseYear = new Date(date).getFullYear();
    let title = movie.title || movie.name;
    let poster = "";

    if (movie.poster_path === null) {
      poster = "./assets/imgnotfound.jpg";
    } else {
      poster = ApiImageBase + movie.poster_path;
    }

    return `<div class="search__result" id=${movie.id} value="${movie.media_type}" onclick="getID(this)">
    <figure class="search__img--wrapper">
      <img
        src="${poster}"
        alt="" class="search__img">
    </figure>
    <div class="search__info--wrapper">
      <p class="search__title ">${title}</p>
      <p class="search__year"> ${releaseYear}</p>
    </div>
    <div class="search__description--wrapper">
      <p class="search__description ">${movie.overview}</p>
    </div>
  </div>`;
  }


}

// get name from searchbox

function searchTerm() {
  const hideList = document.querySelector(".search__list");
  hideList.classList.remove("hide");
  let searchTerm = document.getElementById("search__phrase").value.trim();
  searchList(searchTerm);
}

//search by ID API

async function APIDetails(ID, type) {
  const details = await fetch(
    `https://api.themoviedb.org/3/${type}/${ID}?api_key=57e2a7b6bb030ad38f924e126dc9e94a`
  );
  const detailsData = await details.json();
  const genresList = detailsData.genres.map((genres) => genres.name).join(", ");

  //Adding modal
  let date = detailsData.release_date || detailsData.first_air_date;
  let title = detailsData.title || detailsData.name;
  let poster = "";
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
          <div class="modal__ratings" ">${ratings}</div>
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
      ratings.style.color = "green";
    } else if (7.5 > voteAverage && voteAverage >= 5) {
      ratings.style.color = "yellow";
    } else if (5 > voteAverage && voteAverage >= 2.5) {
      ratings.style.color = "orange";
    } else if (voteAverage < 2.5) {
      ratings.style.color = "red";
    }

    const modalBackground = document.querySelector(".container__modal")
    modalBackground.style.backgroundImage=`url(https://image.tmdb.org/t/p/original/${detailsData.backdrop_path})`;
  }

  ratingsColor();
}

//get id

function getID(clickedElement) {
  const ID = clickedElement.id;
  const type = clickedElement.getAttribute("value");
  IDTrendingMovie = document.getElementById("trending__movies");
  IDTrendingTV = document.getElementById("trending__shows");
  IDModal = document.getElementById("modal");
  IDHeader = document.getElementById("header");
  const sectionSearchResults = document.getElementById("search__results")
  
  
  setTimeout(() => {
    IDTrendingMovie.classList.add("hide");
    IDTrendingTV.classList.add("hide");
    IDHeader.classList.add("hide");
    IDModal.classList.remove("hide");
    sectionSearchResults.classList.add('hide');
  }, 500);
  APIDetails(ID, type);
}

// close modal

function closeModal() {
  const hideList = document.querySelector(".search__list");
  hideList.classList.add("hide");
  IDTrendingMovie.classList.remove("hide");
  IDTrendingTV.classList.remove("hide");
  IDHeader.classList.remove("hide");
  IDModal.classList.remove("fade-in");
  IDModal.classList.add("hide");
  document.getElementById("search__phrase").value = "";
}

// Random img as a bacground
const imagesQuantity = 11;

function getRandomImg(event) {
  const imgValue = Math.floor(imagesQuantity * Math.random());
  const imgURL = "url(./assets/backgroundimg" + imgValue + ".jpg)";
  document.querySelector(".header__container").style.backgroundImage = imgURL;
}

// close search list after click 
 function hideSearchList(){
  const searchList = document.querySelector(".search__list");
  const searchInput = document.getElementById("search__phrase");
  const searchButton = document.querySelector(".header__search--button")

  if (!searchList.contains(event.target) && !searchInput.contains(event.target) && !searchButton.contains(event.target) )  {
    searchList.classList.add("hide");
  }
};

function search(event){

  const sectionSearchResults = document.getElementById("search__results")
  const searchList = document.querySelector(".search__list");
  IDTrendingMovie = document.getElementById("trending__movies");
  IDTrendingTV = document.getElementById("trending__shows");
  sectionSearchResults.classList.toggle('fade-in');
  IDTrendingMovie.classList.add("hide");
  IDTrendingTV.classList.add("hide");
  searchList.classList.add("hide");
  sectionSearchResults.classList.toggle('hide');
}

// GET TO NEW PAGE 

function newPage (event){
  console.log(window.location);
  const newPage = event.target
  const newPageValue = newPage.getAttribute ("value");
  localStorage.setItem ("pageValue", newPageValue)

  window.location.href = `${window.location.origin}/FinalProject/movies.html`
}