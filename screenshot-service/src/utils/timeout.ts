/*
 * @Author: ShawnPhang
 * @Date: 2021-12-24 17:51:15
 * @Description: 超时中间件
 * @LastEditors: ShawnPhang
 * @LastEditTime: 2021-12-26 15:59:26
 * @site: book.palxp.com / blog.palxp.com
 */
// import express, { Request, Response, NextFunction } from 'express'
const express = require('express')
const { Request, Response, NextFunction } = express

export async function handleTimeout(req: Request, res: Response, next: NextFunction) {
    const time = 30000
    // 设置所有HTTP请求的服务器响应超时时间
    res.setTimeout(time, () => {
        const statusCode = 408
        if (!res.headersSent) { // 若请求还未结束，则回复超时
            res.status(statusCode).json({
                statusCode,
                message: '请求响应超时'
            })
        }
    })
    next()
}
