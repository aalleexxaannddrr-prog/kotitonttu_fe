import { Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './layout/Header/Header';
import MainPage from './pages/MainPage/MainPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';

function App() {
  return (
		<div className='App'>
			<Header />
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/products' element={<ProductsPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
