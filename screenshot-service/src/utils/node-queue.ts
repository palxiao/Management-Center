/*
 * @Author: ShawnPhang
 * @Date: 2021-12-24 18:09:35
 * @Description: 多重异步队列
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-02-08 14:13:05
 * @site: book.palxp.com / blog.palxp.com
 */
const { maxNum } = require('../configs.ts')
// const maxNum = 1
const queueList: any[] = []
let curNum = 0

function queueRun(business: any, ...arg: any) {
  return new Promise(async (resolve) => {
    const Fn = async () => resolve(await business(...arg))
    if (curNum >= maxNum) {
      queueList.push(Fn)
    } else {
      await run(Fn)
    }
  })
}

function run(Fn: any) {
  curNum++
  Fn().then((res: any) => {
    curNum--
    if (queueList.length > 0) {
      const Task = queueList.shift()
      run(Task)
    }
    return res
  })
}

module.exports = queueRun
