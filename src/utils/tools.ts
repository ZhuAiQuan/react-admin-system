import { decode } from '@/utils/base64'

/**
 * 
 * @param name 传入一个加密session缓存名称
 * @returns 返回
 */
export const checkJson = (name: string) => {
  const data = localStorage.getItem(name);
  if (!data) return false
  try {
    return JSON.parse(decode(data as string))
  } catch {
    return false
  }
}
 /**
 * 笛卡尔积组装
 * @param {Array} list
 * @returns []
 */
  export function descartes(list: string[][]) {
    // parent 上一级索引;count 指针计数
    let point: any = {}; // 准备移动指针
    let result = []; // 准备返回数据
    let pIndex = null; // 准备父级指针
    let tempCount = 0; // 每层指针坐标
    let temp = []; // 组装当个 sku 结果
  
    // 一：根据参数列生成指针对象
    for (let index in list) {
      if (typeof list[index] === 'object') {
        point[index] = { parent: pIndex, count: 0 };
        pIndex = index;
      }
    }
  
    // 单维度数据结构直接返回
    if (pIndex === null) {
      return list;
    }
  
    // 动态生成笛卡尔积
    while (true) {
      // 二：生成结果
      let index: any;
      for (index in list) {
        tempCount = point[index].count;
        temp.push(list[index][tempCount]);
      }
      // 压入结果数组
      result.push(temp);
      temp = [];
  
      // 三：检查指针最大值问题，移动指针
      while (true) {
        if (point[index].count + 1 >= list[index].length) {
          point[index].count = 0;
          pIndex = point[index].parent;
          if (pIndex === null) {
            return result;
          }
          // 赋值 parent 进行再次检查
          index = pIndex;
        } else {
          point[index].count++;
          break;
        }
      }
    }
  }
  /**
   * 
   * @param list 将扁平数组转成tree数组数据 我这里这有两级
   */
  export const setFlatToTree = (list: Request.RequestCatNameTreeData[]) => {
    const root = list.filter(item => item.level === 1/**或者可以将条件换成pid===0*/); // 一级分类
    const secondTree = list.filter(item => item.level !== 1); // 二级分类
    const temp: (Request.RequestCatNameTreeData & { children?: Request.RequestCatNameTreeData[] })[] = [];
    if (root.length) {
      temp.push(...root)
    }
    temp.forEach(item => {
      const { id } = item;
      const rest = secondTree.filter(item => item.pid === id);
      if (rest.length) {
        item.children = [];
        item.children.push(...rest)
      }
    })
    return temp;
  } 