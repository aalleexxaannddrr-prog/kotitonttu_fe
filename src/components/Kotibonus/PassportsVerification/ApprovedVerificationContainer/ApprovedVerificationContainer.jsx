import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedVerificationTable from '../ApprovedVerificationTable/ApprovedVerificationTable';
import { fetchApprovedPassVerificationData } from '../../../../store/slices/approvedPassVerificationDataSlice';

export default function ApprovedVerificationContainer() {
	const dispatch = useDispatch();
	const { data, status, error } = useSelector(
		state => state.approvedPassVerificationData
	);

	useEffect(() => {
		dispatch(fetchApprovedPassVerificationData()); // Загружаем данные верификаций
	}, [dispatch]);

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
				<ApprovedVerificationTable data={data} />
			) : (
				<div>Нет данных для отображения</div>
			)}
		</div>
	);
}
