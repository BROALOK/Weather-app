import React, { useState, useEffect } from 'react';
// import './App.css';

const api = {
  key: "049854211008e7711bdb98dd08e10cc8",
  base: "https://api.openweathermap.org/data/2.5/"
};

function App() {
  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`${api.base}weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(result => {
          setWeather(result);
        });
    });
  }, []);

  const search = (location) => {
    fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
      .then(res => res.json())
      .then(result => {
        setWeather(result);
        setQuery('');
        setSuggestions([]);
      });
  };

  const fetchSuggestions = (input) => {
    if (input.length > 2) {
      fetch(`https://api.openweathermap.org/data/2.5/find?q=${input}&type=like&sort=population&cnt=5&appid=${api.key}`)
        .then(res => res.json())
        .then(data => {
          if (data.list) {
            setSuggestions(data.list.map(city => `${city.name}, ${city.sys.country}`));
          }
        });
    } else {
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    search(suggestion);
  };

  const handleKeyDown = (evt) => {
    if (evt.key === "Enter") {
      search(query);
    }
  };

  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = d.getMonth();
    let year = d.getFullYear();

    return `${day} ${date} ${months[month]} ${year}`;
  };

  const getWeatherIcon = (weatherCondition) => {
    const icons = {
      Clear: "☀️",
      Clouds: "☁️",
      Haze: "🌫️",
      Mist: "🌫️",
      Fog: "🌫️",
      Rain: "🌧️",
      Drizzle: "🌦️",
      Snow: "❄️",
      Wind: "💨",
      Storm: "⛈️",
    };
    return icons[weatherCondition] || "❓";
  };

  return (
    <div className={(typeof weather.main !== "undefined") ? (weather.main.temp > 16 ? 'app warm' : 'app cold') : 'app'}>
      <main>
        <div className="search-box">
          <input 
            type="text" 
            className="search-bar" 
            placeholder='Search...' 
            onChange={handleInputChange} 
            value={query} 
            onKeyDown={handleKeyDown} 
          />
          <ul className="suggestions">
            {suggestions.map((suggestion, index) => (
              <li key={index} onClick={() => handleSuggestionClick(suggestion)}>{suggestion}</li>
            ))}
          </ul>
        </div>
        {(typeof weather.main !== "undefined") ? (
          <div>
            <div className='location-box'>
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>
            <div className="weather-box">
              <div className="temp">{Math.round(weather.main.temp)}°c</div>
              <div >
                <div className="weather-icon">{getWeatherIcon(weather.weather[0].main)}</div>
                <div className="weather">{weather.weather[0].main}</div>
              </div>
            </div>
          </div>
        ) : ('')}
      </main>
    </div>
  );
}

export default App;

