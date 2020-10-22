import React, { useRef, useMemo, useEffect, useState } from 'react';
import './HeadNumberPanel.less';

const toArray = (obj: any) => Array.prototype.slice.apply(obj);

const getPrecision = (value: any) => {
  if (typeof value !== 'number') {
    return 0;
  }
  const str = value.toString();
  if (/e-(.+)$/.test(str)) {
    return parseInt(RegExp.$1, 10);
  }
  if (str.indexOf('.') >= 0) {
    return str.length - str.indexOf('.') - 1;
  }
  return 0;
}

export interface HeadNumberPanelProps {
  templateConfig: TemplatePropertyConfig;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function HeadNumberPanel({
  templateConfig,
  value: outerValue,
  onChange,
  disabled: outerDisabled,
}: HeadNumberPanelProps) {
  const {
    name,
    mode,
    define: {
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

  const precision = useMemo(() => getPrecision(+(step || 0)), [step]);

  const alignValue = (value: number) => {
    const pow = 10 ** precision;
  
    value -= min;
    value -= ((value * pow) % (step * pow)) / pow;
    value += min;
  
    if (value < min) {
      value = min;
    }
  
    if (value > max) {
      value = max;
    }
  
    return parseFloat(value.toFixed(precision));
  };

  const disabled = Boolean(outerDisabled) || mode.indexOf('w') === -1;

  // 内部 value，无刻度对齐
  const [value, setValue] = useState(outerValue === undefined ? start : outerValue);
  // 内部 value，有刻度对齐
  const alignedValue = useMemo(() => alignValue(value), [value]);

  const barElemRef = useRef<any>(null);

  const touchInfo = useRef<{
    identifier: any;
    startY: number;
    startValue: number;
    totalHeight: number;
    cleanup?: () => void;
  } | null>(null);

  useEffect(() => {
    const alignedOuterValue = alignValue(outerValue === undefined ? start : outerValue);

    if (alignedOuterValue !== alignedValue) {
      setValue(outerValue);
    }

    if (disabled) {
      touchInfo.current = null;
      setShowValueHint(false);
    }
  }, [outerValue, disabled]);

  const [showValueHint, setShowValueHint] = useState(false);
  
  const range = Math.abs(max - min);
  const proportion = ((value - min) / range) * 100;

  const getValueByPos = (y: number) => {
    if (touchInfo.current) {
      const { startY, startValue, totalHeight } = touchInfo.current;

      let currentValue = startValue + (startY - y) / totalHeight * range;
      currentValue = Math.min(max, Math.max(min, currentValue));
  
      return currentValue;
    } else {
      return start;
    }
  };

  const onControlStart = (identifier: any, y: number, cleanup?: () => void | null) => {
    if (touchInfo.current && touchInfo.current.cleanup) {
      touchInfo.current.cleanup();
    }

    touchInfo.current = {
      identifier: identifier,
      startY: y,
      startValue: value,
      totalHeight: barElemRef.current.getBoundingClientRect().height,
      cleanup,
    };

    setShowValueHint(true);
  };

  const onControlMove = (y: number) => {
    setValue(getValueByPos(y));
  };

  const onControlEnd = (y: number) => {
    const newValue = getValueByPos(y);
    setValue(newValue);

    const alignedValue = alignValue(newValue);

    if (alignedValue !== outerValue) {
      onChange(alignedValue);
    }

    if (touchInfo.current && touchInfo.current.cleanup) {
      touchInfo.current.cleanup();
    }
    
    touchInfo.current = null;
    setShowValueHint(false);
  };

  const onControlCancel = () => {
    setValue(outerValue);

    touchInfo.current = null;
    setShowValueHint(false);
  }

  const onTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;

    const touch = e.changedTouches[0];
    if (!touch || !barElemRef.current) return;

    onControlStart(touch.identifier, touch.clientY);
  };

  const getCurrentTouch = (e: React.TouchEvent) => {
    if (touchInfo.current) {
      const { identifier } = touchInfo.current;
      return toArray(e.changedTouches).find(touch => touch.identifier === identifier);
    } else {
      return null;
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;

    const touch = getCurrentTouch(e);
    if (touch) {
      onControlMove(touch.clientY);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;

    const touch = getCurrentTouch(e);
    if (touch) {
      onControlEnd(touch.clientY);
    }
  };

  const onTouchCancel = (e: React.TouchEvent) => {
    e.preventDefault();
    if (disabled) return;

    const touch = getCurrentTouch(e);
    if (touch) {
      onControlCancel();
    }
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (disabled) return;

    const onMouseMove = (e: MouseEvent) => {
      onControlMove(e.clientY);
    };

    const onMouseUp = (e: MouseEvent) => {
      onControlEnd(e.clientY);
    };

    const removeListener = () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    };

    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    onControlStart(null, e.clientY, removeListener);
  };

  return (
    <div
      className="head-number-panel"
    >
      <div className="number-info">
        <span className="number-name">{name}</span>
        <span className="number-value">{alignedValue}</span>
        <span className="number-unit">{unit}</span>
      </div>

      <div className="number-control">
        <div
          className="number-control-content"
        >
          <div className="number-mark"/>
          <div className="number-range">
            <div className="number-max">{max}</div>
            <div className="number-min">{min}</div>
            <div
              className="number-value-hint"
              style={{
                bottom: `${proportion}%`,
                display: showValueHint ? 'block' : 'none'
              }}
            >
              {`${alignedValue}${unit}`}
            </div>
          </div>

          <div
            className="number-bar"
            ref={barElemRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchCancel}
            onMouseDown={onMouseDown}
          >
            <div
              className="number-track upper"
            />
            <div
              className="number-track under"
              style={{ bottom: `${proportion}%` }}
            >
              <div
                className="number-handler"
                style={{ top: `${proportion < 1.5 ? 1 : proportion <= 5 ? 8 : 14}rpx` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
