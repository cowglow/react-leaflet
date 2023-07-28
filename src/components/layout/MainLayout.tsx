import { ReactNode } from 'react';
import styled from 'styled-components';
import ExportController from '../ExportController.tsx';
import { useMarkers } from '../../hooks/use-markers.ts';
import Footer from './Footer.tsx';

const StyledWrapper = styled('div')`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`;

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

const StyledMain = styled('main')`
  display: block;
  flex-grow: 1;
`;

const StyledFooter = styled('footer')`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
`;

interface MainLayoutProps {
	children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
	const { markers, clearMarkers } = useMarkers();

	const resetMap = () => {
		clearMarkers();
		location.reload();
	};
	return (
		<StyledWrapper>
			<StyledHeader>
				<h1>Vite + React</h1>
				<div>
					<ExportController label='Export MarkerDefault Coords' data={markers} />
					<button onClick={resetMap}>Reset</button>
				</div>
			</StyledHeader>
			<StyledMain>{children}</StyledMain>
			<StyledFooter>
				<Footer />
			</StyledFooter>
		</StyledWrapper>
	);
}
