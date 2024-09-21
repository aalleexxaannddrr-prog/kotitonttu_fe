import React from 'react';
import styles from './PassportsPage.module.css';
import { Link, Outlet } from 'react-router-dom';

export default function PassportsPage() {
	return (
		<div className='container'>
			<nav>
				<ul className={styles.pass_list}>
					<li>
						<button className={styles.pass_btn}>
							<Link to='pass-client'>Паспорт Клиента</Link>
						</button>
					</li>
					<li>
						<button className={styles.pass_btn}>
							<Link to='pass-product'>Паспорт Продукции</Link>
						</button>
					</li>
				</ul>
			</nav>
			{/* Outlet рендерит вложенные маршруты */}
			<Outlet />
		</div>
	);
}
