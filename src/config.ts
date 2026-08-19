// Modified by VFS Platform contributors, 2026.
import { Column, Settings } from "./types"
import ts from "typescript"

export class Layout {
    id?: string;
    name: string;
    columns: Column[] = [];

    settings: Settings;
	private trustedSource: boolean = false;

	constructor(name: string, settings: Settings, trustedSource: boolean = false) {
		this.name = name
		this.settings = settings;
		this.trustedSource = trustedSource
    }

	loadFromObj(obj: any, trustedSource: boolean = false) {
		this.trustedSource = trustedSource
		this.name = obj.name
		this.settings = obj.settings
		this.columns = obj.columns.map((c: Column) => {
			return this.trustedSource ? this.prepareColumn(c) : this.prepareUntrustedColumn(c)
		})
		if (this.trustedSource) {
			this.processMiddlewareHandlers()
		} else {
			this.settings.middlewares = []
		}
	}

	isTrusted(): boolean {
		return this.trustedSource
	}

    toObj(): object {
        return {
            name: this.name, columns: this.columns, settings: this.settings
        }
    }

    removeColumn(id: string) {
        this.columns.splice(this.columns.findIndex(c => c.id === id), 1)
    }

	private prepareColumn(col: Column): Column {
        let transpiled = ts.transpile(`` + col.handlerTsCode)

        let code = `
        return function(line){
        try{
            let fn = ${transpiled}
            let out = fn(line)
            if(typeof out.text != 'string'){
                // make sure text is string
                out.text = JSON.stringify(out.text)
            }
            return out
        }catch(e){
            return {error: "Error: "+e.message}    
        }
    }`
        col.handler = new Function(code)() as any

        return col
    }

	private prepareUntrustedColumn(col: Column): Column {
		return {
			...col,
			handler: (line) => ({ text: line.content || "-" })
		}
	}

    processMiddlewareHandlers() {
        this.settings.middlewares = this.settings.middlewares.map(m => {
            let transpiled = ts.transpile(`` + m.handlerTsCode)

            let code = `
                return function(line){
                try{
                    let fn = ${transpiled}
                    return fn(line)
                }catch(e){
                    console.error("Error while executing middleware '${m.name}': ", e.message)
                    return line    
                }
            }`

            m.handler = new Function(code)() as any
            return m
        })
    }

    private swapElement(indexA: number, indexB: number) {
        var tmp = this.columns[indexA];
        this.columns[indexA] = this.columns[indexB];
        this.columns[indexB] = tmp;
    }

    move(colId: string, diff: number) {
        let idx = this.columns.findIndex(c => c.id === colId)
        let idx2 = diff > 0 ? idx + 1 : idx - 1;
        this.swapElement(idx, idx2)
    }

	add(col: Column) {
        col.idx = this.columns.length === 0 ? 0 : this.columns.length
        col.id = Math.random().toString().substring(2, 8)
        col.width = col.width || 150

		if (col.handlerTsCode && this.trustedSource) {
			col = this.prepareColumn(col)
		} else {
			col = this.prepareUntrustedColumn(col)
		}
        this.columns.push(col)
    }

	update(col: Column) {
		col = this.trustedSource ? this.prepareColumn(col) : this.prepareUntrustedColumn(col)
        let idx = this.columns.findIndex(c => c.id === col.id)
        this.columns[idx] = col
    }

    getColumn(id: string): Column {
        return this.columns.find(c => c.id === id)!
    }
}
