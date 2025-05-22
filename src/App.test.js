import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import APIComparisonTool from './App';

// Mock global fetch for API calls
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      headers: { get: () => 'application/json' },
      json: () =>
        Promise.resolve({
          choices: [
            { message: { content: 'Mocked response from API' } }
          ]
        }),
    })
  );

  // Mock speech synthesis to avoid errors
  window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
    paused: false,
    speaking: false,
  };
});

afterEach(() => {
  global.fetch.mockClear();
});

// Test 1: Renders prompt and "Test All APIs" button
test('renders prompt input and test button', () => {
  render(<APIComparisonTool />);
  expect(screen.getByLabelText(/Prompt/i)).toBeInTheDocument();
  expect(screen.getByText(/Test All APIs/i)).toBeInTheDocument();
});

// Test 2: Updates prompt value correctly
test('updates prompt input when user types', () => {
  render(<APIComparisonTool />);
  const promptInput = screen.getByLabelText(/Prompt/i);
  fireEvent.change(promptInput, { target: { value: 'Hello World' } });
  expect(promptInput.value).toBe('Hello World');
});

// Test 3: Adds and removes an API configuration block
test('adds and removes API configuration block', () => {
  render(<APIComparisonTool />);
  const addButton = screen.getByText(/Add API/i);

  fireEvent.click(addButton);
  expect(screen.getAllByPlaceholderText(/API Endpoint URL/i).length).toBeGreaterThan(1);

  const removeButtons = screen.getAllByText(/Remove/i);
  fireEvent.click(removeButtons[1]);
  expect(screen.getAllByPlaceholderText(/API Endpoint URL/i).length).toBe(1);
});

// Test 4: Mocks API call and displays the response
test('calls API and shows mocked response', async () => {
  render(<APIComparisonTool />);
  const promptInput = screen.getByLabelText(/Prompt/i);
  fireEvent.change(promptInput, { target: { value: 'Test Prompt' } });

  const testButton = screen.getByText(/Test All APIs/i);
  fireEvent.click(testButton);

  await waitFor(() => {
    expect(screen.getByText(/Mocked response from API/i)).toBeInTheDocument();
  });
});

// Test 5: Ensures speech synthesis is called when response is generated
test('calls speech synthesis on first API response', async () => {
  render(<APIComparisonTool />);
  const promptInput = screen.getByLabelText(/Prompt/i);
  fireEvent.change(promptInput, { target: { value: 'Voice Test' } });

  const testButton = screen.getByText(/Test All APIs/i);
  fireEvent.click(testButton);

  await waitFor(() => {
    expect(window.speechSynthesis.speak).toHaveBeenCalled();
  });
});
