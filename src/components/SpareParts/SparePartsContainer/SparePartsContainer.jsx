import React, { useState } from 'react';
import styles from './SparePartsContainer.module.css';
import { useSelector } from 'react-redux';
import SparePartsTable from '../SparePartsTable/SparePartsTable';
import SparePartsModal from '../SparePartsModal/SparePartsModal';
import AddSpareParts from '../AddSpareParts/AddSpareParts';

export default function SparePartsContainer() {
	const bearerToken = useSelector(state => state.auth.bearerToken);
	const [showModal, setShowModal] = useState(false);

	// Если токен отсутствует
	if (!bearerToken) {
		console.error('Bearer token is missing!');
		return <div>Error: Missing authentication token.</div>;
	}

	return (
		<div className='container'>
			{showModal && (
				<SparePartsModal onClose={() => setShowModal(false)}>
					<AddSpareParts
						bearerToken={bearerToken}
						onClose={() => setShowModal(false)}
					/>
				</SparePartsModal>
			)}
			<button className={styles.add_button} onClick={() => setShowModal(true)}>
				Добавить Запчасть
			</button>
			<div>
				<h2 className={styles.title}>Список запчастей по серии</h2>
				<SparePartsTable bearerToken={bearerToken} />
			</div>
		</div>
	);
}
