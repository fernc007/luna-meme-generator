import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

function MemeVoting() {
  const [memes, setMemes] = useState([]);
  
  useEffect(() => {
    const fetchMemes = async () => {
      const { data, error } = await supabase
        .from('memes')
        .select('*');
        
      if (error) {
        console.error('Error fetching memes:', error.message);
        return;
      }

      setMemes(data);
    };

    fetchMemes();
  }, []);

  const handleVote = async (id, voteType) => {
    const { data, error } = await supabase
      .from('memes')
      .update({ [`${voteType}Votes`]: supabase.raw('?? + 1', [`${voteType}Votes`]) })
      .eq('id', id);

    if (error) {
      console.error('Error voting:', error.message);
    } else {
      setMemes(memes.map(meme => meme.id === id ? { ...meme, [`${voteType}Votes`]: meme[`${voteType}Votes`] + 1 } : meme));
    }
  };

  return (
    <div className="meme-voting">
      <h2>Vote on Memes</h2>
      {memes.map((meme) => (
        <div key={meme.id} className="meme-item">
          <img src={meme.image} alt="Meme" />
          <p>{meme.text}</p>
          <button onClick={() => handleVote(meme.id, 'up')}>👍 {meme.upVotes}</button>
          <button onClick={() => handleVote(meme.id, 'down')}>👎 {meme.downVotes}</button>
        </div>
      ))}
    </div>
  );
}

export default MemeVoting;
