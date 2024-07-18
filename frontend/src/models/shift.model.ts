import { Table } from "./table.model";

export interface Shift {
    id: number;
    startTime: string;
    endTime: string;
    status: string;
    tables: Table[];
    isActive: boolean;
    total: number;
    summary: number;
}