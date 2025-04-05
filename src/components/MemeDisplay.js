import React from 'react';

function MemeDisplay({ memes }) {
  // Check if memes is an array before rendering
  if (!Array.isArray(memes)) {
    console.error('Expected memes to be an array, but got:', memes);
    return <p>Failed to load memes.</p>;
  }

  return (
    <div className="meme-display">
      <h2>Memes</h2>
      <div className="memes-list">
        {memes.length === 0 ? (
          <p>No memes to display.</p>
        ) : (
          memes.map((meme, index) => (
            <div key={index} className="meme-item">
              <img src={meme.image_url} alt={meme.text} />
              <p>{meme.text}</p>
              <div className="votes">
                <button>Upvote {meme.upvotes}</button>
                <button>Downvote {meme.downvotes}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MemeDisplay;
