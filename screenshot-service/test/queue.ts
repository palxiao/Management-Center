/*
 * @Author: ShawnPhang
 * @Date: 2021-12-24 18:17:09
 * @Description: 多重异步队列测试
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2022-01-20 14:22:23
 * @site: book.palxp.com / blog.palxp.com
 */

const maxNum = 1
const queueList = []
let curNum = 0

function queueRun(business) {
  console.log('当前任务：',queueList.length);
  return new Promise(async (resolve) => {
    const Fn = async () => resolve(await business())
    if (curNum >= maxNum) {
      queueList.push(Fn)
      console.log('--进入队列', '，数量：'+queueList.length);
    } else {
      await run(Fn)
    }
  })
}

function run(Fn) {
  curNum++
  Fn().then((res) => {
    curNum--
    if (queueList.length > 0) {
      const Task = queueList.shift()
      run(Task)
    }
    return res
  })
}

// 业务函数

// function Test() {
//   return new Promise(async (resolve) => {
//     console.log('运行业务')
//     await sleep()
//     await exposeFunction(async () => {
//       console.log('--完成回调，销毁浏览器')
//       resolve('')
//     })
//   })
// }
const Test = async () => {
  return new Promise(async (resolve) => {
    console.log('运行业务')
    await sleep()
    await exposeFunction(async () => {
      console.log('--完成回调，销毁浏览器')
      resolve('')
    })
  })
}
function exposeFunction(cb) {
  cb()
}
function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('')
    }, 2000)
  })
}

// Test
// const { saveScreenshot } = require('../src/utils/downloadtest.ts')

// ;(function mock() {
//   for (let i = 0; i < 30; i++) {
//     queueRun(saveScreenshot).then((res) => {
//       console.log(res)
//     })
//   }
// })()

module.exports = queueRun