import React, { useState } from "react";
import sdk from "qcloud-iotexplorer-h5-panel-sdk";
import { Card } from "../components/Card";
import { EnumPanelControl, NumberPanelControl } from "../components/DeviceDataModal";
import { DataTemplateProperty, DataTemplatePropertyBool, DataTemplatePropertyEnum, DataTemplatePropertyFloat, DataTemplatePropertyInt, DataTemplatePropertyStringEnum, TemplateSpecBool, TemplateSpecDefine, TemplateSpecEnum, TemplateSpecFloat, TemplateSpecInt, TemplateSpecStringEnum } from "../dataTemplate";
import { Col, Row } from "../components/Grid";

function BoolPropertyCard({
  property,
  value,
  onChange,
  disabled,
}: {
  property: DataTemplatePropertyBool | TemplateSpecBool;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  const { name } = property;
  const defineOrSpec = "dataType" in property ? property.dataType : property.define;

  return (
    <Card
      icon="create"
      title={name}
      desc={defineOrSpec.mapping[String(value)] || "-"}
      onClick={() => {
        onChange(value ? 0 : 1);
      }}
      disabled={disabled}
      direction="row"
    />
  );
}

function EnumPropertyCard({
  property,
  value,
  onChange,
  disabled,
}: {
  property: DataTemplatePropertyEnum
  | DataTemplatePropertyStringEnum
  | TemplateSpecEnum
  | TemplateSpecStringEnum;
  value: number | string;
  onChange: (value: number | string) => void;
  disabled: boolean;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const defineOrSpec = "dataType" in property ? property.dataType : property.define;

  return (
    <>
      <Card
        icon="create"
        title={property.name}
        desc={defineOrSpec.mapping[String(value)] || "-"}
        onClick={() => {
          setModalVisible(true);
        }}
        disabled={disabled}
        direction="row"
      />
      {modalVisible && (
        <EnumPanelControl
          visible={true}
          name={property.name}
          define={defineOrSpec}
          value={value}
          onChange={onChange}
          onClose={() => setModalVisible(false)}
          valueType={defineOrSpec.type === "stringenum" ? "stringenum" : "enum"}
        />
      )}
    </>
  );
}

function NumberPropertyCard({
  property,
  value,
  onChange,
  disabled,
}: {
  property: DataTemplatePropertyInt
  | DataTemplatePropertyFloat
  | TemplateSpecInt
  | TemplateSpecFloat;
  value: number;
  onChange: (value: number) => void;
  disabled: boolean;
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const defineOrSpec = "dataType" in property ? property.dataType : property.define;

  return (
    <>
      <Card
        icon="create"
        title={property.name}
        desc={String(value)}
        onClick={() => {
          setModalVisible(true);
        }}
        disabled={disabled}
        direction="row"
      />
      {modalVisible && (
        <NumberPanelControl
          visible={true}
          name={property.name}
          define={defineOrSpec}
          value={value}
          onChange={onChange}
          onClose={() => setModalVisible(false)}
        />
      )}
    </>
  );
}

export function PropertyCard({
  property,
  value,
  onChange,
  disabled: outerDisabled,
}: {
  property: DataTemplateProperty | TemplateSpecDefine;
  value: unknown;
  onChange: (value: unknown) => void;
  disabled: boolean;
}) {
  let disabled = Boolean(outerDisabled);
  if ("mode" in property && typeof property.mode === "string" && property.mode.indexOf("w") === -1) {
    disabled = true;
  }

  const defineOrSpec = "dataType" in property ? property.dataType : property.define;

  if (defineOrSpec.type === "struct") {
    // 结构体
    const structValue = value as Record<string, unknown>;
    return (
      <>
        <Row>
          <Col span={12}><Card icon="create" title={property.name} desc="结构体" direction="row" /></Col>
        </Row>
        {defineOrSpec.specs.map((spec) => (
          <Row key={spec.id}>
            <Col span={2} />
            <Col span={10}>
              <PropertyCard
                property={spec}
                value={structValue[spec.id]}
                disabled={disabled}
                onChange={(value) => {
                  onChange({
                    ...structValue,
                    [spec.id]: value,
                  });
                }}
              />
            </Col>
          </Row>
        ))}
      </>
    )
  }

  if (defineOrSpec.type === "array") {
    // 数组
    const arrayValue = value as unknown[];
    const arrayElemDefine = defineOrSpec.arrayInfo;
    return (
      <>
        <Row>
          <Col span={12}>
            <Card icon="create" title={property.name} desc={`数组 [${arrayValue.length}]`} direction="row" /></Col>
        </Row>
        {arrayValue.map((item, index) => {
          const elemProperty = {
            id: String(index),
            name: `[${index}]`,
            required: false,
            desc: "",
            mode: "mode" in property ? property.mode : "rw",
            define: arrayElemDefine,
          } as any;

          return (<Row key={index}>
            <Col span={2} />
            <Col span={10}>
              <PropertyCard
                property={elemProperty}
                value={item}
                disabled={disabled}
                onChange={(value) => {
                  const array = arrayValue.slice();
                  array[index] = value;
                  onChange(array);
                }}
              />
            </Col>
          </Row>);
        })}
      </>
    )
  }

  let elem = null;
  switch (defineOrSpec.type) {
    case "int":
    case "float":
      elem = (
        <NumberPropertyCard
          property={property as DataTemplatePropertyInt | DataTemplatePropertyFloat | TemplateSpecInt | TemplateSpecFloat}
          value={value as number}
          onChange={onChange}
          disabled={disabled}
        />
      );
      break;
    case "bool":
      elem = (
        <BoolPropertyCard
          property={property as DataTemplatePropertyBool | TemplateSpecBool}
          value={value as number}
          onChange={onChange}
          disabled={disabled}
        />
      );
      break;
    case "enum":
    case "stringenum":
      elem = (
        <EnumPropertyCard
          property={property as DataTemplatePropertyEnum | DataTemplatePropertyStringEnum | TemplateSpecEnum | TemplateSpecStringEnum}
          value={value as number}
          onChange={onChange}
          disabled={disabled}
        />
      );
      break;
    case "string":
      elem = (
        <Card
          icon="create"
          title={property.name}
          desc={String(value)}
          onClick={() => {
            sdk.tips.showInfo(`H5 面板 Demo 暂不支持控制字符串类型的属性`);
          }}
          disabled={disabled}
          direction="row"
        />
      );
      break;
    default:
      elem = (
        <Card
          icon="create"
          title={property.name}
          desc={JSON.stringify(value)}
          onClick={() => {
            sdk.tips.showInfo(`H5 面板 Demo 暂不支持控制 ${defineOrSpec.type} 类型的属性`);
          }}
          disabled={disabled}
          direction="row"
        />
      );
      break;
  }

  return elem ? (
    <Row>
      <Col span={12}>{elem}</Col>
    </Row>
  ) : null;
}
