import React, { useEffect } from 'react';
import UsersContainer from '../../components/Users/UsersContainer/UsersContainer';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../../store/slices/usersSlice';

export default function UserPage() {
	return (
		<div>
			<UsersContainer />
		</div>
	);
}
