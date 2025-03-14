import React from "react";
import Card from "./Card";

const Table = ({ columns, data }) => {
  return (
    <Card>
      <div className="overflow-x-auto">
        <div className="max-h-[75vh] overflow-y-auto custom-scrollbar">
          <table className="table-auto w-full text-sm text-left text-black">
            <thead className="bg-white text-black uppercase sticky top-[-2px] border-b border-gray-300">
              <tr>
                {columns.map((col, i) => (
                  <th key={i} className="px-6 py-3 bg-white">
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white ">
              {data.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-300 hover:bg-gray-200"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  );
};

export default Table;
