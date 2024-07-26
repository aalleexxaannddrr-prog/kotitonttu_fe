import React, { useState } from 'react'
import styles from './Header.module.css'
import NavMenu from '../../components/NavMenu/NavMenu'
import { FaRegCircleUser } from "react-icons/fa6";
import LoginModal from '../../components/LoginModal/LoginModal';

export default function Header() {
  // Состояние для управления видимостью модального окна
  const [isModalOpen, setModalOpen] = useState(false);

  // Функция для открытия модального окна
  const openModal = () => {
    setModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setModalOpen(false);
  };
  return (
		<div className={styles.header_wrapper}>
			<div className='container'>
				<div className={styles.header_list}>
					<NavMenu />
					<button className={styles.header_btn} onClick={openModal}>
						<FaRegCircleUser className={styles.header_btn_icon} />
						<span>Войти</span>
					</button>
				</div>
			</div>
			{isModalOpen && <LoginModal closeModal={closeModal} />}
		</div>
	);
}
