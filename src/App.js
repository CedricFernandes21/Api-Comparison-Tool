import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';

export default function APIComparisonTool() {
  const [prompt, setPrompt] = useState('');
  const [apiEndpoints, setApiEndpoints] = useState([
    {
      name: 'DeepSeek API', 
      url: '', // API endpoint URL
      apiKey: '',// Replace with your API key
      headerName: 'Authorization',
      completed: false,
      time: null,
      response: '',
      error: null,
      startTime: null
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [testStartTime, setTestStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [promptAnswer, setPromptAnswer] = useState('');
  const timerRef = useRef(null);

  const handleAddAPI = () => {
    setApiEndpoints([...apiEndpoints, {
      name: `API ${apiEndpoints.length + 1}`,
      url: '',
      apiKey: '',
      headerName: 'Authorization',
      completed: false,
      time: null,
      response: '',
      error: null,
      startTime: null
    }]);
  };

  const handleRemoveAPI = (index) => {
    const endpoints = [...apiEndpoints];
    endpoints.splice(index, 1);
    setApiEndpoints(endpoints);
  };

  const handleInputChange = (index, field, value) => {
    const endpoints = [...apiEndpoints];
    endpoints[index][field] = value;
    setApiEndpoints(endpoints);
  };

  useEffect(() => {
    if (isLoading && testStartTime != null) {
      timerRef.current = setInterval(() => {
        const now = performance.now();
        setElapsedTime((now - testStartTime) / 1000);
      }, 10);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isLoading, testStartTime]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    const ms = Math.floor((seconds % 1) * 1000).toString().padStart(3, '0');
    return `${m}:${s}.${ms}`;
  };

  const testAPIs = async () => {
    if (!prompt.trim()) return alert('Please enter a prompt');

    const reset = apiEndpoints.map(a => ({ ...a, completed: false, time: null, response: '', error: null }));
    setApiEndpoints(reset);
    setIsLoading(true);
    setPromptAnswer('');
    setTestStartTime(performance.now());

    await Promise.all(reset.map((api, idx) => api.url && api.apiKey
      ? fetchFromAPI(api, idx)
      : Promise.resolve()
    ));

    setIsLoading(false);
  };

  const fetchFromAPI = async (api, index) => {
    const start = performance.now();
    const endpoints = [...apiEndpoints];
    endpoints[index].startTime = start;
    setApiEndpoints(endpoints);

    try {
      const res = await fetch(api.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          [api.headerName]: `Bearer ${api.apiKey}`
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "" },
            { role: "user", content: prompt }
          ],
          temperature: 0.8,
          top_p: 0.1,
          max_tokens: 2048,
          model: "deepseek/DeepSeek-V3-0324"
        })
      });

      const contentType = res.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        data = { response: text };
      }

      const duration = performance.now() - start;

      const text =
        data.choices ? data.choices[0].message.content : 
        data.response ||
        data.generated_text ||
        data.message ||
        JSON.stringify(data);

      const updated = [...apiEndpoints];
      updated[index] = {
        ...updated[index],
        completed: true,
        time: duration,
        response: text
      };
      setApiEndpoints(updated);

      if (index === 0) setPromptAnswer(text);
    } catch (err) {
      const updated = [...apiEndpoints];
      updated[index] = {
        ...updated[index],
        completed: true,
        error: err.message
      };
      setApiEndpoints(updated);
    }
  };

  return (
    <div className="flex flex-col p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">API Comparison Tool</h1>

      <div className="mb-6">
        <label className="block font-medium mb-1">Prompt</label>
        <textarea
          className="w-full border p-2 rounded"
          rows={3}
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <h2 className="font-semibold mb-2">Configure APIs</h2>
        {apiEndpoints.map((api, idx) => (
          <div key={idx} className="mb-4 p-4 border rounded bg-gray-50">
            <div className="flex justify-between">
              <input
                className="font-medium border-b px-1"
                value={api.name}
                onChange={e => handleInputChange(idx, 'name', e.target.value)}
              />
              <button onClick={() => handleRemoveAPI(idx)} className="text-red-500">Remove</button>
            </div>
            <div className="mt-2 space-y-2">
              <input
                className="w-full border p-1 rounded"
                placeholder="API Endpoint URL"
                value={api.url}
                onChange={e => handleInputChange(idx, 'url', e.target.value)}
              />
              <input
                className="w-full border p-1 rounded"
                type="password"
                placeholder="API Key"
                value={api.apiKey}
                onChange={e => handleInputChange(idx, 'apiKey', e.target.value)}
              />
              <input
                className="w-full border p-1 rounded"
                placeholder="Header Name"
                value={api.headerName}
                onChange={e => handleInputChange(idx, 'headerName', e.target.value)}
              />
            </div>
          </div>
        ))}
        <button onClick={handleAddAPI} className="bg-gray-200 px-3 py-1 rounded">Add API</button>
      </div>

      <button
        onClick={testAPIs}
        disabled={isLoading}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isLoading ? 'Testing...' : 'Test All APIs'}
      </button>

      <div className="mb-6 text-center">
        <div className="text-4xl font-mono bg-gray-100 rounded p-3 inline-block">
          {formatTime(elapsedTime)}
        </div>
      </div>

      {promptAnswer && (
        <div className="mb-6">
          <h2 className="font-semibold">First API Response</h2>
          <div className="bg-gray-100 p-3 rounded whitespace-pre-wrap">{promptAnswer}</div>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-2">Response Details</h2>
        {apiEndpoints.map((api, idx) => api.completed && (
          <div key={idx} className="mb-4 p-4 border rounded">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{api.name}</h3>
              <div className="flex items-center">
                {api.error ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  <>
                    <Clock className="mr-1 text-green-600" />
                    <span className="text-green-600">{(api.time / 1000).toFixed(2)}s</span>
                  </>
                )}
              </div>
            </div>
            {api.error ? (
              <p className="text-red-500 mt-2">{api.error}</p>
            ) : (
              <pre className="mt-2 bg-gray-50 p-2 rounded overflow-auto whitespace-pre-wrap">{api.response}</pre>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
