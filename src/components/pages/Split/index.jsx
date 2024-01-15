import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ClipboardJS from 'clipboard';
import IconBack from '../../../assets/img/icon-black.png';
import IconFormat from '../../../assets/img/icon-format.png';
import IconSend from '../../../assets/img/icon-send.png';
import IconDownload from '../../../assets/img/icon-download.png';
import IconUpload from '../../../assets/img/icon-upload.png';
import * as XLSX from 'xlsx';
import { write, utils } from 'xlsx';
import { saveAs } from 'file-saver';

const Split = () => {
    const [inputText, setInputText] = useState('');
    const [splitCharacter, setSplitCharacter] = useState('');
    const [columns, setColumns] = useState([]);
    const [warningMessage, setWarningMessage] = useState('');
    const [selectedColumns, setSelectedColumns] = useState(0);

    const handleSplitText = () => {
        if (!splitCharacter) {
            Warning('Ký tự Split không được trống.');
            return;
        }

        const rows = inputText.split('\n');
        const maxColumns = Math.max(...rows.map(row => row.split(splitCharacter).length));

        const effectiveColumns = selectedColumns || maxColumns;

        const newColumns = Array.from({ length: effectiveColumns }, (_, index) => {
            return rows.map(row => {
                const rowColumns = row.split(splitCharacter);
                return rowColumns[index] || '';
            });
        });

        setColumns(newColumns);
        setWarningMessage('');
    };

    const handleGoBack = () => {
        setColumns([]);
        setWarningMessage('');
    };

    const handleFormatText = () => {
        const formattedRows = inputText.split('\n').filter(row => row.trim() !== '');
        const formattedText = formattedRows.join('\n');

        setInputText(formattedText);
        Success('Đã định dạng lại văn bản.');
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;

            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                const workbook = XLSX.read(content, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const textData = sheetData.map(row => row.join(splitCharacter)).join('\n');
                setInputText(textData);
            } else {
                setInputText(content);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleDownloadExcel = () => {
        if (selectedColumns === 0) {
            Warning('Vui lòng chọn số cột trước khi tải xuống.');
            return;
        }

        const workbook = utils.book_new();
        const selectedColumnsData = columns.slice(0, selectedColumns);
        const transposedData = Array.from({ length: columns[0].length }, (_, rowIndex) =>
            selectedColumnsData.map(column => column[rowIndex])
        );
        const sheet = utils.aoa_to_sheet(transposedData);
        utils.book_append_sheet(workbook, sheet, 'Sheet1');
        const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(blob, 'output.xlsx');
    };

    const Success = (message) => {
        toast.success(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        });
    };

    const Warning = (message) => {
        toast.warning(message, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 1000,
        });
    };

    return (
        <div className="w-full">
            <div className="w-full h-full all-center mt-10 gap-5">
                <div className="">
                    <textarea
                        rows="4"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="block p-3 text-sm outline-0 text-gray-900 bg-gray-50 border border-gray-300 rounded-2xl w-[600px] h-[400px] shadow-custom "
                        placeholder="Write your thoughts here..."
                    ></textarea>
                </div>
                <div className="flex flex-col all-center gap-2">
                    <div className="mb-6">
                        <label htmlFor="character" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Split character</label>
                        <input
                            type="text"
                            id="character"
                            value={splitCharacter}
                            required
                            onChange={(e) => setSplitCharacter(e.target.value)}
                            className="block outline-0 w-[120px] h-12 p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md"
                        />
                    </div>
                    <select
                        id="number"
                        className="bg-gray-50 p-3 border border-gray-300 text-gray-900 cursor-pointer outline-0 text-sm rounded-lg"
                        onChange={(e) => setSelectedColumns(parseInt(e.target.value, 10))}
                    >
                        {[...Array(10)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1} Column
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={handleSplitText}
                        className='btn py-2 w-20 h-10 text-sm px-6 bg-[#10b0e7] hover:bg-[#11a5e4] text-white font-bold all-center gap-2 rounded-xl transform'
                    >
                        <img src={IconSend} alt="Icon Send" width={24} />
                    </button>
                    <button
                        onClick={handleGoBack}
                        className='btn py-2 w-20 h-10 text-sm px-6 bg-[#ff8831] hover:bg-[#ff742f] text-white font-bold all-center gap-2 rounded-xl transform'
                    >
                        <img src={IconBack} alt="Icon Back" width={24} className='rotate-icon' />
                    </button>
                    <button
                        onClick={handleFormatText}
                        className='btn py-2 w-20 h-10 text-sm px-6 bg-[#ff8831] hover:bg-[#ff742f] text-white font-bold all-center gap-2 rounded-xl transform'
                    >
                        <img src={IconFormat} alt="Icon Format" width={24} />
                    </button>
                    <button
                        onClick={handleDownloadExcel}
                        className='btn py-2 w-20 h-10 text-sm px-6 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold all-center gap-2 rounded-xl transform'
                    >
                        <img src={IconDownload} alt="Icon Download" width={24} />
                    </button>
                    <label className="btn py-2 w-20 h-10 text-sm px-6 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold all-center gap-2 rounded-xl transform">
                        <img src={IconUpload} alt="Icon Upload " width={24} />
                        <input
                            type="file"
                            accept=".txt, .xlsx, .xls"
                            onChange={handleFileUpload}
                            className="mt-4 hidden"
                        />
                    </label>

                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-2xl w-[600px] h-[400px] shadow-custom flex p-3">
                    {columns.map((column, index) => (
                        <textarea
                            key={index}
                            value={column.join('\n')}
                            className={`block p-3 text-sm outline-0 text-gray-900 bg-gray-50 border border-gray-300 rounded-2xl w-${100 / selectedColumns}% h-full`}
                        />
                    ))}
                </div>
            </div>

            {warningMessage && (
                <div className="bg-red-100 border w-[400px] border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <strong className="font-bold">{warningMessage}</strong>
                </div>
            )}



            <ToastContainer />
        </div>
    );
};

export default Split;