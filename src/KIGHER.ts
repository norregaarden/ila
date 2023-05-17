// export const randomstring = () => String(Math.random()) + String(Math.random()) + String(Math.random())
export const randomstring = (prefix: string) => prefix + String(Math.random())
const logger = (prefix: string) => (...msgs: string[]) => (shit?: any) => console.log(Date.now(), prefix, ...msgs, shit)
export const log = logger('prefix')
type ID = string
type HasId = { id: ID }
export const coltype = ['string', 'number', 'boolean'] as const
// type ColumnType = 'string' | 'number' | 'boolean'
export type ColumnType = typeof coltype[number]
type Types<T = ColumnType> = T extends ColumnType ? (T extends 'string' ? string : T extends 'number' ? number : T extends 'boolean' ? boolean : never) : never
type Column<T = ColumnType> = {
	label: string
	type: T
	// data: TS<T>[]
	// null: {able: true} | {default: TS<T>},
}
// type Row<C extends Column[]>={
// id:string,
// 	 data: WeakMap<
// 	}
// type Row<T> = Record<string, ColumnType>

type Row = Record<string, Types>
type Rowd = Row & HasId

type Tableish = HasId & {
	name: string
	columns: Column[]
	rows: Rowd[]
}

export class Table implements Tableish {
	id: ID
	name: string
	columns: Column[]
	rows: (Rowd)[]
	// rows: Row<typeof this.columns extends (infer C)[]? C: never>[]

	constructor(from: { from: 'id', id: ID } | { from: 'nah', name: string, cols?: Column[], rows?: Row[] }) {
		log('table constructor')({ this: this, lol: this.toString() })
		if (from.from == 'id') {
			this.id = from.id;
			const lol = this.loadLocally();
			this.name = lol.name
			this.columns = lol.columns
			this.rows = lol.rows
		} else {
			this.id = randomstring('TABLE')
			this.name = from.name
			this.columns = []
			this.rows = []
		}
	}


	/*
	 * SQL API
	 */
	addCol<T extends ColumnType>(umn: Column<T>, fill?: Types<T>) {
		log('addCol')({ this: this, lol: this.toString() })
		this.columns?.push(umn)
		this.rows.forEach(row => Object.assign(row, { [umn.label]: fill }))
		return this.saveLocally()
	}

	addRow(data: Row) {
		log('addRow')({ this: this, lol: this.toString() })
		this.rows.push({ id: String(Math.random()), ...data })
		return this.saveLocally()
	}

	updateRow(id: string, data: Row) {
		log('updateRow')({ this: this, lol: this.toString() })
		const found = this.rows.find(row => row.id == id)
		if (!found) throw new Error('bad')
		Object.assign(found, { ...data })
		return this.saveLocally()
	}

	/*
	 * LOCALSTORAGE
	 */
	cbs: Map<string, ((t: Table) => void)> = new Map()
	listen(callback: (t: Table) => void) {
		const id = randomstring('localstorage_callback')
		this.cbs.set(id, callback)
		return id
	}
	unListen(id: string) {
		this.cbs.delete(id)
	}

	saveLocally() {
		log('saveAllLocally')({ this: this, lol: this.toString() })
		const serializable: Tableish = {
			id: this.id,
			name: this.name,
			columns: this.columns,
			rows: this.rows
		}
		const serialized = JSON.stringify(serializable)
		localStorage.setItem(this.id, serialized)
		this.cbs.forEach(cb => cb(this))
		return this
	}

	loadLocally() {
		log('loadAllLocally')({ this: this, lol: this.toString() })
		try {
			const stored = localStorage.getItem(this.id)
			if (stored == null) throw new Error('no stored')
			const parsed = JSON.parse(stored) as unknown
			if (parsed == null) throw new Error('parsed is null')
			if (typeof parsed != 'object') throw new Error('parsed is not object')
			// const keys = Object.keys(parsed)
			// if (!keys.includes('columns'))throw new Error('parsed has not columns')
			// if (!keys.includes('rows'))throw new Error('parsed has not rows')
			// if (!keys.includes('id') parsed)throw new Error('parsed has not id')
			// if (!keys.includes('rows'))throw new Error('parsed has not rows')
			const tablefrom = parsed as Tableish
			// this.columns = tablefrom.columns
			// this.rows = tablefrom.rows
			// this.name = tablefrom.name
			return tablefrom
		} catch (err) { throw new Error(err as any) }
	}
}

