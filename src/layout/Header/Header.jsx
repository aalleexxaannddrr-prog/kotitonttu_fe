import React from 'react'
import styles from './Header.module.css'
import NavMenu from '../../components/NavMenu/NavMenu'
import { FaRegCircleUser } from "react-icons/fa6";

export default function Header() {
  return (
		<div className={styles.header_wrapper}>
			<div className='container'>
				<div className={styles.header_list}>
					<NavMenu />
					<button className={styles.header_btn}>
						<FaRegCircleUser className={styles.header_btn_icon} />
						<span>Войти</span>
					</button>
				</div>
			</div>
		</div>
	);
}
