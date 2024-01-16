import { saveAs } from 'file-saver';
import { flatten, uniq } from 'lodash';
import ToastProvider from '../../../hook/Toast';
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { utils, write } from 'xlsx';
import IconSearch from '../../../assets/img/icon-search.png';
import IconDownload from '../../../assets/img/icon-download.png';
import IconFormat from '../../../assets/img/icon-format.png';
import IconSend from '../../../assets/img/icon-send.png';
import useJobs from './jobs';
import { Button, Input } from "@material-tailwind/react";

const Split = () => {
    const uploadInputRef = useRef(null);
    const searchInputRef = useRef(null);
    const [inputText, setInputText] = useState('');
    const [splitCharacter, setSplitCharacter] = useState('|');
    const [columns, setColumns] = useState([]);
    const [warningMessage, setWarningMessage] = useState('');
    const [selectedColumns, setSelectedColumns] = useState(1);
    const [sheetDataImport, setSheetDataImport] = useState([])

    const handleSplitText = () => {
        if (!splitCharacter) {
            ToastProvider('warning', 'Ký tự Split không được trống.')
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
    };

    const handleFormatText = () => {
        const formattedRows = inputText.split('\n').filter(row => row.trim() !== '');
        const formattedText = formattedRows.join('\n');
        setInputText(formattedText);
        ToastProvider('success', 'Đã định dạng lại văn bản.')
    };

    const handleFileUpload = (event) => {
        if (!event.target.files[0]) return;
        const fileLength = event.target.files.length
        const file = event.target.files[fileLength - 1];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const isChecking = file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.txt')
            const workbook = XLSX.read(content, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            console.log({ sheetData })
            setSheetDataImport(sheetData)
            const textData = isChecking ? sheetData.map(row => row.join(splitCharacter)).join('\n') : content
            console.log({ textData })
            setInputText(textData);
        };
        ToastProvider('success', 'Upload file thành công')
        reader.readAsBinaryString(file);
    };

    const handleDownloadExcel = () => {
        if (!columns.length) return;
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
        ToastProvider('success', 'Download file thành công')
    };

    const handleUploadSearch = (event) => {
        console.log({ event: event.target.files })
        if (!event.target.files[0]) return;
        const fileLength = event.target.files.length
        const file = event.target.files[fileLength - 1];
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.txt')) {
                const workbook = XLSX.read(content, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                const flattenData = flatten(sheetData)
                const splitEmail = flattenData.map(data => data.split(splitCharacter)[0])
                console.log({ splitEmail, flattenData })
                let arrFilterEmail = []
                splitEmail.forEach(res => findIndexData(res, sheetDataImport) && arrFilterEmail.push(findIndexData(res, sheetDataImport)))
                if (!arrFilterEmail.length) return ToastProvider('error', 'Không có email trùng')
                const dataJoin = uniq(arrFilterEmail.map(row => row.join(splitCharacter))).join('\n')
                setInputText(dataJoin);
                ToastProvider('success', 'Lọc email thành công')
            }
        };
        reader.readAsBinaryString(file);
    }

    const findIndexData = (email, dataAfterSplit) => {
        return dataAfterSplit.find(res => res.includes(email))
    }

    return (
        <div className="w-full">
            <div className="w-full h-full all-center mt-10 gap-5">
                <textarea
                    rows="4"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="input-data block p-3 text-sm outline-0 text-gray-900 bg-gray-50 dark:bg-[#3b3e45] dark:text-white border dark:border-0 border-gray-300 rounded-lg w-[600px] h-[500px] shadow-custom"
                    placeholder="Import DATA ..."
                ></textarea>
                <div className="flex flex-col all-center gap-2" >
                    <div className="mb-6">
                        <label htmlFor="character" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Character</label>
                        <input
                            type="text"
                            id="character"
                            value={splitCharacter}
                            defaultValue={splitCharacter}
                            required
                            onChange={(e) => setSplitCharacter(e.target.value)}
                            className="block outline-0 w-[120px] h-12 p-4 text-gray-900 dark:bg-[#2f3136] dark:text-white border border-gray-300 rounded-lg bg-gray-50 sm:text-md"
                        />
                    </div>
                    <select
                        id="number"
                        className="bg-gray-50 h-12 p-3 border border-gray-300 dark:bg-[#2f3136] dark:text-white text-gray-900 cursor-pointer outline-0 text-sm rounded-lg"
                        onChange={(e) => setSelectedColumns(parseInt(e.target.value, 10))}
                    >
                        {[...Array(10)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1} Column
                            </option>
                        ))}
                    </select>
                    <Button variant="filled" onClick={handleSplitText} className='bg-[#10b0e7] hover:bg-[#11a5e4] btn transform '>
                        <img src={IconSend} alt="Icon Send" width={18} />
                    </Button>
                    <Button variant="filled" onClick={handleFormatText} className='bg-[#10b0e7] hover:bg-[#11a5e4] btn transform '>
                        <img src={IconFormat} alt="Icon Format" width={18} />
                    </Button>
                    <Button variant="filled" onClick={handleDownloadExcel} className='bg-[#10b0e7] hover:bg-[#11a5e4] btn transform '>
                        <img src={IconDownload} alt="Icon Format" width={18} />
                    </Button>
                    <label>
                        <input
                            ref={searchInputRef}
                            type="file"
                            accept=".txt, .xlsx, .xls"
                            onChange={handleUploadSearch}
                            onClick={event => event.target.value = null}
                            id="icon-button-file"
                            className="mt-4 hidden"
                        />
                        <Button
                            variant="filled"
                            className="flex items-center gap-3 bg-[#10b0e7] hover:bg-[#11a5e4] btn  transform"
                            onClick={() => searchInputRef.current && searchInputRef.current.click()}
                        >
                            <img src={IconSearch} alt="Icon Upload " width={18} />
                        </Button>
                    </label>
                    <label>
                        <input
                            ref={uploadInputRef}
                            color="primary"
                            accept=".txt, .xlsx, .xls"
                            type="file"
                            onChange={handleFileUpload}
                            onClick={event => event.target.value = null}
                            id="icon-button-file"
                            className="mt-4 hidden"
                        />
                        <Button
                            variant="filled" className="flex items-center bg-[#10b0e7] hover:bg-[#11a5e4] btn gap-3 dark:border-white"
                            onClick={() => uploadInputRef.current && uploadInputRef.current.click()}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5 dark:text-white"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                />
                            </svg>
                        </Button>
                    </label>

                </div>
                <div className="bg-gray-50 dark:bg-[#3b3e45] input-data !p-4 border dark:border-0 border-gray-300 rounded-lg w-[600px] h-[500px] shadow-custom flex p-3 gap-2">
                    {columns.map((column, index) => (
                        <textarea
                            key={index}
                            value={column.join('\n')}
                            className={`input-data block w-[50%] !p-4 text-sm outline-0 dark:text-white dark:bg-[#2f3136] dark:border-0 text-gray-900 bg-gray-50 border border-gray-300 w-${100 / selectedColumns}% h-full`}
                        />
                    ))}
                </div>
            </div>
        </div >
    );
};

export default Split;