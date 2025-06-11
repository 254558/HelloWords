/* 
洗牌算法
你有10张扑克
随便选一张牌和第一张牌交换顺序
随便选一张牌和第二张牌交换顺序
高端的算法往往采用原始的办法
 */


export function shuffle(array) {

  for (let i = array.length - 1; i > 0; i--) {

    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];

  }


  return array; 
}
