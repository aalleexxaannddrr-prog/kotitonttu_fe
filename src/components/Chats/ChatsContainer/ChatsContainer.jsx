import React, { useEffect, useState } from 'react';
import styles from './ChatsContainer.module.css';
import ChatList from '../ChatList/ChatList';
import ChatDetails from '../ChatDetails/ChatDetails';
import MessageButton from '../MessageButton/MessageButton';

const sampleChats = [
	{
		id: 1,
		from: 'User1',
		subject: 'Привет!',
		date: '2024-09-25',
		content: 'Привет! Как дела?',
	},
	{
		id: 2,
		from: 'User2',
		subject: 'Новый заказ',
		date: '2024-09-24',
		content: 'Есть новый заказ на выполнение.',
	},
	{
		id: 3,
		from: 'User3',
		subject: 'Информация по проекту №NDL78946jb',
		date: '2024-09-23',
		content:
			'Я отправил всю информацию по проекту. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Amet alias laudantium quod asperiores ex sequi eum nam pariatur voluptas quos dicta odit vitae architecto quisquam nesciunt laboriosam, excepturi eos commodi natus, dolore officia cumque unde. Hic odio laboriosam maiores non iusto! Quisquam praesentium eos labore maiores eum dicta aliquam laborum.',
	},
	// Добавьте больше чатов для примера
];

export default function ChatsContainer() {
	const [selectedChat, setSelectedChat] = useState(null);

	const handleSelectChat = chat => {
		setSelectedChat(chat);
	};

	const handleKeyDown = event => {
		if (event.key === 'Escape') {
			setSelectedChat(null); // Закрываем чат при нажатии на Escape
		}
	};

	useEffect(() => {
		// Добавляем обработчик событий при монтировании компонента
		document.addEventListener('keydown', handleKeyDown);

		// Удаляем обработчик событий при размонтировании компонента
		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, []);

	return (
		<div className='container'>
			<MessageButton/>
			<div className={styles.chats_content}>
				<div className={styles.chat_list_container}>
					<ChatList chats={sampleChats} onSelectChat={handleSelectChat} />
				</div>
				<div>
					<ChatDetails selectedChat={selectedChat} />
				</div>
			</div>
		</div>
	);
}

