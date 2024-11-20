import React from 'react';
import DetailedInfoContainer from '../../components/Kotibonus/DetailedInfoContainer/DetailedInfoContainer';
import { useParams } from 'react-router-dom';

export default function DetailedInfoPage() {
	const { requestId } = useParams();
	return (
		<div>
			<DetailedInfoContainer requestId={requestId} />
		</div>
	);
}
