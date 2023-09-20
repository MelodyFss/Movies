import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Youtube from 'react-youtube';
import './App.css';

function App() {
  const API_URL = 'https://api.themoviedb.org/3'
  const API_KEY = 'cd843d2c429ad7ecb0e89c445da34724'
  const IMAGE_PATH = 'https://image.tmdb.org/t/p/original'
  const URL_IMAGE = 'https://image.tmdb.org/t/p/original'

  // variables of state
  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies..." });
  const [playing, setPlaying] = useState(false);

  // function to make the petition from get to the API
  const fetchMovies = useCallback(async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const { data: { results } } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });

    if (results.length) {
      await fetchMovie(results[0].id);
    }
    setMovies(results);
    setMovie(results[0]);
  }, [API_URL, API_KEY]);

  // function for the petition of just one object and the video player
  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  }

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    window.scrollTo(0, 0);
  }

  // function to search the movies
  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  }

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return (
    <div className="containerall">
      <h2 className="h2">TRAILERS</h2>
      {/* search */}
      <form className='container mb-4' onSubmit={searchMovies} >
        <input type="text" placeholder='Search a movie...' className="inputsearch" onChange={(e) => setSearchKey(e.target.value)} />
        <button className="buttonsearch">Search</button>
      </form>
      {/* banner and video player container */}
      <div>
        <main>
          {movie ? (
            <div className="viewtrailer" style={{ backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")` }}>
              {playing ? (
                <>
                  <Youtube
                    videoId={trailer.key} className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button className="boton" onClick={() => setPlaying(true)} type="button">
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="moviet">{movie.title}</h1>
                    <p className="text">{movie.overview}</p>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
      {/* container that shows the posters of the movies */}
      <div className="container mt-3">
        <div className="row">
          {movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-3" onClick={() => selectMovie(movie)}>
              <img src={`${URL_IMAGE + movie.poster_path}`} alt="" height={600} width="100%" />
              <h4 className="text-center">{movie.title}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
