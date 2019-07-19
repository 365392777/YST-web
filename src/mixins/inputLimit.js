const maxNum = 99999999999999

export default {
    methods: {
        inputLimit($event, item, valueName, $ref) {
            let $input = $event.target
            let allowDot = !!$input.dataset.dotrange,
                notAllowZero = $input.dataset.nonzero != undefined,
                dotRange = $input.dataset.dotrange || `{0,2}`, // 默认
                pattern = `^[0-9]+${allowDot ? `(\\.[0-9]${dotRange})?` : ''}$`,
                maxValue = $input.dataset.maxValue || maxNum
            
            pattern = notAllowZero && !allowDot ? '^[1-9][0-9]*$' : pattern
            
            maxValue = parseFloat(maxValue)
            setTimeout(() => {
                if ($input.value === '') {
                    item[valueName] = ''
                    $input.value = ''
                    $ref.setCurrentValue('')
                } else if (($input.value !== '' && !new RegExp(pattern).test($input.value)) || $input.value > maxValue) {
                    let lastValue = isNaN(parseFloat($input.lastValue)) ? '' : parseFloat($input.lastValue)
                    item[valueName] = lastValue
                    $input.value = $input.lastValue
                    $ref.setCurrentValue($input.lastValue)
                }
                $input.lastValue = $input.value
            }, 0)
        }
    }
}
