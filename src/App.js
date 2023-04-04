import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [urls, setUrls] = useState('');
  const [format, setFormat] = useState('audience-filter');
  const [formattedResults, setFormattedUrls] = useState('');
  const [userClickedCopy, setUserClickedCopy] = useState(false);

  const handleClickCopy = () => {
    setUserClickedCopy(true);
    navigator.clipboard.writeText(formattedResults);
  };

  useEffect(() => {
    if (userClickedCopy) {
      setTimeout(() => setUserClickedCopy(false), 2000);
    }
  }, [userClickedCopy]);

  const handleClickFormat = (e) => {
    e.preventDefault();
    const sanitizedUrls = urls
      .replace(/['"]+/g, '') // Removes quotes (single and double)
      .replace(/[,]+/g, '\n') // Replaces commas with Line Feed (\n)
      .replace(/\r\n/g, '\n') // Replaces Carriage Return (\r) with Line Feed (\n)
      .split('\n') // Splits each URL into an array index
      .filter((line) => line); // Remove any blank lines

    const resultFormatterMap = {
      'audience-filter': handleFormatOptimizelyAudienceFilter,
      'javascript-array': handleDisplayResults,
    };

    resultFormatterMap[format](sanitizedUrls);
  };

  const handleClickClear = (e) => {
    e.preventDefault();
    setUrls('');
    setFormattedUrls('');
  };

  const handleFormatOptimizelyAudienceFilter = (urls) => {
    handleDisplayResults([
      'and',
      [
        'or',
        [
          'or',
          ...urls.map((url) => ({
            name: 'page_url',
            value: url,
            match_type: 'substring',
            type: 'custom_attribute',
          })),
        ],
      ],
    ]);
  };

  const handleDisplayResults = (result) => {
    setFormattedUrls(JSON.stringify(result, null, 2));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>URL Helper</h2>
      </header>
      <form className="input-form">
        <label htmlFor="input">
          <b>Input:</b>
        </label>
        <textarea
          rows="10"
          id="input"
          form="input-form"
          onChange={(e) => setUrls(e.target.value)}
          value={urls}
          placeholder="Enter a list of line/comma separated URLs&#10;URLs should be relative (/article/loans/student-loans/college-choice)"
        />
        <div className="form-inputs">
          <div>
            <label htmlFor="format-select">Choose a format:</label>
            <select
              id="format-select"
              onChange={(e) => setFormat(e.target.value)}
            >
              <optgroup label="Optimizely">
                <option value="audience-filter">Audience Filter</option>
              </optgroup>
              <optgroup label="JavaScript">
                <option value="javascript-array">Array</option>
              </optgroup>
            </select>
          </div>
          <div>
            <button
              onClick={(e) => handleClickClear(e)}
              disabled={urls.length < 1}
            >
              Clear
            </button>
            <button
              onClick={(e) => handleClickFormat(e)}
              disabled={urls.length < 1}
            >
              Format
            </button>
          </div>
        </div>
      </form>
      {formattedResults.length > 0 ? (
        <div className="result-form">
          <label htmlFor="result">
            <b>Result:</b>
          </label>
          <textarea
            id="result"
            rows={formattedResults.split(/\r|\r\n|\n/).length}
            value={formattedResults}
            readOnly
          />
          <button onClick={handleClickCopy} className="btn-copy">
            {userClickedCopy ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default App;
