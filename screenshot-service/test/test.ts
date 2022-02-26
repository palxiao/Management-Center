

const queueRun = require('./queue.ts')
const { saveScreenshot } = require('../src/utils/downloadtest.ts')

for (let i = 0; i < 3; i++) {
  queueRun(saveScreenshot).then((res) => {
    console.log(res)
  })
}
