import styled from 'styled-components';

const StyledFooter = styled('footer')`
  display: flex;
  justify-content: space-between;
  padding: 2rem;
`;

export default function Footer() {
	return (
		<StyledFooter>
			<a href='https://github.com/cowglow/react-leaflet' target='_blank'>
				Git Repo
			</a>
		</StyledFooter>
	);
}
