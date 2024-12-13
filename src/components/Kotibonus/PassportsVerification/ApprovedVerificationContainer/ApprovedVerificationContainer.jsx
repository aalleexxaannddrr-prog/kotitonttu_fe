import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedVerificationTable from '../ApprovedVerificationTable/ApprovedVerificationTable';
import { fetchApprovedPassVerificationData } from '../../../../store/slices/approvedPassVerificationDataSlice';

export default function ApprovedVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.approvedPassVerificationData
	);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	useEffect(() => {
		dispatch(fetchApprovedPassVerificationData()); // Загружаем данные верификаций
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
			<h1>Принятые заявки на верификацию</h1>
			{data && data.length > 0 ? (
				<ApprovedVerificationTable data={data} bearerToken={bearerToken} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
