/*
 @directive 输入框限制范围：小数点个数 or 整数
        @param {data-keys} 如果是数组要加入index
        @param {data-dotrange} 小数位的范围
        @param {data-nonzero} 不能为零
        @param {data-form-Model} 当为el-table时使用
        @param {data-max-value} 最大值
*/

const maxNum = 99999999999999

// 寻找当前dom
let FindElement = (parent, selector) => {
    return parent.tagName.toLowerCase() === selector ? parent : parent.querySelector(selector)
}

// 设置组件中的指定属性的值
let setValue = function(exp, value, context, formModel, index) {
    value = isNaN(value) ? '' : value
    let model = exp
    if (formModel != '') {
        let formModelArr = formModel.split(',')
        model = `${formModelArr[0]}[${index}].${formModelArr[1]}`
    }
    new Function('context', 'value', `context.${model} = value`)(context, value)
}

export default {
    bind: function(el, { expression, value }, vnode){
        let $input = FindElement(el, 'input')
        let context = vnode.context

        el.$input = $input
        // 初始化lastValue
        $input.lastValue = $input.value
        // 通过dataset 判断是否允许小数点
        let allowDot = !!$input.dataset.dotrange,
            formModel = $input.dataset.formModel || '',
            notAllowZero = $input.dataset.nonzero != undefined,
            keys = $input.dataset.keys || -1,// 如果是数组则加入索引
            dotRange = $input.dataset.dotrange || `{0,2}`, // 默认
            pattern = `^[0-9]+${allowDot ? `(\\.[0-9]${dotRange})?` : ''}$`,
            maxValue = $input.dataset.maxValue || maxNum,
            new_expression = expression
        
        pattern = notAllowZero && !allowDot ? '^[1-9][0-9]*$' : pattern
        
        maxValue = parseFloat(maxValue)

        if (!expression) {
            throw new TypeError('请绑定expression')
        }

        // 循环
        if(keys !== -1){
            new_expression = expression.replace(/\[.*?\]/, `[${keys}]`)
        }

        $input.handleInputEvent = function(e) {
            setTimeout(() => {
                if (e.target.value === '') {
                    setValue(new_expression, '', context, formModel, value)
                    // 遇到非法数值，则重置
                    e.target.value = ''
                    vnode.componentInstance.currentValue = ''
                } else if (e.target.value !== '' && !new RegExp(pattern).test(e.target.value)) {
                    setValue(new_expression, parseFloat(e.target.lastValue), context, formModel, value)
                    // 遇到非法数值，则重置为lastValue
                    e.target.value = e.target.lastValue
                    vnode.componentInstance.currentValue = e.target.lastValue
                    if (allowDot) {
                        $input.title = `小数点后最多${dotRange.replace(/[}{]/g, '').split(',')[1]}位`
                    }
                } else if (e.target.value > maxValue) {
                    setValue(new_expression, parseFloat(e.target.lastValue), context, formModel, value)
                    // 遇到非法数值，则重置为lastValue
                    e.target.value = e.target.lastValue
                    vnode.componentInstance.currentValue = e.target.lastValue
                    if (allowDot) {
                        $input.title = `小数点后最多${dotRange.replace(/[}{]/g, '').split(',')[1]}位`
                    }
                }
                e.target.lastValue = e.target.value
            }, 0)
        }
        $input.addEventListener('input', $input.handleInputEvent, false)
        $input.addEventListener('blur', $input.handleInputEvent, false)
    },
    unbind(el) {
        el && el.$input.removeEventListener('input', el.$input.handleInputEvent, false)
        el && el.$input.removeEventListener('blur', el.$input.handleInputEvent, false)
    }
}
