import React from 'react';
import './ActionSheet.less';
import { noop } from '../../utils';

export interface ActionSheetProps {
  visible: boolean;
  children: React.ReactNode;
  title?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  showConfirm: boolean;
  confirmText?: string;
  confirmColor?: string;
  showCancel: boolean;
  cancelText?: string;
  cancelColor?: string;
  maskClosable: boolean;
}

export function ActionSheet({
  visible,
  children,
  title = '',
  onCancel = noop,
  onConfirm = noop,
  showConfirm = true,
  confirmText = '确定',
  confirmColor = '#0066ff',
  showCancel = true,
  cancelText = '取消',
  cancelColor = '#000',
  maskClosable = true,
}: ActionSheetProps) {
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
