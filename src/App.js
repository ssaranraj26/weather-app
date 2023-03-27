import { Component } from "react";
import { BiSearch } from "react-icons/bi";
import "./App.css";

class App extends Component {
  state = {
    query: "",
    weather: {},
    favorites: [],
  };

  componentDidMount() {
    this.getLocalFav();
  }

  getLocalFav = () => {
    const localFav = JSON.parse(localStorage.getItem("fav"));
    if (localFav) {
      const { favorites } = localFav;
      console.log(favorites);
      this.setState({ favorites: favorites });
    }
  };

  storeLocally = () => {
    const { favorites } = this.state;
    const dataToStore = JSON.stringify({
      favorites,
    });
    localStorage.setItem("fav", dataToStore);
  };

  search = async () => {
    const { query } = this.state;
    const API_KEY = "9a86f3aff81803be5b70bf1d3aac2867";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    this.setState({ weather: data, query: "" });
  };

  handleAddFavorite = () => {
    const { favorites, weather } = this.state;

    if (!favorites.includes(weather.name)) {
      this.setState(
        (prevState) => ({
          favorites: [...prevState.favorites, weather.name],
        }),
        this.storeLocally
      );
    }
  };

  sendNewLocation = (location) => {
    this.setState(() => ({ query: location }), this.search);
  };

  getDescription = () => {
    const { weather } = this.state;
    const des = weather.weather[0].description;
    const weatherFirstLetter = des.slice(0, 1).toUpperCase() + des.slice(1);
    console.log(weatherFirstLetter);
    return weatherFirstLetter;
  };

  getDate = () => {
    const { weather } = this.state;
    const time = weather.dt;
    const date = new Date(time * 1000);
    return date.toLocaleString();
  };

  render() {
    const { query, weather, favorites } = this.state;

    return (
      <div className="app">
        <div className="container">
          <h1>Weather Condition</h1>
          <div className="search-box">
            <input
              type="text"
              className="search-bar"
              placeholder="Search location..."
              value={query}
              onChange={(e) => this.setState({ query: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  this.search();
                }
              }}
            />
            <BiSearch className="search-icon" onClick={this.search} />
          </div>
          {weather.main && (
            <div className="weather-box">
              <div className="location-box">
                <div className="location">
                  {weather.name}, {weather.sys.country}
                </div>
                <button
                  className="add-favorite-btn"
                  onClick={this.handleAddFavorite}
                >
                  Fav
                </button>
              </div>
              <div>
                <div className="temp">
                  <img
                    className="weather-img"
                    src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
                    alt="weather icon"
                  />
                  <h1 className="celsius">{Math.round(weather.main.temp)}°C</h1>
                  <p>{this.getDate()}</p>
                  <p className="weather">{this.getDescription()}</p>
                </div>
              </div>
            </div>
          )}
          <div className="favorites-box">
            <div className="fav-btn-container">
              <h3 className="fav">Favorites</h3>
              <button
                className="clear-btn"
                onClick={() => {
                  this.setState({ favorites: [] });
                  localStorage.removeItem("fav");
                }}
              >
                Clear
              </button>
            </div>
            <ul>
              {favorites.map((location) => (
                <li
                  key={location}
                  onClick={() => this.sendNewLocation(location)}
                >
                  {location}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
