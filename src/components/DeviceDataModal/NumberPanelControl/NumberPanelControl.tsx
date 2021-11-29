import React, {useState, useMemo, ChangeEvent} from 'react';
import { noop } from '../../../utils';
import { Modal } from '../../Modal';
import { RawBtn, BtnOptions } from '../../Btn';

import './NumberPanelControl.less';

enum BtnType {
  Add = 'Add',
  Minus = 'Minus',
};

export interface NumberPanelControlProps {
  visible: boolean;
  templateConfig: TemplatePropertyConfig;
  value: number;
  onChange?: (value: number) => void;
  onClose?: () => void;
  showBackBtn?: boolean;
  confirmText?: string;
  cancelText?: string;
  cancelBtnType?: BtnOptions['type'];
}

export function NumberPanelControl({
   visible,
   templateConfig,
   value: outerValue,
   onChange = noop,
   onClose = noop,
   showBackBtn,
   confirmText = '确定',
   cancelText = '取消',
   cancelBtnType,
}: NumberPanelControlProps) {
  const {
    name,
    define: {
      type = '',
      start: _start = 0,
      step: _step = 0,
      max: _max = 0,
      min: _min = 0,
      unit = '',
    } = {},
  } = templateConfig || {};

  const min = +_min;
  const max = +_max;
  const start = +_start;
  const step = +_step;

  const [value, setValue] = useState(typeof outerValue === 'undefined' ? start : outerValue);

  const valueLeft = useMemo(() => {
    return (value - min) * 100 / (max - min);
  }, [value]);

  const onClickBtn = (btnType: BtnType) => {
    const prevValue = +value;

    switch (btnType) {
      case BtnType.Add:
        if (prevValue + step >= max) {
          setValue(max);
        } else {
          let nextValue = prevValue + step;
          if (type === 'float' && !!nextValue) {
            nextValue = +(nextValue.toFixed(3));
          }
          setValue(nextValue);
        }
        break;
      case BtnType.Minus:
        if (prevValue - step <= min) {
          setValue(min);
        } else {
          let nextValue = prevValue - step;
          if (type === 'float' && !!nextValue) {
            nextValue = +(nextValue.toFixed(3));
          }
          setValue(nextValue);
        }
        break;
    }
  };

  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const orgValue = parseFloat(event.target.value);

    if (type === 'float') {
      const value = orgValue.toFixed(3);
      setValue(+value);
    } else if (type === 'int') {
      const value = Math.round(orgValue);
      setValue(value);
    }
  };

  return (
    <Modal
      visible={visible}
      fixedBottom={true}
      onClose={onClose}
      title={name}
      containerClassName='device-shortcut-modal'
      showBackBtn={showBackBtn}
    >
      <Modal.Body>
        <div className='number-control-modal'>
          <RawBtn className='slider-btn minus' onClick={() => onClickBtn(BtnType.Minus)}>
            <div
              className='slider-btn-icon'
            />
          </RawBtn>

          <div className='slider-container clearfix'>
            <div className='number-control-value-container'>
              <div
                className='number-control-value'
                style={{
                  left: `${valueLeft}%`,
                }}
              >
                {value}{unit}
              </div>
            </div>
            <input
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onSliderChange}
              type="range"
            />
          </div>

          <RawBtn className='slider-btn plus' onClick={() => onClickBtn(BtnType.Add)}>
            <div
              className='slider-btn-icon'
            />
          </RawBtn>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Modal.FooterConfirmBtnGroup
          confirmText={confirmText}
          cancelText={cancelText}
          cancelBtnType={cancelBtnType}
          isInFixedBottomModal={true}
          onConfirm={() => {
            onChange(value);
            onClose();
          }}
          onCancel={onClose}
        />
      </Modal.Footer>
    </Modal>
  );
}
