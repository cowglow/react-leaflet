import { convertToCSV, exportCSVFile } from 'utils/helper.ts';

interface ExportControllerProps {
	label: string;
	data: any;
}

export default function ExportController({
																					 label,
																					 data,
																				 }: ExportControllerProps) {
	const clickHandler = () => {
		const output = convertToCSV(data);
		exportCSVFile(output, 'output.csv');
	};

	return <button onClick={clickHandler}>{label}</button>;
}
