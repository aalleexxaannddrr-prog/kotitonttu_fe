import React, {useEffect, useRef, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserMenu.module.css';
import { FaRegCircleUser } from 'react-icons/fa6';
import { logout } from '../../store/slices/authSlice';
import { fetchUsers } from '../../store/slices/usersSlice';
import {fetchRejectedBonusRequests} from "../../store/slices/rejectedBonusDataSlice";
import {fetchUsersPag} from "../../store/slices/usersPaginatedSlice";

export default function UserMenu({ email }) {
	const dispatch = useDispatch();
	const [isDropdownVisible, setDropdownVisible] = useState(false);
	const { users, status, error, currentPage, totalPages } = useSelector(state => state.usersPag);
	const hasLoaded = useRef(false);

	useEffect(() => {
		if (!hasLoaded.current) {
			loadMoreUsers(0);
			hasLoaded.current = true;
		}
		dispatch(fetchRejectedBonusRequests());
	}, [dispatch]);

	useEffect(() => {
		if (currentPage < totalPages - 1) {
			loadMoreUsers(currentPage + 1); // Загружаем следующую страницу
		}
	}, [currentPage, totalPages]);

	const loadMoreUsers = async (page) => {
		try {
			await dispatch(fetchUsersPag(page)); // Загружаем текущую страницу
		} catch (error) {
			console.error("Ошибка при загрузке пользователей:", error);
		}
	};

	// Ищем пользователя по email из списка пользователей
	const user = users.find(
		u => u.email.trim().toLowerCase() === email.trim().toLowerCase()
	);

	const handleMouseEnter = () => setDropdownVisible(true);
	const handleMouseLeave = () => setDropdownVisible(false);
	const handleLogout = () => dispatch(logout());

	return (
		<div
			className={styles.user_container}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
		>
			{/* Отображаем имя пользователя, если он найден */}
			<p className={styles.user_name}>
				<FaRegCircleUser className={styles.user_name_icon} />
				<span>{user ? `${user.firstname}` : 'Пользователь'}</span>
			</p>

			{isDropdownVisible && (
				<ul className={styles.dropdown_menu}>
					<li onClick={handleLogout}>Выйти</li>
				</ul>
			)}
		</div>
	);
}
