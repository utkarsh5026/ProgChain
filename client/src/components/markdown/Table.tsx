import * as XLSX from "xlsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DownloadIcon, FileSpreadsheet, FileType } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import React, { useRef } from "react";

type RowData = (string | null)[];
interface MarkDownTableProps {
  props: React.HTMLAttributes<HTMLTableElement>;
}

const MarkDownTable: React.FC<MarkDownTableProps> = ({ props }) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const handleDownload = (format: string) => {
    if (tableRef.current) {
      downloadTableData(tableRef.current, format);
    }
  };

  return (
    <div className="my-6">
      <div className="flex justify-end mb-2">
        <Select onValueChange={handleDownload}>
          <SelectTrigger className="w-[180px]">
            <DownloadIcon className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Download as..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">
              <div className="flex items-center">
                <FileType className="w-4 h-4 mr-2" />
                Download CSV
              </div>
            </SelectItem>
            <SelectItem value="xlsx">
              <div className="flex items-center">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Excel
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* <ScrollArea className="max-w-full"> */}
      <div className="inline-block min-w-full align-middle">
        <table
          {...props}
          ref={tableRef}
          className="divide-y divide-zinc-800 border border-zinc-800 max-w-full"
        />
      </div>
      {/* <ScrollBar orientation="horizontal" /> */}
      {/* </ScrollArea> */}
    </div>
  );
};

const downloadTableData = (tableElement: HTMLTableElement, format: string) => {
  const headers = Array.from(tableElement.querySelectorAll("th")).map(
    (th) => th.textContent
  );
  const rows = Array.from(tableElement.querySelectorAll("tr"))
    .slice(1)
    .map((row) =>
      Array.from(row.querySelectorAll("td")).map((td) => td.textContent)
    );

  const data = [headers, ...rows];

  if (format === "csv") downloadCSV(data);
  else if (format === "xlsx") downloadXLSX(data);
};

const downloadCSV = (data: RowData[]) => {
  const csv = data.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "table-data.csv";

  a.click();
};

const downloadXLSX = (data: RowData[]) => {
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  XLSX.writeFile(wb, "table-data.xlsx");
};

export default MarkDownTable;
