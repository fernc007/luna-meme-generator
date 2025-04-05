import React, { useState, useRef } from 'react';
import supabase from '../supabaseClient';

const memeTemplates = [
  'https://vtncarurbitlxhsekmpm.supabase.co/storage/v1/object/public/luna-meme//luna-1.jpg',
  'https://vtncarurbitlxhsekmpm.supabase.co/storage/v1/object/public/luna-meme//luna-2.jpg',
  'https://vtncarurbitlxhsekmpm.supabase.co/storage/v1/object/public/luna-meme//luna-3.jpg',
  'https://vtncarurbitlxhsekmpm.supabase.co/storage/v1/object/public/luna-meme//luna-4.jpg'
];

function MemeEditor({ addMeme }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [memeText, setMemeText] = useState('');
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}-meme.png`;
	// eslint-disable-next-line
    const { data, error } = await supabase.storage
      .from('luna-meme')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error.message);
      return null;
    }

    return fileName;
  };

  const saveMemeToDatabase = async (imageUrl, memeText) => {
    const { data, error } = await supabase
      .from('memes')
      .insert([
        {
          text: memeText,
          upVote: 0,
          image_url: imageUrl,
        },
      ])
      .select();

    if (error) {
      console.error('Error inserting meme into database:', error.message);
      return;
    }

    if (data && data.length > 0) {
      addMeme(data[0]);
    }
  };

  const drawMeme = (img) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    ctx.font = `${Math.floor(img.width / 15)}px Impact`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';

    const x = canvas.width / 2;
    const y = canvas.height - 40;

    ctx.fillText(memeText.toUpperCase(), x, y);
    ctx.strokeText(memeText.toUpperCase(), x, y);
  };

  const handleTemplateSelect = (url) => {
    setSelectedTemplate(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    img.onload = () => {
      drawMeme(img);
    };

    img.onerror = () => {
      console.error('Failed to load template image.');
    };
  };

  const processImageUpload = async () => {
    if (!selectedTemplate) return;

    setLoading(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = selectedTemplate;

    img.onload = async () => {
      drawMeme(img);

      const canvas = canvasRef.current;
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await fetch(dataUrl).then((res) => res.blob());
      const memeFile = new File([blob], 'meme.png', { type: 'image/png' });

      const imagePath = await uploadImage(memeFile);

      if (imagePath) {
        const imageUrl = `https://vtncarurbitlxhsekmpm.supabase.co/storage/v1/object/public/luna-meme/${imagePath}`;
        await saveMemeToDatabase(imageUrl, memeText);
      }

      setLoading(false);
    };

    img.onerror = () => {
      console.error('Image failed to load.');
      setLoading(false);
    };
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <input
        type="text"
        placeholder="Enter meme text"
        value={memeText}
        onChange={(e) => setMemeText(e.target.value)}
        disabled={loading}
        style={{ marginBottom: '10px', width: '100%' }}
      />

      <div className="template-selector" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {memeTemplates.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Template ${idx + 1}`}
            onClick={() => handleTemplateSelect(url)}
            style={{
              width: '100px',
              height: '100px',
              objectFit: 'cover',
              border: selectedTemplate === url ? '3px solid #007BFF' : '1px solid #ccc',
              cursor: 'pointer',
              borderRadius: '6px'
            }}
          />
        ))}
      </div>

      <button
        onClick={processImageUpload}
        disabled={loading || !memeText || !selectedTemplate}
      >
        {loading ? 'Uploading...' : 'Upload Meme'}
      </button>

      <div className="preview-box">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}

export default MemeEditor;
