import React from 'react';
import styles from './VerificationUserInfo.module.css'
import UserAvatar from '../../../../assets/UserAvatar.png';

export default function VerificationUserInfo({ user }) {
	return (
		<div className={styles.user_content}>
			<img
				className={styles.image}
				// src={user?.photo || UserAvatar}
				src={UserAvatar}
				alt={`${user?.firstname || 'Не указано'} ${
					user?.lastname || 'Не указано'
				}`}
			/>
			<div className={styles.user_info_card}>
				<h3 className={styles.username}>{`${user?.firstname || 'Не указано'} ${
					user?.lastname || 'Не указано'
				}`}</h3>

				<div className={styles.user_info}>
					<p>
						<strong>Email:</strong> {user?.email || 'Не указано'}
					</p>
					<p>
						<strong>Телефон:</strong> {user?.phoneNumber || 'Не указано'}
					</p>
					<p>
						<strong>Дата рождения:</strong> {user?.dateOfBirth || 'Не указано'}
					</p>
					<p>
						<strong>Роль:</strong> {user?.workerRole || 'Не указано'}
					</p>
				</div>
			</div>
		</div>
	);
}
