// import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { ThemeProvider } from 'styled-components';
import { darkTheme } from './styles/theme';
import { GlobalStyles } from './styles/GlobalStyles';
import { AppRoutes } from './routes';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyles />
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;