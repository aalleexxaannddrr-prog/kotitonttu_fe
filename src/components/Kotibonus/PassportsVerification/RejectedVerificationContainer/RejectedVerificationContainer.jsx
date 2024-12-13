import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RejectedVerificationTable from '../RejectedVerificationTable/RejectedVerificationTable';
import { fetchRejectedPassVerificationData } from '../../../../store/slices/rejectedPassVerificationData';

export default function RejectedVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.rejectedPassVerificationData
	);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	useEffect(() => {
		dispatch(fetchRejectedPassVerificationData());
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
			<h1>Отклоненные заявки на верификацию</h1>
			{data && data.length > 0 ? (
				<RejectedVerificationTable data={data} bearerToken={bearerToken} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
