/**
 * 速芽物流用户端 - RegularMatch
 * http://menger.me
 * @大梦
 */


import { toastShort, consoleLog } from './utilsToast'

const phoneRule = /^1[34578]\d{9}$/;

export const checkPhone = (phone) => {
    let status = phoneRule.test(phone);
    return status;
};

const float1 = /^[1-9]\d*$/;              // 匹配正整数
const float2 = /^-[1-9]\d*$/;             // 匹配负整数
const float3 = /^-?[1-9]\d*$/;            // 匹配整数
const float4 = /^[1-9]\d*|0$/;            // 匹配非负整数（正整数 + 0）
const float5 = /^-[1-9]\d*|0$/;           // 匹配非正整数（负整数 + 0）

const float6 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/;                      // 匹配正浮点数
const float7 = /^-([1-9]\d*\.\d*|0\.\d*[1-9]\d*)$/;                   // 匹配负浮点数

const floatRule = /^-?([1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0)$/;         // 匹配浮点数
const float = /^\d+(\.\d+)?$/;              // 匹配f非负浮点数

const float9 = /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*|0?\.0+|0$/;             // 匹配非负浮点数（正浮点数 + 0）
const float10 = /^(-([1-9]\d*\.\d*|0\.\d*[1-9]\d*))|0?\.0+|0$/;        // 匹配非正浮点数（负浮点数 + 0）

export const checkFloat = (number) => {
    let status = floatRule.test(number);
    return status;
};