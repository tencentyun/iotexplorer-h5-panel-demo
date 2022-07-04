export type TemplateDataType =
  | "bool"
  | "int"
  | "string"
  | "float"
  | "enum"
  | "stringenum"
  | "timestamp"
  | "struct"
  | "array";

export const isEnumType = (
  propertyDefine: DataTemplateProperty["define"],
): propertyDefine is DataTemplatePropertyEnum["define"] | DataTemplatePropertyStringEnum["define"] => {
  const type = propertyDefine?.type;

  return ["enum", "stringenum"].includes(type);
};

export interface DataTemplate {
  version: string;
  profile: {
    ProductId: string;
    CategoryId?: string;
  };
  properties: DataTemplateProperty[];
  events: DataTemplateEvent[];
  actions: DataTemplateAction[];
}

export interface DataTemplatePropertyBase {
  id: string;
  name: string;
  desc: string;
  required: boolean;
  mode: "r" | "rw";
  define: {
    type: TemplateDataType;
  };
}

// 类枚举型的声明，包括 bool, enum, stringenum
export interface EnumLikeDefine {
  mapping: {
    [value: string]: string;
  };
}

export type DataTemplateProperty = BaseDataTemplateProperty | DataTemplatePropertyStruct | DataTemplatePropertyArray;

// 基础类型，bool|enum|stringenum|int|float|timestamp|string 7种
export type BaseDataTemplateProperty =
  | DataTemplatePropertyBool
  | DataTemplatePropertyEnum
  | DataTemplatePropertyStringEnum
  | DataTemplatePropertyInt
  | DataTemplatePropertyFloat
  | DataTemplatePropertyTimestamp
  | DataTemplatePropertyString;

export interface DataTemplatePropertyBool extends DataTemplatePropertyBase {
  define: {
    type: "bool";
  } & EnumLikeDefine;
}

export interface DataTemplatePropertyEnum extends DataTemplatePropertyBase {
  define: EnumLikeDefine & {
    type: "enum";
  };
}

export interface DataTemplatePropertyStringEnum extends DataTemplatePropertyBase {
  define: EnumLikeDefine & {
    type: "stringenum";
  };
}

export interface NumberDefine {
  unit: string;
  step: number;
  min: number;
  max: number;
  start: number;
}

export interface DataTemplatePropertyInt extends DataTemplatePropertyBase {
  define: NumberDefine & {
    type: "int";
  };
}

export interface DataTemplatePropertyFloat extends DataTemplatePropertyBase {
  define: NumberDefine & {
    type: "float";
  };
}

export interface DataTemplatePropertyTimestamp extends DataTemplatePropertyBase {
  define: {
    type: "timestamp";
  };
}

export interface DataTemplatePropertyString extends DataTemplatePropertyBase {
  define: {
    type: "string";
    max: number;
    min: number;
  };
}

// 数组、结构体子类型 spec 声明：
export interface TemplateSpecBase {
  id: string;
  name: string;
}

export interface TemplateSpecBool extends TemplateSpecBase {
  dataType: DataTemplatePropertyBool["define"];
}

export interface TemplateSpecEnum extends TemplateSpecBase {
  dataType: DataTemplatePropertyEnum["define"];
}

export interface TemplateSpecStringEnum extends TemplateSpecBase {
  dataType: DataTemplatePropertyStringEnum["define"];
}

export interface TemplateSpecInt extends TemplateSpecBase {
  dataType: DataTemplatePropertyInt["define"];
}

export interface TemplateSpecFloat extends TemplateSpecBase {
  dataType: DataTemplatePropertyFloat["define"];
}

export interface TemplateSpecTimestamp extends TemplateSpecBase {
  dataType: DataTemplatePropertyTimestamp["define"];
}

export interface TemplateSpecString extends TemplateSpecBase {
  dataType: DataTemplatePropertyString["define"];
}

export type TemplateSpecDefine =
  | TemplateSpecBool
  | TemplateSpecEnum
  | TemplateSpecStringEnum
  | TemplateSpecInt
  | TemplateSpecFloat
  | TemplateSpecTimestamp
  | TemplateSpecString;

// 结构体
export interface DataTemplatePropertyStruct extends DataTemplatePropertyBase {
  define: {
    type: "struct";
    specs: TemplateSpecDefine[];
  };
}

// 数组支持4种结构，int|float|string|struct
export type DataTemplatePropertyArrayStruct = DataTemplatePropertyStruct["define"];

export type DataTemplatePropertyArrayInt = DataTemplatePropertyInt["define"];

export type DataTemplatePropertyArrayFloat = DataTemplatePropertyFloat["define"];

export type DataTemplatePropertyArrayString = DataTemplatePropertyString["define"];

// 数组
export interface DataTemplatePropertyArray extends DataTemplatePropertyBase {
  define: {
    type: "array";
    arrayInfo:
      | DataTemplatePropertyArrayStruct
      | DataTemplatePropertyArrayInt
      | DataTemplatePropertyArrayFloat
      | DataTemplatePropertyArrayString;
  };
}

export interface DataTemplateEvent {
  id: string;
  name: string;
  desc: string;
  type: "alert" | "info" | "fault";
  required: boolean;
  params: Omit<BaseDataTemplateProperty, "required" | "mode">[];
}

export interface DataTemplateAction {
  id: string;
  name: string;
  desc: string;
  input: Omit<BaseDataTemplateProperty, "required" | "mode" | "desc">[];
  output: Omit<BaseDataTemplateProperty, "required" | "mode" | "desc">[];
}

export const getDefaultValueOfPropertyDefine = (define: DataTemplateProperty["define"] | TemplateSpecDefine["dataType"]) => {
  switch (define.type) {
    case "int":
    case "float":
      return typeof define.start === "string" ? Number(define.start) : 0;
    case "string":
      return "";
    case "bool":
      return 0;
    case "enum":
      return Number(Object.keys(define.mapping)[0]);
    case "stringenum":
      return Object.keys(define.mapping)[0];
    case "struct":
      return {};
    case "array":
      return [];
    case "timestamp":
      return 0;
    default:
      return null;
  }
};

type ValueValidatorFn = (value: unknown, define: DataTemplateProperty["define"] | TemplateSpecDefine["dataType"]) => boolean;

const valueValidatorMap: Record<TemplateDataType, ValueValidatorFn> = {
  bool: (value) => value === 1 || value === 0,
  int: (value) => Number.isSafeInteger(value),
  float: (value) => typeof value === "number" && !isNaN(value),
  string: (value) => typeof value === "string",
  enum: (value) => Number.isSafeInteger(value),
  stringenum: (value) => typeof value === "string",
  timestamp: (value) => Number.isSafeInteger(value),
  struct: (value) => !!value && typeof value === "object",
  array: (value) => Array.isArray(value),
};

export const normalizeDataByTemplate = (data: Record<string, unknown>, propertyList: DataTemplateProperty[]) => {
  const normalizeValue = (originalValue: unknown, define: DataTemplateProperty["define"] | TemplateSpecDefine["dataType"]) => {
    let finalValue = originalValue;
    const applyDefaultValue = () => {
      finalValue = getDefaultValueOfPropertyDefine(define);      
    };

    if (finalValue === undefined) {
      applyDefaultValue();
    }

    const validator = valueValidatorMap[define.type];
    if (validator && !validator(finalValue, define)) {
      applyDefaultValue();
    }

    if (define.type === "struct") {
      const structValue = <Record<string, unknown>>finalValue;
      define.specs.forEach((spec) => {
        structValue[spec.id] = normalizeValue(structValue[spec.id], spec.dataType);
      });
    }

    if (define.type === "array") {
      const arrayValue = <unknown[]>finalValue;
      finalValue = arrayValue.map(item => normalizeValue(item, define.arrayInfo));
    }

    return finalValue;
  };

  propertyList.forEach((property) => {
    data[property.id] = normalizeValue(data[property.id], property.define);
  });

  return data;
};
