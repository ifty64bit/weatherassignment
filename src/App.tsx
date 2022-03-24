import React, { useState, useRef, useEffect } from 'react'
import { ICData, IWeather } from './types/types';

function App() {
  const [input, setInput] = useState<string>('');
  const [cData, setCData] = useState<ICData>();
  const [weather, setWeather] = useState<IWeather>();
  const btn = useRef<HTMLButtonElement>(null!);
  const updateInput=(e:React.ChangeEvent<HTMLInputElement>)=>{
    setInput(e.target.value)
    
  }

  useEffect(() => {
    input === "" ? btn.current.disabled = true : btn.current.disabled = false;
  }, [input])
  
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch(`https://restcountries.com/v3.1/name/${input}`)
      .then(res => res.json())
      .then(data => {
        const newData: ICData = {
          capital: data[0].capital[0],
          population: data[0].population,
          flag: data[0].flags['png'],
          latlng: [data[0].latlng[0],data[0].latlng[0]],
        }
        setCData(newData);
      });
  }

  const getWeather = () => {
    fetch(`http://api.weatherstack.com/current?access_key=1e020956f97f3d1d942b9453ebf4f262&query=${ cData?.capital }`)
    .then(res => res.json())
      .then(data => {
        const newWeather: IWeather = {
          tempereture: data?.current?.temperature,
          weather_icon: data.current.weather_icons[0],
          wind_speed: data.current.wind_speed,
          precip: data.current.precip
        }
        setWeather(newWeather);
    })
  }

  return (
    <div>
      <form action="" onSubmit={onSubmit}>
        <input type="text" placeholder='Enter Country' value={input} onChange={updateInput} />
        <button ref={btn} type="submit" >Submit</button>
      </form>
      <div>
        {cData === undefined ? "" :
          <>
            <img src={cData?.flag} alt="flag" />
            <h1>Capital: {cData?.capital}</h1>
            <h1>Population: {cData?.population}</h1>
            <h1>Latitute: {cData?.latlng[0]} {cData?.latlng[1]}</h1>
            <button onClick={getWeather}>Capital Weather</button>
            {
              weather === undefined ? "" : 
                <>
                  <img src={weather?.weather_icon} alt="weather" />
                  <h1>Tempereture: {weather.tempereture}</h1>
                  <h1>Wind Speed: {weather.wind_speed}</h1>
                  <h1>Precip: { weather.precip }</h1>
                </>
            }
          </>
        }
      </div>
    </div>
  )
}

export default App
