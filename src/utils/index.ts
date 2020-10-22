export const noop = () => { };

// 将一维数组中的元素，每 groupLength 个为一组，转换为二维数组
export const groupArrayItems = (arr: any[], groupLength: number) => {
  const result: any[] = [];
  if (!arr || arr.length === 0) return result;

  let currentRow: any[] = [];
  result.push(currentRow);

  arr.forEach((item) => {
    if (currentRow.length === groupLength) {
      currentRow = [];
      result.push(currentRow);
    }
    currentRow.push(item);
  });

  return result;
};
