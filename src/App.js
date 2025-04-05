import React, { useState } from 'react';
import MemeEditor from '/root/meme-generator/src/components/MemeEditor.js';
// import MemeDisplay from '/root/meme-generator/src/components/MemeDisplay.js';
import './index.css'; // Importing styles

function App() {
  // Initialize memes as an empty array
// eslint-disable-next-line
  const [memes, setMemes] = useState([]);

  // This function will be used to update the list of memes when a new meme is added
  const addMeme = (newMeme) => {
    setMemes((prevMemes) => [...prevMemes, newMeme]);
  };

  return (
    <div className="App">
      <h1>Luna Meme Generator</h1>
      <MemeEditor addMeme={addMeme} />
      {/*<MemeDisplay memes={memes} />*/}
    </div>
  );
}

export default App;
