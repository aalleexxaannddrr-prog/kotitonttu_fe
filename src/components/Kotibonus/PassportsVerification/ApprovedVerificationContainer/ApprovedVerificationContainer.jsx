import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ApprovedVerificationTable from '../ApprovedVerificationTable/ApprovedVerificationTable';
import { fetchApprovedPassVerificationData } from '../../../../store/slices/approvedPassVerificationDataSlice';

export default function ApprovedVerificationContainer() {
	const dispatch = useDispatch();
	const { status } = useSelector(state => state.approvedPassVerificationData);

	useEffect(() => {
		dispatch(fetchApprovedPassVerificationData()); // Загружаем данные верификаций
	}, [dispatch]);

	if (status === 'loading') {
		return <div>Loading...</div>;
	}

	if (status === 'error') {
		return <div>Error loading approved verifications</div>;
	}

	return (
		<div className='container'>
			<ApprovedVerificationTable />
		</div>
	);
}
