import React, { useRef, useMemo, useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { ActionSheet } from './ActionSheet';
import './NumberPanelControl.less';
import { noop } from '../utils';
import Slider from 'react-rangeslider';
import 'react-rangeslider/lib/index.css'


export function NumberPanelControl({
  visible,
  templateId,
  templateConfig,
  value: outerValue,
  onChange = noop,
  onClose = noop,
}) {
  let {
    name,
    define: {
      start,
      step,
      max,
      min,
      unit,
    } = {},
  } = templateConfig || {};

  min = +min;
  max = +max;
  start = +start;
  step = +step;

  const [value, setValue] = useState(typeof outerValue === 'undefined' ? start : outerValue);

  const onConfirm = () => {
    onChange(templateId, value);
    onClose();
  };

  return (
    <ActionSheet
      title={`${name}设置`}
      visible={visible}
      showCancel={false}
      confirmColor="#000"
      maskClosable={true}
      onConfirm={onConfirm}
      onCancel={onClose}
    >
      <div className="number-panel-control">
        <div className="number-panel-content">
          <div className="number-panel-value">
            {value}{unit}
          </div>
        </div>

        {/*<Slider*/}
        {/*  value={value}*/}
        {/*  onChange={value => setValue(value)}*/}
        {/*  step={step}*/}
        {/*  max={max}*/}
        {/*  min={min}*/}
        {/*  defaultValue={start}*/}
        {/*/>*/}
        <Slider
          tooltip={false}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={value => setValue(value)}
        />
      </div>
    </ActionSheet>
  );
}
