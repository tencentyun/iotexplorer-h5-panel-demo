import React, { forwardRef, useState, Ref, useEffect } from 'react';
import classNames from 'classnames';

export interface HoverableProps<P extends keyof JSX.IntrinsicElements>
  extends StyledProps {

  // 使用什么标签来渲染，默认为 div；组件可透传对应标签的原生属性
  parent?: P;

  // 子组件
  children?: React.ReactNode;

  // 禁用 hover 效果
  disabled?: boolean;

  // hover 时向标签增加的 className，默认为 hover
  hoverClass?: string;
}

export type HoverablePropsType<
  P extends keyof JSX.IntrinsicElements
> = JSX.IntrinsicElements[P] & HoverableProps<P>;

function HoverableRaw<P extends keyof JSX.IntrinsicElements = 'span'>(
  props: HoverablePropsType<P>,
  ref: Ref<JSX.IntrinsicElements[P]>
) {
  const {
    parent,
    children,
    className,
    disabled,
    hoverClass = 'hover',
    ...htmlProps
  } = props;

  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (disabled) {
      setHover(false);
    }
  }, [disabled]);

  return React.createElement(
    parent || 'div',
    {
      ref,
      className: classNames(className, {
        [hoverClass]: !disabled && hover,
      }),
      onTouchStart: () => !disabled && setHover(true),
      onTouchMove: () => !disabled && setHover(false),
      onTouchEnd: () => !disabled && setHover(false),
      ...htmlProps,
    },
    children
  );
}

export const Hoverable = forwardRef(HoverableRaw);
