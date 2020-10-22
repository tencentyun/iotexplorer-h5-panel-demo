import React, { useMemo } from 'react';
import { Row, Col } from '../components/Grid';
import { groupArrayItems } from '../utils';

export const LayoutTypes = {
  mini: { name: '小按钮', colSpan: 4, cardDirection: 'column' },
  medium: { name: '中按钮', colSpan: 6, cardDirection: 'row' },
  wide: { name: '长按钮', colSpan: 12, cardDirection: 'row' },
};

export interface PropertyListProps {
  templateList: TemplatePropertyConfig[];
  renderProperty: (options: {
    templateConfig: TemplatePropertyConfig;
    cardDirection: string;
  }) => React.ReactNode;
  layoutType: 'mini' | 'medium' | 'wide'; // 长按钮:wide, 中按钮:medium, 小按钮:mini
}

export function PropertyList({
  templateList,
  renderProperty,
  layoutType,
}: PropertyListProps) {
  const cardLayoutParams = LayoutTypes[layoutType];

  const groupedTemplateList: TemplatePropertyConfig[][] = useMemo(() => {
    return groupArrayItems(templateList, 12 / cardLayoutParams.colSpan)
  }, [cardLayoutParams, templateList]);

  return (
    <>
      {groupedTemplateList.map((row, index) => (
        <Row key={index}>
          {row.map((templateConfig, index) => (
            <Col span={cardLayoutParams.colSpan} key={index}>
              {renderProperty({
                templateConfig,
                cardDirection: cardLayoutParams.cardDirection,
              })}
            </Col>
          ))}
        </Row>
      ))}
    </>
  );
}

