import React, { useEffect } from 'react';
import UsersContainer from '../../components/Users/UsersContainer/UsersContainer';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/usersSlice';

export default function UserPage() {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(fetchUsers());
	}, [dispatch]);
	return (
		<div>
			<UsersContainer />
		</div>
	);
}
