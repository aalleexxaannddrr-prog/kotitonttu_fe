import React, { useState, useEffect } from 'react';
import styles from './ConfirmationCode.module.css';
import { approvedStatusKotibonus } from '../../../store/slices/approvedStatusKotibonusSlice';
import { rejectedStatusKotibonus } from '../../../store/slices/rejectedStatusKotibonusSlice';
import { useDispatch } from 'react-redux';
import RejectionModal from '../RejectionModal/RejectionModal';

export default function ConfirmationCode({
	requestId, // BonusRequestId для функций
	barcode, // Barcode для отображения
	points, // Points для отображения
	bearerToken,
	status,
}) {
	const dispatch = useDispatch();
	const [isApproved, setIsApproved] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	useEffect(() => {
		if (status === 'APPROVED') {
			setIsApproved(true);
			setIsRejected(false);
		} else if (status === 'REJECTED') {
			setIsApproved(false);
			setIsRejected(true);
		} else {
			setIsApproved(false);
			setIsRejected(false);
		}
	}, [status]);

	const handleApprove = () => {
		dispatch(
			approvedStatusKotibonus({
				requestId, // Используем bonusRequestId
				rejectionMessage: '',
				bearerToken,
			})
		)
			.unwrap()
			.then(() => setIsApproved(true))
			.catch(error =>
				console.error('Ошибка при выполнении запроса на одобрение:', error)
			);
	};

	const handleRejectSubmit = rejectionMessage => {
		dispatch(
			rejectedStatusKotibonus({
				requestId, // Используем bonusRequestId
				rejectionMessage,
				bearerToken,
			})
		)
			.unwrap()
			.then(() => {
				setIsRejected(true);
				setIsModalOpen(false);
				setErrorMessage(null);
			})
			.catch(error => {
				console.error('Ошибка при выполнении запроса на отклонение:', error);
				setErrorMessage('Ошибка: ' + error.message);
			});
	};

	const handleReject = () => {
		setIsModalOpen(true);
	};

	return (
		<div className={styles.confirmation_card}>
			<div className={styles.descr_info}>
				<div className={styles.amount}>
					<h4 className={styles.descr_title}>Код</h4>
					<p className={styles.descr}>{barcode || 'Нет данных'}</p>{' '}
					{/* Barcode */}
				</div>
				<div>
					<h4 className={styles.descr_title}>Сумма бонусов</h4>
					<p className={styles.descr}>{points || 'Нет данных'}</p>{' '}
					{/* Points */}
				</div>
			</div>

			{errorMessage && <p className={styles.error}>{errorMessage}</p>}

			{isApproved ? (
				<p className={styles.status}>Заявка одобрена!</p>
			) : isRejected ? (
				<p className={styles.status}>Заявка отклонена!</p>
			) : (
				<div className={styles.btn_card}>
					<button className={styles.btn} onClick={handleApprove}>
						Подтвердить
					</button>
					<button className={styles.btn} onClick={handleReject}>
						Отклонить
					</button>
				</div>
			)}

			<RejectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleRejectSubmit}
			/>
		</div>
	);
}
