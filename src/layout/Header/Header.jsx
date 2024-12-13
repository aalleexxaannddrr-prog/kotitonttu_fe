import React, { useState } from 'react';
import styles from './Header.module.css';
import NavMenu from '../../components/NavMenu/NavMenu';
import { FaRegCircleUser } from 'react-icons/fa6';
import LoginModal from '../../components/LoginModal/LoginModal';
import UserMenu from '../../components/UserMenu/UserMenu';
import { useSelector } from 'react-redux';

export default function Header() {
	const { isAuthenticated, user } = useSelector(state => state.auth);
	const [isModalOpen, setModalOpen] = useState(false);

	// console.log('isAuthenticated:', isAuthenticated); // Лог для отладки
	// console.log('User data:', user); // Лог для отладки

	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	return (
		<div className={styles.header_wrapper}>
			<div className={styles.header_content}>
				<div className={styles.header_list}>
					{/* Отображаем NavMenu только если пользователь авторизован */}
					{isAuthenticated && <NavMenu />}
					{isAuthenticated && user ? (
						<UserMenu email={user.email} />
					) : (
						<button className={styles.header_btn} onClick={openModal}>
							<FaRegCircleUser className={styles.header_btn_icon} />
							<span>Войти</span>
						</button>
					)}
				</div>
			</div>
			{isModalOpen && <LoginModal closeModal={closeModal} />}
		</div>
	);
}
