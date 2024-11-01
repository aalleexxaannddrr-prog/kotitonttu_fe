import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './UserMenu.module.css';
import { FaRegCircleUser } from 'react-icons/fa6';
import { logout } from '../../store/slices/authSlice';
import { fetchUsers } from '../../store/slices/usersSlice';

export default function UserMenu({ email }) {
	const dispatch = useDispatch();
	const { users } = useSelector(state => state.users); // Получаем список всех пользователей
	const [isDropdownVisible, setDropdownVisible] = useState(false);

	// Запрашиваем пользователей при монтировании компонента
	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);

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
