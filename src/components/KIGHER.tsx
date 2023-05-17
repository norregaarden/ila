import { createContext, createEffect, createSignal, For, useContext } from "solid-js";
import { coltype, ColumnType, randomstring, Table } from "~/KIGHER";

export default function KIGHER() {
  return <div>
    <AllTables />
  </div>
  // return (
  //   <button class="increment" onClick={() => setCount(count() + 1)}>
  //     Klikninger: {count()}
  //   </button>
  // );
}

function getAllTables() {
  const lol: Map<string, string> = new Map()
  for (let i = 0; i < localStorage.length; i++) {
    const key = (localStorage.key(i)!)
    lol.set(key, localStorage.getItem(key)!)
  }
  return lol
}

function AllTables() {
  const [tables, setTables] = createSignal(getAllTables())
  const newtable = () => {
    const table = new Table({ from: "nah", name: 'autolol' }).saveLocally()
    setTables(getAllTables)
  }
  return <><For each={Array.from(tables().entries()).filter(([key, _val]) => key.startsWith('TABLE'))}>
    {([id, val], _index) => <>{id}:{val}
      <ViewTable t={new Table({ from: 'id', id })} />
    </>}
  </For>
    <button onClick={newtable} >new table</button>
  </>
}

const TableContext = createContext<Table>()
function useTableContext() {
  return useContext(TableContext)!
}

function ViewTable(p: { t: Table }) {
  const [table, setTable] = createSignal(p.t, { equals: false })
  // const [table, setTable]=createSignal(p.t)

  createEffect(() => {
    const id = p.t.listen(setTable)
    return () => p.t.unListen(id)
  })


  return (
    <TableContext.Provider value={table()}>
      <h1>table: {table().name}</h1>
      <table>
        <thead>
          <For each={table().columns}>
            {col =>
              <th>
                {col.label}:{col.type}
              </th>
            }
          </For>
          <NewColumn />
        </thead>
      </table>
    </TableContext.Provider>
  )
}

function NewColumn() {
  const table = useTableContext()
  let labelInput: HTMLInputElement | undefined
  let typeInput: HTMLSelectElement | undefined
  let fillInput: HTMLInputElement | undefined

  const newnewnew = () => {
    const labelValue = labelInput?.value
    const typeValue = typeInput?.value
    const fillValue = fillInput?.value
    if (labelValue == null || typeValue == null)
      throw new Error('fill your inputs, bro')
    table.addCol({ label: labelValue, type: typeValue as ColumnType }, fillValue)
  }

  return (
    <th>
      <LabelInputText label="label" ref={labelInput} />
      <SelectOption label="type" options={coltype} ref={typeInput} />
      <LabelInputText label="fill" ref={fillInput} placeholder='default value' />
      <button type="submit" onClick={newnewnew} />
    </th>
  )
  // label<input type="text" ref={labelInput!} />
  // type<input type="text" ref={typeInput!} />
  // fill<input type="text" ref={fillInput!} />
}

function LabelInputText(props: { ref: HTMLInputElement | undefined, label: string, placeholder?: string }) {
  const name = randomstring('LabelInputText')
  return (
    <div>
      <label for={name} >{props.label}</label>
      <input type="text" ref={props.ref} id={name} name={name} placeholder={props.placeholder ?? props.label} />
    </div>
  )
}

function SelectOption<T extends string>(props: { ref: HTMLSelectElement | undefined, label: string, options: readonly T[] }) {
  const name = randomstring('SelectOption')
  // const opt = new Option()
  return (
    <div>
      <select id={name} name={name} ref={props.ref}>
        <For each={props.options}>
          {(option) => <option value={option} label={option}></option>}
        </For>
      </select>
    </div>
  )
  // <label for={name} >{props.label}</label>
}
