import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';  // Import for extended matchers
import Upload from '../src/components/Upload'; // Adjust path as needed
import MyContext from '../src/components/MyContext'; // Adjust path as needed
import axios from 'axios';
import { vi } from 'vitest';  // Import vi for mocking

// Mock axios to prevent real API calls
vi.mock('axios');  // Use vi.mock to mock axios

describe('Upload Component', () => {
  const contextValue = { apiKey: 'testApiKey', endpoint: 'http://localhost:5000/api/upload' };

  test('renders upload button and file input', () => {
    render(
      <MyContext.Provider value={contextValue}>
        <Upload />
      </MyContext.Provider>
    );
    expect(screen.getByText(/upload files/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/upload/i)).toBeInTheDocument();
  });

  test('shows message when no file is selected', async () => {
    render(
      <MyContext.Provider value={contextValue}>
        <Upload />
      </MyContext.Provider>
    );
    fireEvent.click(screen.getByText(/upload files/i));

    await waitFor(() => {
      expect(screen.getByText(/please select at least one file!/i)).toBeInTheDocument();
    });
  });

  // test('displays progress bar during upload', async () => {
  //   const mockResponse = { data: { success: true } };
  //   axios.post.mockResolvedValueOnce(mockResponse);
  
  //   render(
  //     <MyContext.Provider value={contextValue}>
  //       <Upload />
  //     </MyContext.Provider>
  //   );
  
  //   const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  //   const input = screen.getByLabelText(/upload/i);
  
  //   fireEvent.change(input, { target: { files: [file] } });
  //   fireEvent.click(screen.getByText(/upload files/i));
  //   // Use findByText to wait for the upload in progress message
  //   await waitFor(() => expect(screen.findByText(/upload in progress/i)).toBeInTheDocument());
  //   // Check for the progress bar
  //   expect(screen.getByRole('progressbar')).toBeInTheDocument();
  // });
  
  test('should clear files after successful upload', async () => {
    const contextValue = { apiKey: 'your-api-key', endpoint: 'your-endpoint' };
  
    const { getByLabelText, getByText, getByTestId } = render(
      <MyContext.Provider value={contextValue}>
        <Upload />
      </MyContext.Provider>
    );
  
    const inputFile = getByLabelText('Upload');
    const file = new File(['dummy content'], 'example.png', { type: 'image/png' });
  
    fireEvent.change(inputFile, { target: { files: [file] } });
    expect(inputFile.files.length).toBe(1);
  
    fireEvent.click(getByText('Upload Files'));
  
    await waitFor(() => {
      // Check the length of files directly from the exposed state
      expect(getByTestId('file-length').textContent).toBe('0');
    });
  });
  
});

  

