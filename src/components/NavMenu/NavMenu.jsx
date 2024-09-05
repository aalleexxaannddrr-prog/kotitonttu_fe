import React from "react";
import styles from "./NavMenu.module.css";
import { Link, useLocation } from "react-router-dom";

export default function NavMenu() {
const location = useLocation();
const currentPath = location.pathname;

const getLinkStyle = (path) => {
	return currentPath === path ? {color: 'var(--txt-black)'} : {color: 'inherit'}
}

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
				</li>
				<li>
					<Link to='/service-centers' style={getLinkStyle('/service-centers')}>
						Сервисные центры
					</Link>
				</li>
				<li>
					<Link to='/exploded-view' style={getLinkStyle('/exploded-view')}>
						Взрыв-схемы
					</Link>
				</li>
				<li>
					<Link to='/spare-parts' style={getLinkStyle('/spare-parts')}>
						Запчасти
					</Link>
				</li>
				<li>
					<Link to='/passports' style={getLinkStyle('/passports')}>
						Паспорта
					</Link>
				</li>
				<li>
					<Link to='/error-codes' style={getLinkStyle('/error-codes')}>
						Коды ошибок
					</Link>
				</li>
				<li>
					<Link to='/barcodes' style={getLinkStyle('/barcodes')}>
						Штрих коды
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
								to='/bonus-program/applications'
								style={getLinkStyle('/bonus-program/applications')}
							>
								Заявки
							</Link>
						</li>
						<li>
							<Link
								to='/bonus-program/kotibonus'
								style={getLinkStyle('/bonus-program/kotibonus')}
							>
								Котибонус
							</Link>
						</li>
					</ul>
				</li>
			</ul>
		</nav>
	);
}
