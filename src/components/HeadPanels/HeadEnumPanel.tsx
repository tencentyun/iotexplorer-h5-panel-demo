import React, { useRef, useMemo, useEffect } from 'react';
import classNames from 'classnames';
import './HeadEnumPanel.less';
import { Hoverable } from '../Hoverable';
import { noop } from '../../utils';

export interface EnumItemProps {
  text: string;
  value: number;
  active: boolean;
  disabled?: boolean;
  onChange?: (value: number) => void;
  onScrollIntoView?: (left: number, right: number) => void;
}

function EnumItem({
  text,
  value,
  active,
  disabled,
  onChange = noop,
  onScrollIntoView
}: EnumItemProps) {
  const elemRef = useRef<any>(null);

  useEffect(() => {
    if (active && elemRef.current && onScrollIntoView) {
      const rect = elemRef.current.getBoundingClientRect();
      onScrollIntoView(rect.left, rect.right);
    }
  }, [active]);

  return (
    <Hoverable
      className={classNames('enum-item need-hover', {
        actived: active,
      })}
      hoverClass="hover"
      onClick={() => {
        if (disabled) return;
        onChange(value);
      }}
      ref={elemRef}
    >
      <div className="enum-item-content">
        {text}
      </div>
    </Hoverable>
  );
}

export interface HeadEnumPanelProps {
  templateConfig: TemplatePropertyConfig;
  value: number;
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function HeadEnumPanel({
  templateConfig,
  value,
  onChange,
  disabled: outerDisabled,
}: HeadEnumPanelProps) {
  const {
    name,
    mode = '',
    define: {
      mapping = {} as any,
    } = {},
  } = templateConfig || {};

  const disabled = Boolean(outerDisabled) || mode.indexOf('w') === -1;
  
  const keys = Object.keys(mapping);
  const realValue = value || +keys[0];

  const listRef = useRef<any>(null);

  const enumList = useMemo(() => {
    const list = [] as { value: number; text: string; }[];

    keys.forEach((key) => {
      list.push({ value: +key, text: mapping[key] });
    });

    return list;
  }, [mapping]);

  const scrollIntoView = (left: number, right: number) => {
    if (!listRef.current) return;
    const leftEdge = 24;
    const rightEdge = listRef.current.getBoundingClientRect().right - 24;

    let delta = 0;
    if (left < leftEdge) {
      delta = left - leftEdge;
      
    } else if (right > rightEdge) {
      delta = right - rightEdge;
    }
    
    if (delta) {
      listRef.current.scrollLeft += delta;
    }
  };

  return (
    <div
      className={classNames("head-enum-panel", {
        disabled,
      })}
    >
      <div className="enum-value">
        {mapping[realValue]}
      </div>
      <div className="enum-name">{name}</div>

      <div
        className="enum-list"
        ref={listRef}
      >
        {enumList.map(item => (
          <EnumItem
            key={item.value}
            value={item.value}
            text={item.text}
            onChange={onChange}
            disabled={disabled}
            active={item.value === realValue}
            onScrollIntoView={scrollIntoView}
          />
        ))}
      </div>
    </div>
  );
}

