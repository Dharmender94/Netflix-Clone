const apikey="8d44108de8dbae17bcb1b60b311b0a25"
const apiEndPoint="https://api.themoviedb.org/3"
const imagePath="https://image.tmdb.org/t/p/original"

const apiPaths={
    fetchAllCategories: `${apiEndPoint}/genre/movie/list?api_key=${apikey}`,
    fetchMoviesList:(id)=>`${apiEndPoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTrending:`${apiEndPoint}/trending/all/day?api_key=${apikey}`,
    searchOnYoutube:(query)=>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=AIzaSyBE4GANN0C1n-Hvm6DXqPBQlJA9oDW2efE`
}

function init(){
    fetchAndBuildAllSections();
    fetchTrendingMovie();
}

function fetchAndBuildAllSections(){
    fetch(apiPaths.fetchAllCategories)
    .then(res=>res.json())
    .then(res=>{
    
        const categories=res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category=>{
                fetchAndBuildMovieSection(
                    apiPaths.fetchMoviesList(category.id),
                category.name);
            });
        }
    })
    .catch(error=>console.error(error))
}

const fetchTrendingMovie=()=>{
    fetchAndBuildMovieSection(apiPaths.fetchTrending,"TrendingNow")
    .then(list=>{
        buildBannerSection(list[Math.floor(Math.random()*list.length)])
    }).catch(err=>console.error(err));
}


const buildBannerSection =(movie)=>{
const bannerContainer=document.querySelector(".banner-section")
bannerContainer.style.backgroundImage=`url("${imagePath}${movie.backdrop_path}")`
 const div=document.createElement("div")
 div.className="banner-content container"

 div.innerHTML=`
 <h1 class="banner-title">${movie.title}</h1>
        <p class="banner-info">Trending in movies | Release Date - ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+("..."):movie.overview}</p>
        <div class="action-buttons">
            <button class="action-button"><span><i class="fa-solid fa-play"></i></span>&nbsp;Play</button>
            <button class="action-button"><span><i class="fa-sharp fa-solid fa-circle-exclamation"></i></span>&nbsp;More Info</button>

        </div>
 `
 bannerContainer.append(div)

}


function fetchAndBuildMovieSection(fetchUrl,categoryName){
    // console.log(fetchUrl,category);
    return fetch(fetchUrl)
    .then(res=>res.json())
    .then(res=>{
        const movies=res.results;
        if(Array.isArray(movies)&& movies.length){
            buildMovieSection(movies,categoryName)
        }
        return movies
    })

    
}
const buildMovieSection=(list,categoryName)=>{
    // console.log(list,categoryName)
    const moviesContainer=document.querySelector(".movies_container")
const movieListHtml=list.map((item)=>{
    return(

        `<img  src="${imagePath}${item.backdrop_path}" alt="${item.title}" onclick="searchMovieTrailer('${item.title}')">
        `
        
    )
})

const movieSectionHtml=`
 <h2>${categoryName} <span class="explore">Explore now</span></h2>
<div class="movies_row">
${movieListHtml}
</div>`

const div=document.createElement('div')
div.className="movies_section"
div.innerHTML =movieSectionHtml

moviesContainer.append(div)

}

function searchMovieTrailer(movieName){
    if(!movieName) return;
    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res=>res.json())
    .then(res=>{
        // console.log(res.items[0]);
        const topResult=res.items[0];
        const youTubeUrl=`https://www.youtube.com/watch?v=${topResult.id.videoId}`;
        // console.log(youTubeUrl)
        window.open(youTubeUrl,'_blank');
    })
    .catch(err=>console.log(err));
}


window.addEventListener('load',function(){
    init();
window.addEventListener('scroll',()=>{
        const navbar=document.querySelector("#navbar");
        if(window.scrollY > 5){
            navbar.classList.add("bg-color")
        }
        else{
            navbar.classList.remove("bg-color")
        }
        
    })
});

