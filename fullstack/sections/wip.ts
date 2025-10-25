import { useState } from "react";

export type TextFieldValueType = string | undefined;

export class TextField {
  // Chose `undefined` here instead of `null`,
  // because HTML elements accept it as an empty value.
  static readonly emptyValue = undefined;

  private readonly value: TextFieldValueType = TextField.emptyValue;

  constructor(value: TextFieldValueType) {
    this.value = TextField.isEmpty(value) ? TextField.emptyValue : value;
  }

  get(): TextFieldValueType {
    return this.value;
  }

  isEmpty() {
    return TextField.isEmpty(this.value);
  }

  static isEmpty(value: TextFieldValueType): boolean {
    return value === undefined || value === "" || value === null;
  }

  static compare(one: TextFieldValueType, another: TextFieldValueType): boolean {
    if (TextField.isEmpty(one) && TextField.isEmpty(another)) return true;
    return one === another;
  }
}

type FieldNameType = string;

export type FieldElementType = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export type UseFieldConfigType = { name: FieldNameType; defaultValue?: TextFieldValueType };

export type UseFieldReturnType = {
  defaultValue: TextFieldValueType;
  value: TextFieldValueType;
  set: (value: TextFieldValueType) => void;
  handleChange: (event: React.ChangeEvent<FieldElementType>) => void;
  clear: () => void;
  label: { props: { htmlFor: FieldNameType } };
  input: {
    props: {
      id: FieldNameType;
      name: FieldNameType;
      value: TextFieldValueType;
      onChange: (event: React.ChangeEvent<FieldElementType>) => void;
    };
  };
  changed: boolean;
  unchanged: boolean;
  empty: boolean;
};

export function useTextField(config: UseFieldConfigType): UseFieldReturnType {
  const defaultValue = new TextField(config.defaultValue);
  const [value, setValue] = useState(defaultValue.get());

  const setCurrentValue = (value: TextFieldValueType) => setValue(new TextField(value).get());

  const onChange = (event: React.ChangeEvent<FieldElementType>) => setCurrentValue(event.currentTarget.value);

  return {
    defaultValue: defaultValue.get(),
    value,
    set: setCurrentValue,
    handleChange: onChange,
    clear: () => setCurrentValue(defaultValue.get()),
    label: { props: { htmlFor: config.name } },
    input: { props: { id: config.name, name: config.name, value, onChange } },
    changed: !TextField.compare(value, defaultValue.get()),
    unchanged: TextField.compare(value, defaultValue.get()),
    empty: TextField.isEmpty(value),
  };
}
