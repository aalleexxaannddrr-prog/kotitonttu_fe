import React from 'react';
import styles from './NavMenu.module.css';
import { Link, useLocation } from 'react-router-dom';

export default function NavMenu() {
	const location = useLocation();
	const currentPath = location.pathname;

	const getLinkStyle = path => {
		return currentPath === path
			? { color: 'var(--txt-black)' }
			: { color: 'inherit' };
	};

	return (
		<nav className={styles.nav_menu}>
			<ul className={styles.nav_list}>
				<li>
					<Link to='/users' style={getLinkStyle('/users')}>
						Пользователи
					</Link>
				</li>
				<li>
					<Link to='/types' style={getLinkStyle('/types')}>
						Продукция
					</Link>
					<ul className={styles.dropdown_menu}>
						<li>
							<Link to='/types' style={getLinkStyle('/types')}>
								Характеристики продукции
							</Link>
						</li>
						<li>
							<Link to='/pass-product' style={getLinkStyle('/pass-product')}>
								Паспорт Продукции
							</Link>
						</li>
						<li>
							<Link to='/spare-parts' style={getLinkStyle('/spare-parts')}>
								Запчасти
							</Link>
						</li>
						<li>
							<Link to='/error-codes' style={getLinkStyle('/error-codes')}>
								Коды ошибок
							</Link>
						</li>
						<li>
							<Link to='/exploded-view' style={getLinkStyle('/exploded-view')}>
								Взрыв-схемы
							</Link>
						</li>
					</ul>
				</li>
				<li>
					<Link to='/service-centers' style={getLinkStyle('/service-centers')}>
						Сервисные центры
					</Link>
				</li>
				<li>
					<Link style={getLinkStyle('/bonus-program')}>Котибонус</Link>
					<ul className={styles.dropdown_menu}>
						<li>
							<Link
								to='/bonus-program/models'
								style={getLinkStyle('/bonus-program/models')}
							>
								Редактировать
							</Link>
						</li>
						<li>
							<Link
								to='/bonus-program/active-applications'
								style={getLinkStyle('/bonus-program/active-applications')}
							>
								Активные заявки
							</Link>
						</li>
						<li>
							<Link
								to='/bonus-program/accepted-applications'
								style={getLinkStyle('/bonus-program/accepted-applications')}
							>
								Принятые заявки
							</Link>
						</li>
						<li>
							<Link
								to='/bonus-program/rejected-applications'
								style={getLinkStyle('/bonus-program/rejected-applications')}
							>
								Отклоненные заявки
							</Link>
						</li>
						<li>
							<Link to='/barcodes' style={getLinkStyle('/barcodes')}>
								Штрих коды
							</Link>
						</li>
						<li>
							<Link to='/pass-client' style={getLinkStyle('/pass-client')}>
								Паспорт Клиента
							</Link>
						</li>
					</ul>
				</li>
				<li>
					<Link to='/chats' style={getLinkStyle('/chats')}>
						Чат
					</Link>
				</li>
			</ul>
		</nav>
	);
}
