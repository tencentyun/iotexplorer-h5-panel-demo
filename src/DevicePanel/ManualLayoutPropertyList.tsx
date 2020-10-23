import React, { useMemo } from 'react';
import { Col, Row } from '../components/Grid';

export interface ManualLayoutPropertyListProps {
  templateList: TemplatePropertyConfig[];
  renderProperty: (options: {
    templateConfig: TemplatePropertyConfig;
    cardDirection: string;
  }) => React.ReactNode;
}

// 手动排列属性卡片示例
export function ManualLayoutPropertyList({
  templateList,
  renderProperty,
}: ManualLayoutPropertyListProps) {
  // 取前3个属性作为示例
  const templateListToShow = useMemo(() => {
    return [
      templateList[0 % templateList.length],
      templateList[1 % templateList.length],
      templateList[2 % templateList.length],
    ];
  }, [templateList]);

  return (
    <>
      <Row>  { /* 一行显示一个属性（长按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示三个属性（小按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[1],
            cardDirection: 'column'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[2],
            cardDirection: 'column'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示两个属性，宽度比 1:1（中按钮） */ }
        <Col>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'row'
          })}
        </Col>

        <Col>
          {renderProperty({
            templateConfig: templateListToShow[1],
            cardDirection: 'row'
          })}
        </Col>
      </Row>

      <Row>  { /* 一行显示两个属性，宽度比 1:2 */ }
        <Col span={4}>
          {renderProperty({
            templateConfig: templateListToShow[0],
            cardDirection: 'column'
          })}
        </Col>

        <Col span={8}>
          {renderProperty({
            templateConfig: templateListToShow[1],
            cardDirection: 'column'
          })}
        </Col>
      </Row>
    </>
  );
}
