import React from 'react'
import styles from './UsersContainer.module.css'
import { useSelector } from 'react-redux'
import UserCard from '../UserCard/UserCard';

export default function UsersContainer() {
   const { users, status, error } = useSelector(state => state.users);

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
				<UserCard users={users} />
			</div>
	);
}
