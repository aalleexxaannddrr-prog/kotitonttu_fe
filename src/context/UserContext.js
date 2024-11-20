// UserContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

const UserContext = createContext();

export const UserProvider = ({ children, email }) => {
	const users = useSelector(state => state.users.users);
	const bearerToken = useSelector(state => state.auth.bearerToken);

	const user = useMemo(() => {
		if (email) {
			const foundUser = users.find(user => user.email === email);
			return foundUser ? { ...foundUser, bearerToken } : null;
		}
		return null;
	}, [email, users, bearerToken]);

	return (
		<UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);
