// src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchPokemon = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=24&offset=${(currentPage - 1) * 24}`);
      const data = await response.json();
      setPokemonList(data.results);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    }
  };

  useEffect(() => {
    fetchPokemon();
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  const handleCardClick = async (pokemonName) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      setSelectedPokemon(data);
      setDialogOpen(true);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    }
  };

  const getPokemonIdFromUrl = (url) => {
    const parts = url.split('/');
    return parts[parts.length - 2];
  };

  return (
    <div className="App">
      <h1>Pokemon Cards</h1>
      <div className="pokemon-container">
        {pokemonList.map((pokemon) => (
          <div key={pokemon.name} className="pokemon-card" onClick={() => handleCardClick(pokemon.name)}>
            <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${getPokemonIdFromUrl(pokemon.url)}.png`} alt={pokemon.name} />
            <p>{pokemon.name}</p>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={handlePrevPage}>Page Précédente</button>
        <button onClick={handleNextPage}>Page Suivante</button>
      </div>
      {dialogOpen && selectedPokemon && (
        <div className="modal-overlay">
          <div className="pokemon-details">
            <h2>{selectedPokemon.name}</h2>
            <p>Numéro: {selectedPokemon.id}</p>
            <p>Type: {selectedPokemon.types.map((type) => type.type.name).join(', ')}</p>
            <p>Capacités spéciales:</p>
            <ul>
              {selectedPokemon.abilities.map((ability) => (
                <li key={ability.ability.name}>{ability.ability.name}</li>
              ))}
            </ul>
            <button onClick={() => setDialogOpen(false)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
