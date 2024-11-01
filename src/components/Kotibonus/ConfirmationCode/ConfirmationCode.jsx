import React from 'react'
import styles from './ConfirmationCode.module.css'
import { approvedStatusKotibonus } from '../../../store/slices/approvedStatusKotibonusSlice';
import { useDispatch } from 'react-redux';
import { rejectedStatusKotibonus } from '../../../store/slices/rejectedStatusKotibonusSlice';

export default function ConfirmationCode({ requestId, rejectionMessage, bearerToken }) {
	const dispatch = useDispatch();

	const handleApprove = () => {
		approvedStatusKotibonus(requestId, rejectionMessage, bearerToken)
			.then(result =>
				console.log('Запрос на одобрение выполнен успешно:', result)
			)
			.catch(error =>
				console.error('Ошибка при выполнении запроса на одобрение:', error)
			);
	};

	const handleReject = () => {
		dispatch(
			rejectedStatusKotibonus({ requestId, rejectionMessage, bearerToken })
		)
			.unwrap()
			.then(result =>
				console.log('Запрос на отклонение выполнен успешно:', result)
			)
			.catch(error =>
				console.error('Ошибка при выполнении запроса на отклонение:', error)
			);
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
			<div className={styles.btn_card}>
				<button className={styles.btn} onClick={handleApprove}>
					Подтвердить
				</button>
				<button className={styles.btn} onClick={handleReject}>
					Отклонить
				</button>
			</div>
		</div>
	);
}
