import React, { useState, useEffect } from 'react';
import styles from './ConfirmationCode.module.css';
import { approvedStatusKotibonus } from '../../../store/slices/approvedStatusKotibonusSlice';
import { rejectedStatusKotibonus } from '../../../store/slices/rejectedStatusKotibonusSlice';
import { useDispatch } from 'react-redux';
import RejectionModal from '../RejectionModal/RejectionModal';

export default function ConfirmationCode({
	requestId,
	barcodeId,
	rejectionMessage,
	bearerToken,
	status,
}) {
	const dispatch = useDispatch();
	const [isApproved, setIsApproved] = useState(false);
	const [isRejected, setIsRejected] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);

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
				requestId: barcodeId,
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
		console.log('Отправляемые данные:', {
			requestId: barcodeId,
			rejectionMessage,
			bearerToken,
		});

		dispatch(
			rejectedStatusKotibonus({
				requestId: barcodeId,
				rejectionMessage,
				bearerToken,
			})
		)
			.unwrap()
			.then(() => {
				setIsRejected(true);
				setIsModalOpen(false);
			})
			.catch(error =>
				console.error('Ошибка при выполнении запроса на отклонение:', error)
			);
	};

	const handleReject = () => {
		setIsModalOpen(true);
	};

	return (
		<div className={styles.confirmation_card}>
			<div className={styles.descr_info}>
				<div className={styles.amount}>
					<h4 className={styles.descr_title}>Код</h4>
					<p className={styles.descr}>{requestId}</p>
				</div>
				<div>
					<h4 className={styles.descr_title}>Сумма бонусов</h4>
					<p className={styles.descr}>{rejectionMessage}</p>
				</div>
			</div>

			{/* Сообщение о статусе заявки */}
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

			{/* Модальное окно */}
			<RejectionModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleRejectSubmit}
			/>
		</div>
	);
}
