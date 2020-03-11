import React, { useRef, useMemo, useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import { ActionSheet } from './ActionSheet';
import './EnumPanelControl.less';
import { noop } from "../utils";

export function EnumPanelControl({
  visible,
  templateId,
  templateConfig,
  value,
  onChange = noop,
  onClose = noop,
}) {
  let {
    id,
    name,
    define: {
      mapping = {},
    } = {},
  } = templateConfig || {};

  const enumList = [];

  for (const id in mapping) {
    enumList.push({
      text: mapping[id],
      value: id,
    });
  }

  return (
    <ActionSheet
      title={`${name}设置`}
      visible={visible}
      showCancel={true}
      showConfirm={false}
      cancelColor="#000"
      maskClosable={true}
      onCancel={onClose}
    >
      <div className="enum-panel-control">
        <div className="enum-list">
          {enumList.map(item => (
            <div
              className={classNames('enum-item', {
                actived: value === item.value,
              })}
              onClick={() => {
                onChange(id, +item.value);
                onClose();
              }}
            >
              {item.text}
            </div>
          ))}
        </div>
      </div>
    </ActionSheet>
  );
}
