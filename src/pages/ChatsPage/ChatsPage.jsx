import React from 'react';
import ChatsContainer from '../../components/Chats/ChatsContainer/ChatsContainer';
import { useSelector } from 'react-redux';

export default function ChatsPage() {
	const bearerToken = useSelector(state => state.auth.bearerToken);
	const userId = useSelector(state => state.auth.userId);
	const isLoading = useSelector(state => state.auth.isLoading);

	if (isLoading || !userId) {
		return <div>Загрузка...</div>;
	}

	return (
		<div>
			<ChatsContainer userId={userId} bearerToken={bearerToken} />
		</div>
	);
}
