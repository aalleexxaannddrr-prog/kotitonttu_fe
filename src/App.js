import { Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./layout/Header/Header";
import MainPage from "./pages/MainPage/MainPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import TypesPage from "./pages/TypesPage/TypesPage";
import { useEffect } from "react";
import { fetchAllTypes } from "./store/slices/typesSlice";
import { useDispatch } from "react-redux";
import ProductsByTypesPage from "./pages/ProductsByTypesPage/ProductsByTypesPage";
import { fetchProductsByTypes } from "./store/slices/dataSlice";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllTypes());
		dispatch(fetchProductsByTypes());
	}, [dispatch]);

	return (
		<div className='App'>
			<Header />
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/types' element={<TypesPage />} />
				<Route path='/types/all/:id' element={<ProductsByTypesPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
