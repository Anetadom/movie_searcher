// API

const ApiKey = "&api_key=57e2a7b6bb030ad38f924e126dc9e94a";
const ApiBase = "https://api.themoviedb.org/3/discover/";
const ApiTrending = 'movie?with_genres=10402';
const URLTrending = ApiBase + ApiTrending + ApiKey
const ApiTrendingTV = 'tv?with_origin_country=US&sort_by=popularity.desc&';
const URLTrendingTV = ApiBase + ApiTrendingTV + ApiKey;
const ApiImageBase = 'https://image.tmdb.org/t/p/w500/'

// Main movies function 
async function mainMovies(){
    const moviesTrending = await fetch(URLTrending);
    const moviesTrendingData = await (moviesTrending.json());
    const moviesTrendingList = document.querySelector(".movies__list");
    const tvTrending = await fetch(URLTrendingTV);
    const tvTrendingData = await (tvTrending.json());
    const tvTrendingList = document.querySelector(".shows__list");
    
    moviesTrendingList.innerHTML = moviesTrendingData.results.map( (movie) => moviesTrendingMain(movie)).join("");
    tvTrendingList.innerHTML = tvTrendingData.results.map((show) => showsTrendingMain(show)).join("");

   var carousel1 = new Splide ("#carousel1", {
    perPage: 4,
    perMove: 1,
    type: "loop",
    pagination: false,
    gap: "20px",
    breakpoints: {
      768: {
        perPage: 2,
        gap: ".7rem",
      },
      480: {
        perPage: 1,
        gap: "0rem",
      },
    },
  })

  var carousel2 = new Splide ("#carousel2", {
    perPage: 4,
    perMove: 1,
    type: "loop",
    pagination: false,
    gap: "20px",
    breakpoints: {
      768: {
        perPage: 2,
        gap: ".7rem",
      },
      480: {
        perPage: 1,
        gap: "0rem",
      },
    },
  })

  carousel1.mount();
  carousel2.mount();
    // CAROUSEL 
  
}



function moviesTrendingMain(movie) {

    let releaseYear = (new Date(movie.release_date)).getFullYear();
    return  `<div class="splide__slide">
    <div class="main__box">
    <figure class="main__img--wrapper">
        <img src="${ApiImageBase + movie.poster_path}" alt="" class="main__img"/>
    </figure>
      <div>
        <p class="main__title">${movie.title}</p>
        <p class="main__year">${releaseYear}</p>
      </div>
      <div class="main__description--wrapper">
        <p class="main__description">${movie.overview}</p>
      </div>
    </div>
  </div>`;
}




function showsTrendingMain(show){

    let releaseYear = (new Date(show.first_air_date)).getFullYear();
    return  `<div class="splide__slide">
    <div class="main__box">
    <figure class="main__img--wrapper">
        <img src="${ApiImageBase + show.poster_path}" alt="" class="main__img"/>
    </figure>
      <div>
        <p class="main__title white__color">${show.name}</p>
        <p class="main__year white__color"> ${releaseYear}</p>
      </div>
      <div class="main__description--wrapper">
        <p class="main__description ">${show.overview}</p>
      </div>
    </div>
  </div>`;
}

mainMovies ();


// Random img as a bacground
const imagesQuantity = 11;

function getRandomImg(event) {
  const imgValue = Math.floor(imagesQuantity * Math.random());
  const imgURL = "url(./assets/backgroundimg" + imgValue + ".jpg)";
  document.querySelector('.header__container').style.backgroundImage = imgURL ;
}



