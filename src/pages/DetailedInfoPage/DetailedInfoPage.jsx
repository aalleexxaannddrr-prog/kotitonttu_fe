import React from 'react';
import DetailedInfoContainer from '../../components/Kotibonus/DetailedInfoContainer/DetailedInfoContainer';
import { useParams } from 'react-router-dom';

export default function DetailedInfoPage() {
	const { email } = useParams(); // Получаем email из URL
	return (
		<div>
			<DetailedInfoContainer email={email} />
		</div>
	);
}
