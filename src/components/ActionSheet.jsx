import React, { useRef, useMemo, useEffect, useState, useContext } from 'react';
import './ActionSheet.less';
import classNames from 'classnames';
import { noop } from '../utils';

export function ActionSheet({
  visible,
  children,
  title = '',
  onCancel = noop,
  onConfirm = noop,
  showConfirm = true,
  confirmText = '确定',
  confirmColor = '#0052d9',
  showCancel = true,
  cancelText = '取消',
  cancelColor = '#000',
  maskClosable = true,
}) {
  const onOutsideClick = () => {
    if (maskClosable) {
      onCancel();
    }
  };

  if (!visible) return null;

  return (
    <div className="action-sheet-container">
      <div
        className="action-sheet-mask"
        onClick={onOutsideClick}
      />
      <div className="action-sheet">
        {!!title && (
          <div className="action-sheet-header">
            <div className="action-sheet-title">
              {title}
            </div>
          </div>
        )}
        <div className="action-sheet-body hide-scrollbar">
          {children}
        </div>

        <div className="action-sheet-footer">
          {showCancel && (
            <div
              className="footer-btn need-hover"
              onClick={onCancel}
              style={{
                color: cancelColor,
              }}
            >
              {cancelText}
            </div>
          )}
          {showConfirm && (
            <div
              className="footer-btn need-hover"
              onClick={onConfirm}
              style={{
                color: confirmColor,
              }}
            >
              {confirmText}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
