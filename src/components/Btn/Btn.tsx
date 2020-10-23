import React from 'react';
import classNames from 'classnames';

import { Hoverable } from '../Hoverable';
import './Btn.less';

export interface BtnOptions extends StyledProps {
  disabled?: boolean;
  // type=default = type:primary + reverse:true
  // type=cancel 时，只有一个样式，reverse和transparent无效
  type?: 'default' | 'primary' | 'danger' | 'cancel' | 'link';
  onClick?: any;
  icon?: string;
  reverse?: boolean; // 翻转颜色
  transparent?: boolean; // 透明底色
  btnText?: string | React.ReactNode;
  standalone?: boolean;
  children?: React.ReactNode;
}

export function Btn({
  disabled,
  type = 'default',
  onClick,
  icon,
  reverse = false,
  transparent = false,
  style,
  className,
  btnText,
  standalone,
  children,
  ...nativeBtnProps
}: BtnOptions) {
  const renderContent = () => {
    return (
      <>
        {icon && (
          <img
            src={icon}
            className='btn-icon'
          />
        )}
        {Boolean(btnText) ? (<span className='btn-text'>btnText</span>) : children}
      </>
    );
  };

  if (type === 'default') {
    type = 'primary';
    reverse = true;
  }

  // 如果透明底必须要翻转
  if (transparent) {
    reverse = true;
  }

  const hoverClass = type === 'link' ? 'link-hover' : 'hover';

  return (
    <Hoverable
      className={classNames('btn',
        className,
        type ? `btn-${type}` : '',
        {
          standalone,
          disabled,
          transparent,
          reverse,
        }
      )}
      style={style}
      hoverClass={disabled ? 'none' : hoverClass}
      onClick={(e: React.MouseEvent<HTMLElement>) => {
        if (disabled) {
          return;
        }

        if (typeof onClick === 'function') {
          onClick(e);
        }
      }}
    >
      {renderContent()}
    </Hoverable>
  );
}

export interface RawBtnProps extends StyledProps {
  onClick?: any;
  children?: string | React.ReactNode;
  hoverClass?: string;
  //hoverStopPropagation?: boolean;
}

export function RawBtn({
  className,
  style,
  onClick,
  children,
  hoverClass = 'hover',
}: RawBtnProps) {
  return (
    <Hoverable
      className={classNames('need-hover', className)}
      style={{
        overflow: 'hidden',
        ...style
      }}
      hoverClass={hoverClass}
      onClick={onClick}
    >
      {children}
    </Hoverable>
  );
}
