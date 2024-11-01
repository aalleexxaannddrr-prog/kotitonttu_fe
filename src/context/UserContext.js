// src/context/UserContext.js
import React, { createContext, useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
	const { email } = useParams(); // Получаем email из URL
	const users = useSelector(state => state.users.users); // Данные о пользователях из Redux
	const user = useMemo(
		() => users.find(user => user.email === email),
		[email, users]
	); // Находим нужного пользователя

	return (
		<UserContext.Provider value={{ user, email }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);
