import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RejectedVerificationTable from '../RejectedVerificationTable/RejectedVerificationTable';
import { fetchRejectedPassVerificationData } from '../../../../store/slices/rejectedPassVerificationData';

export default function RejectedVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.rejectedPassVerificationData
	);

	useEffect(() => {
		dispatch(fetchRejectedPassVerificationData()); // Загружаем данные отклоненных заявок
	}, [dispatch]);

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
				<RejectedVerificationTable data={data} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
