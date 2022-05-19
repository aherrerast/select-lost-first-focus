import React, { useState, ChangeEvent } from "react";

import "@servicetitan/anvil-fonts/dist/css/anvil-fonts.css";
import "@servicetitan/design-system/dist/system.css";
import {
  Table,
  TableState,
  InMemoryDataSource,
  getEditableCell,
  EditorProps,
  TableCellProps
} from "@servicetitan/table";
import {
  AnvilSelect,
  TableColumn,
  Takeover,
  AnvilSelectOptionsProps,
  InputOnChangeData
} from "@servicetitan/design-system";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { setFormStateValues } from "@servicetitan/form";
import { FieldState, FormState } from "formstate";

interface ItemModel {
  id: number;
  name: string;
}

const getFormState = (row: ItemModel) => {
  return setFormStateValues(
    new FormState({
      id: new FieldState<number>(0),
      name: new FieldState<string>("")
    }),
    row
  );
};

function getTableState() {
  return new TableState<ItemModel, number>({
    dataSource: new InMemoryDataSource<ItemModel, number>([], (s) => s.id),
    getFormState: getFormState
  });
}

const allOptions = [
  { text: "Jane Doe", value: 1 },
  { text: "Bob Ross", value: 2 },
  { text: "Jackie Robinson", value: 3 },
  { text: "Alexandria Garcia", value: 4 }
];

const store = makeAutoObservable({
  searchTerm: "",
  get filteredOptions() {
    return allOptions.filter((o) =>
      o.text.toLowerCase().includes(this.searchTerm)
    );
  }
});

function getEditItemCell(tableState: TableState<ItemModel, number>) {
  const Viewer = observer((props: TableCellProps<any>) => {
    return <span>Viewer</span>;
  });

  const Editor = observer((props: EditorProps<string | number>) => {
    function handleSearchChange(_: ChangeEvent<HTMLInputElement>, input: InputOnChangeData) {
      store.searchTerm = input.value.toLowerCase();
    }

    function handleOpenChange(data: AnvilSelectOptionsProps) {
      store.searchTerm = "";
      const formState = tableState.inEdit.get(data.value)!.form;
      setFormStateValues(formState, { id: data.value, name: data.text });
      tableState.saveEdit(props.dataItem);
    }

    return (
      <AnvilSelect
        search={{
          placeholder: "Search for a Technician",
          onChange: handleSearchChange,
          autoFocus: true
        }}
        options={store.filteredOptions}
        trigger={{ placeholder: "Select a Technician" }}
        open
        onOpenChange={handleOpenChange}
        closeOnClickOutside={false}
        autoFlipVertically={false}
      />
    );
  });

  return getEditableCell({
    viewer: Viewer,
    editor: Editor
  });
}
interface InvoiceTemplateTableProps {
  tableState: TableState<ItemModel, number>;
}
const InvoiceTemplateTable = observer((props: InvoiceTemplateTableProps) => {
  const editItemCell = getEditItemCell(props.tableState);
  const [id, setId] = useState(2);
  return (
    <div>
      <button
        onClick={() => {
          const emptyRow = { id, name: id.toString() };
          setId(id + 1);
          props.tableState.addToDataSource(emptyRow);
          props.tableState.edit(emptyRow, "name");
        }}
      >
        Add Row
      </button>
      <Table tableState={props.tableState}>
        <TableColumn field="name" title="name" cell={editItemCell} />
      </Table>
    </div>
  );
});

interface InvoiceTemplateProps {
  tableState: TableState<ItemModel, number>;
}

const InvoiceTemplate = observer((props: InvoiceTemplateProps) => {
  return (
    /*
     * Steven: Add the takeover break the focus
     */
    <Takeover title="test">
      <Takeover.Section>
        <InvoiceTemplateTable tableState={props.tableState} />
      </Takeover.Section>
    </Takeover>
  );
});

const RootInvoiceTemplateViewer = observer(() => {
  const [viewTemplate, setViewTemplate] = useState(false);
  const [ajustmentInvoicesTable] = useState(getTableState());

  return (
    <div>
      <button
        onClick={() => {
          setViewTemplate(!viewTemplate);
        }}
      >
        Edit
      </button>
      {viewTemplate && <InvoiceTemplate tableState={ajustmentInvoicesTable} />}
    </div>
  );
});

export default RootInvoiceTemplateViewer;
