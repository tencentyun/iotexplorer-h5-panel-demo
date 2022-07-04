import React, { useState } from 'react';
import classNames from 'classnames';

import { noop } from '../../../utils';
import { Modal } from '../../Modal';
import { Hoverable } from '../../Hoverable';
import {
  DataTemplatePropertyStringEnum,
  DataTemplatePropertyEnum,
  TemplateSpecEnum,
  TemplateSpecStringEnum,
} from '../../../dataTemplate';
import './EnumPanelControl.less';

export interface EnumPanelControlProps {
  visible: boolean;
  name: string;
  define: DataTemplatePropertyEnum['define']
    | DataTemplatePropertyStringEnum['define']
    | TemplateSpecEnum['dataType']
    | TemplateSpecStringEnum['dataType'];
  value: number | string;
  onChange?: (value: number | string) => void;
  onClose?: () => void;
  valueType: 'stringenum' | 'enum';
}

export function EnumPanelControl({
  visible,
  name,
  define,
  value,
  onChange = noop,
  onClose = noop,
  valueType,
}: EnumPanelControlProps) {
  const {
    mapping = {},
  } = define || {};

  const enumOptions = Object.keys(mapping).map((key) => ({
    text: mapping[key],
    value: valueType === 'enum' ? +key : String(key),
  }));

  const [localValue, setLocalValue] = useState(valueType === 'enum' ? +value : String(value));

  return visible ? (
    <Modal
      className="enum-modal"
      visible={true}
      fixedBottom={true}
      onClose={onClose}
      title={name}
      showBackBtn={false}
    >
      <Modal.Body>
        <div className="checkbox-group type-radio">
          {enumOptions.map((item) => (
            <Hoverable
              key={item.value}
              className={classNames('checkbox-item need-hover', {
                actived: item.value === localValue,
              })}
              hoverClass='hover'
              onClick={() => setLocalValue(item.value)}
            >
              <div className="checkbox-container">
                <div className={classNames('checkbox-icon', { checked: item.value === localValue  })} />
              </div>
              <div className="checkbox-item-text text-overflow">
                {item.text}
              </div>
            </Hoverable>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.FooterConfirmBtnGroup
          confirmText="确定"
          cancelText="取消"
          cancelBtnType="cancel"
          isInFixedBottomModal={true}
          onConfirm={() => {
            onChange(localValue);
            onClose();
          }}
          onCancel={onClose}
        />
      </Modal.Footer>
    </Modal>
  ) : null;
}
