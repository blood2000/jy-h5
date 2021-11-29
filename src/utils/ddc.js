// 日期格式化
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  time = new Date(time);
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time.replace(new RegExp(/-/gm), '/');
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value]; }
    if (result.length > 0 && value < 10) {
      value = '0' + value;
    }
    return value || 0;
  });
  return time_str;
}


export function numberFormat(val){
	let num = 0;
	if(typeof val === "number"){
		if(val > 9999){
			num = (Math.floor(val/100)/100);
		}else{
			num = val;
		}
		let str = num.toString();
		let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
		num =  str.replace(reg,"$1,");
		return num;
	}else{
		return 0
	}
}

export function numberFormatUnit(val){
	if(typeof val === "number"){
		if(val > 9999){
			return '万';
		}else{
			return '';
		}
	}else{
		return '';
	}
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
  if (datas === undefined || datas === null) {
    return '';
  }
  var actions = [];
  Object.keys(datas).some((key) => {
    if (('' + datas[key].dictValue) === ('' + value)) {
      actions.push(datas[key].dictLabel);
      return true;
    }
  });
  return actions.join('');
}

export function removePropertyOfNull(obj){
  Object.keys(obj).forEach(item=>{
    if(!obj[item] && obj[item]!=0 && typeof(obj[item]) !== 'boolean' ) delete obj[item]
      
    if(Object.prototype.toString.call(obj[item]) === '[object Object]'){
      removePropertyOfNull(obj[item])
    }
    if(Array.isArray(obj[item])){
      obj[item].forEach(e=>{
        removePropertyOfNull(e)
      })
    }
  })
  return obj;
}

/**
 * 判断是否长期
 */
export function isPeriodAlways(date) {
  if (date.indexOf('长期') !== -1 || date.startsWith('9999')) {
    return true;
  } else {
    return false;
  }
}

/**
 * 校验日期格式yyyy-mm-dd
 */
export function isPeriodFormate(date) {
  if (date.match(/^(\d{4})(-)(\d{2})(-)(\d{2})$/)) {
    return date;
  } else {
    return '';
  }
}