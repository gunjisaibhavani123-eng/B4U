import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import theme from '@shared/styles/theme';
import ErrorBoundary from '@shared/components/ErrorBoundary';
import AppRouter from '@/routes/AppRouter';

export default function App() {
  return (
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <ErrorBoundary>
            <AppRouter />
          </ErrorBoundary>
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  );
}
