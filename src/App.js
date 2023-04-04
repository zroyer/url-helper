import React, { useEffect, useState } from 'react';
import './App.css';

const FORMAT_OPTIMIZELY_AUDIENCE_FILTERING = ['and', ['or', ['or']]];

const App = () => {
  const [urls, setUrls] = useState('');
  const [format, setFormat] = useState('audience-filtering');
  const [formattedUrls, setFormattedUrls] = useState('');
  const [userClickedCopy, setUserClickedCopy] = useState(false);

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

    const resultHandlerMap = {
      'audience-filtering': handleFormatOptimizelyAudienceFiltering,
      'javascript-array': handleDisplayResults,
    };

    resultHandlerMap[format](sanitizedUrls);
  };

  const handleDisplayResults = (result) => {
    setFormattedUrls(JSON.stringify(result, null, 2));
  };

  const handleClickCopy = () => {
    setUserClickedCopy(true);
    navigator.clipboard.writeText(formattedUrls);
  };

  const handleFormatOptimizelyAudienceFiltering = (urls) => {
    FORMAT_OPTIMIZELY_AUDIENCE_FILTERING[1][1][1] = urls.map((url) => ({
      name: 'page_url',
      value: url,
      match_type: 'substring',
      type: 'custom_attribute',
    }));
    handleDisplayResults(FORMAT_OPTIMIZELY_AUDIENCE_FILTERING);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>URL Helper</h2>
      </header>
      <form className="input-form" onSubmit={handleClickFormat}>
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
                <option value="audience-filtering">Audience Filtering</option>
              </optgroup>
              <optgroup label="JavaScript">
                {' '}
                <option value="javascript-array">Array</option>
              </optgroup>
            </select>
          </div>
          <button onClick={(e) => handleClickFormat(e)}>Format</button>
        </div>
      </form>
      {formattedUrls.length > 0 ? (
        <div className="result-form">
          <label htmlFor="result">
            <b>Result:</b>
          </label>
          <textarea
            id="result"
            rows={formattedUrls.split(/\r|\r\n|\n/).length}
            value={formattedUrls}
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
