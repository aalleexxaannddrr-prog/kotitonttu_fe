import React, { useEffect, useState } from 'react';
import styles from './VerificationInfoContainer.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import VerificationUserInfo from '../VerificationUserInfo/VerificationUserInfo';
import VerificationPhotos from '../VerificationPhotos/VerificationPhotos';
import VerificationApprovalForm from '../VerificationApprovalForm/VerificationApprovalForm';
import { fetchUsers } from '../../../../store/slices/usersSlice';
import { fetchPendingPassVerificationData } from '../../../../store/slices/pendingPassVerificationSlice';

export default function VerificationInfoContainer() {
	const { userId, documentVerificationId } = useParams();
	const dispatch = useDispatch();

	// Redux данные
	const { data: verificationData, status: verificationFetchStatus } =
		useSelector(state => state.pendingPassVerificationData);
	const { users, status: usersFetchStatus } = useSelector(state => state.users);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const [user, setUser] = useState(null);
	const [verification, setVerification] = useState(null);

	// Загружаем данные
	useEffect(() => {
		if (usersFetchStatus === 'idle') {
			dispatch(fetchUsers());
		}
		if (verificationFetchStatus === 'idle') {
			dispatch(fetchPendingPassVerificationData());
		}
	}, [dispatch, usersFetchStatus, verificationFetchStatus]);

	// Найти пользователя по userId
	useEffect(() => {
		if (users && userId) {
			const foundUser = users.find(user => String(user.id) === String(userId));
			setUser(foundUser);
		}
	}, [users, userId]);

	// Найти данные верификации пользователя
	useEffect(() => {
		if (user && verificationData) {
			const userVerification = verificationData.find(
				item => item.email === user.email
			);

			if (userVerification?.documentVerifications?.length > 0) {
				const specificVerification =
					userVerification.documentVerifications.find(
						v =>
							String(v.documentVerificationId) ===
							String(documentVerificationId)
					);
				setVerification(specificVerification);
			}
		}
	}, [user, verificationData, documentVerificationId]);

	// Проверки
	if (verificationFetchStatus === 'loading' || usersFetchStatus === 'loading') {
		return <div>Данные загружаются...</div>;
	}

	if (!user) {
		return <div>Пользователь с ID {userId} не найден</div>;
	}

	if (!verification) {
		return (
			<div>
				Верификация с ID {documentVerificationId} для пользователя {user.email}{' '}
				не найдена
			</div>
		);
	}

	return (
		<div className={styles.cardWrapper}>
			<div className={styles.content}>
				<VerificationUserInfo user={user} />
				<div className={styles.combinedCard}>
					<VerificationPhotos
						targetEmail={user.email}
						verificationId={verification.documentVerificationId}
					/>
					{verification.status === 'PENDING' ? (
						<VerificationApprovalForm
							verificationId={verification.documentVerificationId}
							initialStatus={verification.status}
							bearerToken={bearerToken}
						/>
					) : verification.status === 'APPROVED' ? (
						<p className={styles.statusApproved}>Верификация одобрена!</p>
					) : (
						<p className={styles.statusRejected}>Верификация отклонена!</p>
					)}
				</div>
			</div>
		</div>
	);
}
