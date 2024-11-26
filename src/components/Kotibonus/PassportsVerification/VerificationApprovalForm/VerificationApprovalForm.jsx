import React, { useEffect, useState } from 'react';
import styles from './VerificationApprovalForm.module.css';
import { useDispatch } from 'react-redux';
import VerificationRejectionModal from '../VerificationRejectionModal/VerificationRejectionModal';
import { approveVerificationStatus } from '../../../../store/slices/approvedVerificationSlice';
import { rejectVerificationStatus } from '../../../../store/slices/rejectiVerificationSlice';

export default function VerificationApprovalForm({
	verificationId,
	initialStatus,
	bearerToken,
}) {
	const dispatch = useDispatch();
	const [status, setStatus] = useState(initialStatus);
	const [isModalOpen, setIsModalOpen] = useState(false);

	useEffect(() => {
		setStatus(initialStatus);
	}, [initialStatus]);

	const handleApprove = () => {
		if (!bearerToken) {
			console.error('Bearer token отсутствует');
			return;
		}

		dispatch(
			approveVerificationStatus({
				documentVerificationId: verificationId,
				rejectionMessage: '',
				bearerToken,
			})
		)
			.unwrap()
			.then(() => {
				setStatus('APPROVED');
			})
			.catch(error =>
				console.error('Ошибка при подтверждении верификации:', error)
			);
	};

	const handleRejectSubmit = rejectionReason => {
		if (!bearerToken) {
			console.error('Bearer token отсутствует');
			return;
		}

		dispatch(
			rejectVerificationStatus({
				documentVerificationId: verificationId,
				rejectionMessage: rejectionReason,
				bearerToken,
			})
		)
			.unwrap()
			.then(() => {
				setStatus('REJECTED');
				setIsModalOpen(false);
			})
			.catch(error =>
				console.error('Ошибка при отклонении верификации:', error)
			);
	};

	const handleReject = () => {
		setIsModalOpen(true);
	};

	return (
		<div className={styles.confirmation_card}>
			{/* Условное рендеринг на основе статуса */}
			{status === 'PENDING' ? (
				<div className={styles.btn_card}>
					<button className={styles.btn} onClick={handleApprove}>
						Одобрить
					</button>
					<button className={styles.btn} onClick={handleReject}>
						Отклонить
					</button>
				</div>
			) : status === 'APPROVED' ? (
				<p className={styles.statusApproved}>Верификация одобрена!</p>
			) : (
				<p className={styles.statusRejected}>Верификация отклонена!</p>
			)}

			{/* Модальное окно для отклонения */}
			<VerificationRejectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleRejectSubmit}
			/>
		</div>
	);
}
