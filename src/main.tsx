import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client'

createRoot(document.getElementById('root')!).render(
  <ChuckNorrisJokesApp jokesNumber={3} />
)

const API_URL = 'https://api.chucknorris.io/jokes/random';

interface Joke {
  categories: string[];
  created_at: string;
  icon_url: string;
  id: string;
  updated_at: string;
  url: string;
  value: string;
};

function ChuckNorrisJokesApp({jokesNumber = 3}: {jokesNumber?: number}) {
  // Styles
  const tableStyle  = {
    width: '100%',
    maxWidth: '600px',
    border: '1px solid black'
  };

  const theadStyle = {
    backgroundColor: 'black',
    color: 'white',
    border: '1px solid black'
  };

  const thStyle = {
    border: '1px solid black'
  };

  const tdStyle = {
    border: '1px solid black'
  };

  const inputStyle = {
    width: '99%',
    marginBottom: '20px'
  };

  // Logic
  const [data, setData] = useState<Joke[]>([]);
  const [dataBackup, setDataBackup] = useState<Joke[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchData = async (jokesNumber: number) => {
    for (let i = 0; i < jokesNumber; i++) {
      const response = await fetch(API_URL);
      const newJoke: Joke = await response.json();
      setData((x) => [...x, newJoke]);
      setDataBackup((x) => [...x, newJoke]);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasSearched) { setHasSearched(true) };
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') { setData([...dataBackup]); return };
    setData([...dataBackup.filter((joke) => joke.value.toLowerCase().includes(searchTerm))]);
  };

  useEffect(() => {
    fetchData(jokesNumber);
  }, [jokesNumber]);

  // Render
  return (
    <>
      <h1>Chuck Norris Jokes App</h1>
      <input name='searchInput' style={inputStyle} type='text' placeholder='Search Jokes' onChange={handleSearch} />
      <table style={tableStyle}>
        <thead style={theadStyle}>
          <tr>
            <th style={thStyle}>Random Jokes</th>
          </tr>
        </thead>
        <tbody>
          {
            data.map((joke) => (
              <tr key={joke.id}>
                <td style={tdStyle}>{joke.value}</td>
              </tr>
            ))
          }
          {
            (data.length === 0) && (hasSearched) &&
            <tr>
              <td>We couldn't find any jokes for you</td>
            </tr>
          }
        </tbody>
      </table>
    </>
  );
}
