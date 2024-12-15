import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './layout/Header/Header';
import MainPage from './pages/MainPage/MainPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import TypesPage from './pages/TypesPage/TypesPage';
import UserPage from './pages/UserPage/UserPage';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductsByTypesPage from './pages/ProductsByTypesPage/ProductsByTypesPage';
import ExplodedViewPage from './pages/ExplodedViewPage/ExplodedViewPage';
import SparePartsPage from './pages/SparePartsPage/SparePartsPage';
import ErrorСodesPage from './pages/ErrorСodesPage/ErrorСodesPage';
import BarcodesPage from './pages/BarcodesPage/BarcodesPage';
import ServiceCentersPage from './pages/ServiceCentersPage/ServiceCentersPage';
import PendingApplicationsPage from './pages/PendingApplicationsPage/PendingApplicationsPage';
import DetailedInfoPage from './pages/DetailedInfoPage/DetailedInfoPage';
import BonusProgramModelsPage from './pages/BonusProgramModelsPage/BonusProgramModelsPage';
import RejectedApplicationsPage from './pages/RejectedApplicationsPage/RejectedApplicationsPage';
import AcceptedApplicationsPage from './pages/ApprovedApplicationsPage/ApprovedApplicationsPage';
import ProductPassportPage from './pages/ProductPassportPage/ProductPassportPage';
import ChatsPage from './pages/ChatsPage/ChatsPage';
import { UserProvider } from './context/UserContext';
import { restoreAuth } from './store/slices/authSlice';
import PendingVerificationPage from './pages/PendingVerificationPage/PendingVerificationPage';
import ApprovedVerificationsPage from './pages/ApprovedVerificationsPage/ApprovedVerificationsPage';
import VerificationInfoPage from './pages/VerificationInfoPage/VerificationInfoPage'
import RejectedVerificationPage from './pages/RejectedVerificationPage/RejectedVerificationPage';
import BoilersPage from './pages/BoilersPage/BoilersPage';

function App() {
	const dispatch = useDispatch();
	const { isAuthenticated, isLoading } = useSelector(state => state.auth); // Получаем статус авторизации

	useEffect(() => {
		dispatch(restoreAuth()); // Восстанавливаем авторизацию при загрузке
	}, [dispatch]);

	if (isLoading) {
		// Показываем индикатор загрузки или пустой экран, пока состояние авторизации загружается
		return <div>Загрузка...</div>;
	}

	return (
		<div className='App'>
			<Header />
			<Routes>
				<Route path='/' element={<MainPage />} />
				{isAuthenticated ? (
					<>
						<Route path='/users' element={<UserPage />} />
						<Route path='/types' element={<BoilersPage />} />
						<Route path='/types/all/:id' element={<ProductsByTypesPage />} />
						<Route path='/service-centers' element={<ServiceCentersPage />} />
						<Route path='/exploded-view' element={<ExplodedViewPage />} />
						<Route path='/spare-parts' element={<SparePartsPage />} />
						<Route path='pass-product' element={<ProductPassportPage />} />
						<Route path='/error-codes' element={<ErrorСodesPage />} />
						<Route path='/chats' element={<ChatsPage />} />
						<Route path='/barcodes' element={<BarcodesPage />} />
						<Route
							path='/bonus-program/models'
							element={<BonusProgramModelsPage />}
						/>
						<Route
							path='/bonus-program/active-applications'
							element={<PendingApplicationsPage />}
						/>
						<Route
							path='/bonus-program/accepted-applications'
							element={<AcceptedApplicationsPage />}
						/>
						<Route
							path='/bonus-program/rejected-applications'
							element={<RejectedApplicationsPage />}
						/>
						<Route
							path='/detailed-info/:requestId'
							element={
								<UserProvider>
									<DetailedInfoPage />
								</UserProvider>
							}
						/>
						<Route
							path='/bonus-program/pending-verification'
							element={<PendingVerificationPage />}
						/>
						<Route
							path='/bonus-program/approved-verification'
							element={<ApprovedVerificationsPage />}
						/>
						<Route
							path='/bonus-program/rejected-verification'
							element={<RejectedVerificationPage />}
						/>

						<Route
							path='/verification-info/:documentVerificationId'
							element={
								<UserProvider>
									<VerificationInfoPage />
								</UserProvider>
							}
						/>
						<Route path='*' element={<NotFoundPage />} />
					</>
				) : (
					// Перенаправляем на главную страницу, если пользователь не авторизован
					<Route path='*' element={<Navigate to='/' replace />} />
				)}
			</Routes>
		</div>
	);
}

export default App;
