import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import styles from './VerificationInfoContainer.module.css';
import VerificationPhotos from '../VerificationPhotos/VerificationPhotos';
import VerificationApprovalForm from '../VerificationApprovalForm/VerificationApprovalForm';
import { fetchPendingPassVerificationData } from '../../../../store/slices/pendingPassVerificationSlice';
import { fetchApprovedPassVerificationData } from '../../../../store/slices/approvedPassVerificationDataSlice';
import { fetchRejectedPassVerificationData } from '../../../../store/slices/rejectedPassVerificationData';
import { UserProvider } from '../../../../context/UserContext';
import VerificationUserInfo from '../VerificationUserInfo/VerificationUserInfo';

export default function VerificationInfoContainer() {
	const { documentVerificationId } = useParams(); // Получаем ID верификации из URL
	const dispatch = useDispatch();

	// Redux данные
	const pendingData = useSelector(
		state => state.pendingPassVerificationData.data
	);
	const approvedData = useSelector(
		state => state.approvedPassVerificationData.data
	);
	const rejectedData = useSelector(
		state => state.rejectedPassVerificationData.data
	);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const [isLoading, setIsLoading] = useState(true);
	const [verification, setVerification] = useState(null);
	const [email, setEmail] = useState(null);

	// Загружаем данные
	useEffect(() => {
		Promise.all([
			dispatch(fetchPendingPassVerificationData()).unwrap(),
			dispatch(fetchApprovedPassVerificationData()).unwrap(),
			dispatch(fetchRejectedPassVerificationData()).unwrap(),
		])
			.then(() => setIsLoading(false))
			.catch(error => {
				console.error('Ошибка загрузки данных:', error);
				setIsLoading(false);
			});
	}, [dispatch]);

	// Ищем верификацию и соответствующий email
	useEffect(() => {
		if (!isLoading) {
			const allVerifications = [
				...pendingData.flatMap(item =>
					item.documentVerifications.map(v => ({ ...v, email: item.email }))
				),
				...approvedData.flatMap(item =>
					item.documentVerifications.map(v => ({ ...v, email: item.email }))
				),
				...rejectedData.flatMap(item =>
					item.documentVerifications.map(v => ({ ...v, email: item.email }))
				),
			];

			const foundVerification = allVerifications.find(
				v => String(v.documentVerificationId) === String(documentVerificationId)
			);

			if (foundVerification) {
				setVerification(foundVerification);
				setEmail(foundVerification.email); // Устанавливаем email
			}
		}
	}, [
		documentVerificationId,
		pendingData,
		approvedData,
		rejectedData,
		isLoading,
	]);

	if (isLoading) {
		return <div>Загрузка данных...</div>;
	}

	if (!verification) {
		return <div>Верификация с ID {documentVerificationId} не найдена</div>;
	}

	if (!email) {
		return <div>Email для этой верификации не найден</div>;
	}

	const status = verification.status || 'Неизвестно';
	const rejectionMessage =
		status === 'REJECTED'
			? verification.rejectionMessage || 'Причина не указана'
			: null;

	return (
		<UserProvider email={email}>
			<div className={styles.cardWrapper}>
				<div className={styles.content}>
					<VerificationUserInfo />
					<div className={styles.combinedCard}>
						<VerificationPhotos
							targetEmail={email}
							verificationId={verification.documentVerificationId}
						/>
						{status === 'PENDING' ? (
							<VerificationApprovalForm
								verificationId={verification.documentVerificationId}
								initialStatus={status}
								bearerToken={bearerToken}
							/>
						) : status === 'APPROVED' ? (
							<p className={styles.status}>Верификация одобрена!</p>
						) : (
							<div className={styles.rejectionDetails}>
								<p className={styles.status}>Верификация отклонена!</p>
								<p>Причина: {rejectionMessage}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</UserProvider>
	);
}
