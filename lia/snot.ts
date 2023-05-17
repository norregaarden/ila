
type Database<T extends Table =Table> =
  Set<T>

type DBHistory = 
  Tree<Command>

type Command<T =any> =
  T extends Database ?
    | {hmm: "create", table: TableRef}
    | {hmm: "delete", table: TableRef}
    | {hmm: "index", table: TableRef, column: ColumnRef}
  : T extends Table<infer Cols> ?
    | {hmm: "insert", row: Row<Cols>}
    | {hmm: "delete", where: Selector<T>}
    | {hmm: "update", data: Partial<Row<Cols>>, where: Selector<T>}
  : never


/**
 *
 *
 * Table, Column, Row
 */
type TableRef = {readonly _ref: unique symbol}
type Table<Cs extends Column[] =any> = {
	ref: TableRef
  columns: Cs,
	rows: Row<Cs>[]
}

// type ColumnsOf<T extends Table<infer Cs>> =

type ColumnRef = {readonly _ref: unique symbol}
type Column<DB =Database> = {
  ref: ColumnRef
	type: AllowedColumnType<DB>
	name: string
}

type AllowedBase = number | string | boolean
type AllowedSpecial<DB> = 
  DB extends Database<infer T> ?
    T extends Table<infer Cs> ? 
      Cs
    : never : never
type Allowed<T> = AllowedBase | AllowedSpecial<T>
type AllowedColumnType<T>= Allowed<T>| Allowed<T>[]

type Row<Col extends Column[] =any> = {
  [key in keyof Col]: Col[key]['type']
}
// type Row<Table


/**
 *
 *
 * Tree, Selector
 */
type Tree<T> = any
type Selector<T> = any

