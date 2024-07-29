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
import ExplodedViewPage from "./pages/ExplodedViewPage/ExplodedViewPage";
import SparePartsPage from "./pages/SparePartsPage/SparePartsPage";
import ErrorСodesPage from "./pages/ErrorСodesPage/ErrorСodesPage";
import BarcodesPage from "./pages/BarcodesPage/BarcodesPage";
import PassportsPage from "./pages/PassportsPage/PassportsPage";
import ServiceCentersPage from "./pages/ServiceCentersPage/ServiceCentersPage";
import { fetchServiceCentres } from "./store/slices/servicesSlice";

function App() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchAllTypes());
		dispatch(fetchProductsByTypes());
		dispatch(fetchServiceCentres());
	}, [dispatch]);

	return (
		<div className='App'>
			<Header />
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/types' element={<TypesPage />} />
				<Route path='/types/all/:id' element={<ProductsByTypesPage />} />
				<Route path='/service-centers' element={<ServiceCentersPage />} />
				<Route path='/exploded-view' element={<ExplodedViewPage />} />
				<Route path='/spare-parts' element={<SparePartsPage />} />
				<Route path='/passports' element={<PassportsPage />} />
				<Route path='/error-codes' element={<ErrorСodesPage />} />
				<Route path='/barcodes' element={<BarcodesPage />} />
				<Route path='*' element={<NotFoundPage />} />
			</Routes>
		</div>
	);
}

export default App;
