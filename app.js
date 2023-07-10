// API

const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
const ApiBase = "https://api.themoviedb.org/3/discover/movie";
const ApiTrending = '?sort_by=popularity.desc';
const URLTrending = ApiBase + ApiTrending + ApiKey
const ApiImageBase = 'https://image.tmdb.org/t/p/w500/'

async function movieTrending(){
    const moviesTrending = await fetch(URLTrending);
    const moviesTrendingData = await (moviesTrending.json());
    const moviesTrendingList = document.querySelector(".movies__list")
    moviesTrendingList.innerHTML = moviesTrendingData.results.map( (movie) =>
    `<div class="splide__slide">
    <div class="movie__box">
      <figure class="movie__img--wrapper">
        <img
          src="${ApiImageBase + movie.poster_path}"
          alt=""
          class="movie__img"
        />
      </figure>
      <div>
        <p class="movie__title">${movie.title}</p>
        <p class="movie__year">${movie.release_date}</p>
      </div>
      <div class="movie__description--wrapper">
        <p class="movie__description">
          ${movie.overview}
        </p>
      </div>
    </div>
  </div>`)
    .join("")
}
movieTrending();





// Random img as a bacground
const imagesQuantity = 11;

function getRandomImg(event) {
  const imgValue = Math.floor(imagesQuantity * Math.random());
  const imgURL = "url(./assets/backgroundimg" + imgValue + ".jpg)";
  document.querySelector('.header__container').style.backgroundImage = imgURL ;
}



