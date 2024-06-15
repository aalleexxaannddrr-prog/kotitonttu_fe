import React from "react";
import styles from "./NavMenu.module.css";
import { Link } from "react-router-dom";

export default function NavMenu() {
	return (
		<nav className={styles.nav_menu}>
			<ul className={styles.nav_list}>
				<li>
					<Link to='/'>Главная</Link>
				</li>
				<li>
					<Link to='/products'>Продукция</Link>
				</li>
				<li>
					<Link to='/service-centers'>Сервисные центры</Link>
				</li>
				<li>
					<Link to='/contacts'>Контакты</Link>
				</li>
				<li>
					<Link to='/about'>О нас</Link>
				</li>
			</ul>
		</nav>
	);
}
