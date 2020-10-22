import React, { useContext } from 'react';
import classNames from 'classnames';
import './Grid.less';

const GridContext = React.createContext({ gap: 12 });

export interface RowProps extends StyledProps {
  gap?: number;
  align?: 'top' | 'middle' | 'bottom' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between';
  children?: React.ReactNode;
}

export function Row({
  gap,
  align,
  justify,
  children,
  className,
  style,
}: RowProps) {
  let grid = { gap: 12 };
  let rowStyle = null;

  if (typeof gap === 'number') {
    grid = { gap };
    rowStyle = {
      marginLeft: -gap / 2,
      marginRight: -gap / 2,
    };
  }

  return (
    <div
      className={classNames(
        'row',
        className,
        {
          [`explorer-h5-vertical_${align}`]: align,
          [`explorer-h5-justify_${justify}`]: justify,
        }
      )}
      style={{
        ...(rowStyle || {}),
        ...(style || {}),
      }}
    >
      <GridContext.Provider value={grid}>
        {children}
      </GridContext.Provider>
    </div>
  );
}

export interface ColProps extends StyledProps {
  // 取值 1 - 12
  span?: number;
  children?: React.ReactNode;
}

export function Col({
  span,
  children,
  className,
  style
}: ColProps) {
  const grid = useContext(GridContext);

  let colStyle = null;
  if (grid) {
    colStyle = {
      paddingLeft: grid.gap / 2,
      paddingRight: grid.gap / 2,
    };
  }

  return (
    <div
      className={classNames(
        'col',
        className,
        {
          [`col_span-${span}`]: span
        },
      )}
      style={{
        ...(colStyle || {}),
        ...(style || {}),
      }}
    >
      <div className='explorer-h5-col__content'>
        {children}
      </div>
    </div>
  );
}
