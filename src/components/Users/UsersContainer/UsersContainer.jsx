import React, {useEffect, useRef} from 'react'
import styles from './UsersContainer.module.css'
import {useDispatch, useSelector} from 'react-redux'
import UserCard from '../UserCard/UserCard';
import {fetchUsersPag} from "../../../store/slices/usersPaginatedSlice";

export default function UsersContainer() {
	const dispatch = useDispatch();
    const { users, status, error, currentPage, totalPages } = useSelector(state => state.usersPag);
	const hasLoaded = useRef(false);


	useEffect(() => {
		if (!hasLoaded.current) {
			// Сбрасываем пользователей перед загрузкой
			dispatch({ type: "usersPag/resetUsers" });
			dispatch(fetchUsersPag(0)); // Загружаем первую страницу при загрузке компонента
			hasLoaded.current = true;
		}
	}, [dispatch]);

	const loadMoreUsers = () => {
		if (currentPage < totalPages - 1) {
			dispatch(fetchUsersPag(currentPage + 1)); // Загружаем следующую страницу
		}
	};

   if (status === 'loading') {
	   return <div>Loading...</div>;
   }

	if (status === 'error') {
		return <div>Error: {error}</div>;
	}

   if(!Array.isArray(users)){
      console.log('Expected types to be an array but got:', users);
      return <div>Error: Data is not in expected format.</div>;
   }
  return (
		<div className='container'>
			<h2>Список пользователей</h2>
			<UserCard users={users} />
			<div className={styles.buttonsContainer}>
				<button className={styles.loadMoreButton} onClick={() => loadMoreUsers(currentPage + 1)} disabled={currentPage === totalPages - 1}>
					Загрузить еще
				</button>
			</div>
		</div>
	);
}