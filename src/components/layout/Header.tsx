import styled from 'styled-components';
import ExportController from 'components/ExportController.tsx';
import { useMarkers } from 'hooks/use-markers.ts';

const StyledHeader = styled('header')`
  display: flex;
  justify-content: space-between;
  padding: 0 2rem 0;

  & div {
    display: flex;
    gap: 2rem;
    padding: 2rem;
  }
`;

export default function Header() {
	const { markers, clearMarkers } = useMarkers();

	const resetMap = () => {
		clearMarkers();
		location.reload();
	};

	return (
		<StyledHeader>
			<h1>Vite + React</h1>
			<div>
				<ExportController label='Export MarkerDefault Coords' data={markers} />
				<button onClick={resetMap}>Reset</button>
			</div>
		</StyledHeader>
	);
}