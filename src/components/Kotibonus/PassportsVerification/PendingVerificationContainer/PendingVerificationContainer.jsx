import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPendingPassVerificationData } from '../../../../store/slices/pendingPassVerificationSlice';
import PendingVerificationTable from '../PendingVerificationTable/PendingVerificationTable';

export default function PendingVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.pendingPassVerificationData
	);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	useEffect(() => {
		dispatch(fetchPendingPassVerificationData()); // Запускаем запрос при загрузке компонента
	}, [dispatch]);

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

	if (status === 'loading') {
		return <div>Загрузка...</div>;
	}

	if (status === 'error') {
		return <div>Ошибка: {error}</div>;
	}

	return (
		<div className='container'>
			<h1>Ожидающие заявки на верификацию</h1>
			{data.length > 0 ? (
				<PendingVerificationTable data={data} bearerToken={bearerToken} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
