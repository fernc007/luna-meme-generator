// src/components/MemeEditor.js
import React, { useState } from 'react';

function MemeEditor({ onCreateMeme }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [text, setText] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedImage && text) {
      onCreateMeme({ image: selectedImage, text });
    }
  };

  return (
    <div className="meme-editor">
      <h2>Create Your Meme</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Enter your text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Create Meme</button>
      </form>
      {selectedImage && (
        <div className="meme-preview">
          <img src={selectedImage} alt="Selected for meme" />
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default MemeEditor;
