import React, { useState } from 'react';
import classNames from 'classnames';

import { noop } from '../../../utils';
import { Modal } from '../../Modal';
import { Hoverable } from '../../Hoverable';
import './EnumPanelControl.less';

export interface EnumPanelControlProps {
  visible: boolean;
  templateConfig: TemplatePropertyConfig;
  value: number;
  onChange?: (value: number) => void;
  onClose?: () => void;
}

export function EnumPanelControl({
  visible,
  templateConfig,
  value,
  onChange = noop,
  onClose = noop,
}: EnumPanelControlProps) {
  const {
    name,
    define: {
      mapping = {} as any,
    } = {},
  } = templateConfig || {};

  const enumOptions = Object.keys(mapping).map((key) => ({
    text: mapping[key],
    value: +key,
  }));

  const [localValue, setLocalValue] = useState(+value);

  return Boolean(visible) && (
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
  );
}
