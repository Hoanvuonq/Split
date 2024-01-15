import { saveAs } from 'file-saver';
import { flatten, uniq } from 'lodash';
import ToastProvider from '../../../hook/Toast';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { utils, write } from 'xlsx';
import IconSearch from '../../../assets/img/icon-search.png';
import IconDownload from '../../../assets/img/icon-download.png';
import IconFormat from '../../../assets/img/icon-format.png';
import IconSend from '../../../assets/img/icon-send.png';
import IconUpload from '../../../assets/img/icon-upload.png';
import useJobs from './jobs';
import { Button } from "@material-tailwind/react";

const Split = () => {
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
        console.log({ event: event.target.files })
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
            setSheetDataImport(sheetData)
            const textData = isChecking ? sheetData.map(row => row.join(splitCharacter)).join('\n') : content
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
                let arrFilterEmail = []
                splitEmail.forEach(res => findIndexData(res, sheetDataImport) && arrFilterEmail.push(findIndexData(res, sheetDataImport)))
                const dataJoin = uniq(arrFilterEmail.map(row => row.join(splitCharacter))).join('\n')
                setInputText(dataJoin);
            } else {
                setInputText(content);
            }
        };
        reader.readAsBinaryString(file);
        ToastProvider('success', 'Lọc email thành công')
    }

    const findIndexData = (email, dataAfterSplit) => {
        return dataAfterSplit.find(res => res.includes(email))
    }

    return (
        <div className="w-full h-full relative">
            <div className="w-full all-center mt-10 gap-5">
                <div className="input-data">
                    <textarea
                        rows="4"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="block p-3 text-sm outline-0 text-gray-900 bg-gray-50 border border-gray-300 rounded-2xl w-[600px] h-[500px] shadow-custom "
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
                            defaultValue={splitCharacter}
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

                    <Button
                        onClick={handleSplitText}
                        className='btn py-2 w-20 h-10 text-sm px-6 bg-[#10b0e7] hover:bg-[#11a5e4] text-white font-bold all-center gap-2 rounded-xl transform'
                    >
                        <img src={IconSend} alt="Icon Send" width={24} />
                    </Button>

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
                            onClick={event => event.target.value = null}
                            name='uploadFile'
                        />
                    </label>
                    <label className="btn py-2 w-20 h-10 text-sm px-6 bg-[#4caf50] hover:bg-[#43a047] text-white font-bold all-center gap-2 rounded-xl transform">
                        <img src={IconSearch} alt="Icon Upload " width={24} />
                        <input
                            type="file"
                            accept=".txt, .xlsx, .xls"
                            onChange={handleUploadSearch}
                            name='uploadSearch'
                            onClick={event => event.target.value = null}
                            className="mt-4 hidden"
                        />
                    </label>

                </div>
                <div className="bg-gray-50 border border-gray-300 rounded-2xl w-[600px] h-[500px] shadow-custom flex p-3">
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
        </div>
    );
};

export default Split;