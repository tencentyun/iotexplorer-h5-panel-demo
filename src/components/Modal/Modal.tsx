import React from 'react';
import classNames from 'classnames';
import { noop } from '../../utils';
import { Hoverable } from '../Hoverable';
import { ConfirmBtnGroup, ConfirmBtnGroupProps } from "../Btn";
import { useSystemInfo } from "../../hooks/useSystemInfo";
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import './Modal.less';

export interface ModalProps extends StyledProps {
  visible: boolean;
  title?: string | React.ReactNode;
  onClose?: () => any;
  maskClosable?: boolean;
  fixedBottom?: boolean;
  children?: React.ReactNode;
  containerClassName?: string;
  showBackBtn?: boolean;
}

export function Modal({
  visible,
  title,
  onClose = noop,
  maskClosable = true,
  fixedBottom = false,
  children,
  className,
  containerClassName,
  style,
  showBackBtn = false,
}: ModalProps) {
  const { ipx } = useSystemInfo();

  return (
    <div
      className={classNames(
        'modal-container',
        containerClassName,
        {
          'modal-active': visible,
          'modal-fixed-bottom': fixedBottom,
        },
      )}
      onTouchMove={e => e.stopPropagation()}
    >
      <div
        className='modal-mask'
        onClick={() => {
          if (maskClosable) {
            onClose && onClose();
          }
        }}
      />
      <div
        className={classNames('modal', className, { ipx })}
        style={style}
      >
        {title && (
          <div className='modal-header'>
            {showBackBtn && (
              <Hoverable
                className='back-btn need-hover'
                hoverClass='hover'
                onClick={onClose}
              >
                <img
                  className='back-btn-icon'
                />
              </Hoverable>
            )}
            <div className='modal-title'>{title}</div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

Modal.Body = ({ children }) => (
  <div className='modal-body'>
    {children}
  </div>
);

Modal.Footer = ({
  children,
  showDivider,
}: {
  showDivider?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <div className={classNames('modal-footer')}>
      {showDivider && (
        <Modal.Divider/>
      )}
      {children}
    </div>
  );
};

export interface FooterConfirmBtnGroup extends ConfirmBtnGroupProps {
  confirmColor?: string;
  cancelColor?: string;
  isInFixedBottomModal?: boolean;
  noBorder?: boolean;
  btnSize?: number;
}

Modal.Divider = () => (
  <div className='modal-divider'/>
);

Modal.FooterConfirmBtnGroup = ({
  onCancel,
  onConfirm,
  confirmText,
  confirmColor = sdk.themeColorMap.primary,
  confirmBtnType,
  confirmBtnDisabled,
  cancelText,
  cancelBtnDisabled,
  cancelColor = sdk.themeColorMap.weak,
  cancelBtnType,
  isInFixedBottomModal,
  noBorder,
  btnSize = 32,
}: FooterConfirmBtnGroup) => {

  const renderContent = () => {
    if (isInFixedBottomModal) {
      return (
        <ConfirmBtnGroup
          {...{
            onCancel,
            onConfirm,
            confirmText,
            confirmBtnType,
            confirmBtnDisabled,
            cancelText,
            cancelBtnType,
            cancelBtnDisabled,
          }}
        />
      );
    }

    return (
      <div className='footer-confirm-btn-group'>
        {!!cancelText && (
          <Modal.FooterBtn
            noBorder={noBorder}
            onClick={onCancel}
            style={{
              color: cancelColor,
              fontSize: `${btnSize}rpx`
            }}
          >
            {cancelText}
          </Modal.FooterBtn>
        )}
        {!!confirmText && (
          <Modal.FooterBtn
            noBorder={noBorder}
            onClick={onConfirm}
            style={{
              color: confirmColor,
              fontSize: `${btnSize}rpx`
            }}
          >
            {confirmText}
          </Modal.FooterBtn>
        )}
      </div>
    );
  };

  return renderContent();
};

export interface FooterBtnProps extends StyledProps {
  children: React.ReactNode;
  onClick?: any;
  noBorder?: boolean;
}

Modal.FooterBtn = ({
  children,
  onClick,
  style,
  className,
  noBorder,
}: FooterBtnProps) => (
  <div
    className={classNames('modal-footer-btn need-hover', className, {
      'no-border': noBorder,
    })}
    onClick={onClick}
    style={style}
  >
    {children}
  </div>
);

Modal.Message = ({ message }) => (
  <div className='modal-message'>
    {message}
  </div>
);
