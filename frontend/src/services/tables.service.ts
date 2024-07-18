import { Injectable, OnInit } from "@angular/core";
import * as _ from "lodash";
import { Table } from "src/models/table.model";
import { RequestService } from "./request.service";

@Injectable({
    providedIn: 'root',
  })
export class TablesService  {
    public tables: Table[] = [];
    private readonly tempTableStorageKey = 'temp_tables';

    constructor(private readonly requestService: RequestService) {
        const localTables = localStorage.getItem(this.tempTableStorageKey);
        if (localTables) {
            this.tables = JSON.parse(localTables) as Table[];
        }
    }

    public async addTable(table: Table) {
        table.id = this.genId();
        table.time = await this.requestService.getCurrentTime();

        this.tables.push(table);
    }

    public getTables() {
        return this.tables;
    }

    public getTable(id: number) {
        return id === 0 ? {} as Table : _.find(this.tables, table => table.id === id) as Table;
    }

    genId() {
        return this.tables.length > 0 ? Math.max(...this.tables.map(table => table.id)) + 1 : 1;
    }

    public saveChanges() {
        localStorage.setItem(this.tempTableStorageKey, JSON.stringify(this.tables));
    }

    public clearTables() {
        this.tables = [];
        localStorage.removeItem(this.tempTableStorageKey);
    }

    removeTable(table: Table) {
        _.remove(this.tables, (item) => item === table);
    }
}