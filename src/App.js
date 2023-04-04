import React, { useState } from 'react';
import './App.css';

const optimizelyTemplate = ['and', ['or', ['or']]];

const App = () => {
  const [urls, setUrls] = useState('');
  const [formattedUrls, setFormattedUrls] = useState('');

  const handleClick = () => {
    const sanitizedUrls = urls
      .replace(/['"]+/g, '') // Removes quotes (single and double)
      .replace(/[,]+/g, '\n') // Replaces commas with Line Feed (\n)
      .replace(/\r\n/g, '\n') // Replaces Carriage Return (\r) with Line Feed (\n)
      .split('\n') // Splits each URL into an array index
      .filter((line) => line); // Remove any blank lines

    formatForOptimizely(sanitizedUrls);
  };

  const formatForOptimizely = (urls) => {
    const rows = urls.map((url) => {
      return {
        name: 'page_url',
        value: url,
        match_type: 'substring',
        type: 'custom_attribute',
      };
    });

    console.log(rows);
    optimizelyTemplate[1][1].push(rows);
    setFormattedUrls(JSON.stringify(optimizelyTemplate, null, 2));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>URL Helper</h2>
      </header>
      <textarea
        rows="10"
        cols="80"
        onChange={(e) => setUrls(e.target.value)}
        value={urls}
        placeholder="Enter URLs, separated by line&#10;Quotes and commas will be stripped, but are fine to leave"
      />
      <button onClick={handleClick}>Format</button>
      <textarea rows="10" cols="80" value={formattedUrls} readOnly />
    </div>
  );
};

export default App;
