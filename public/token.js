const jwt = require('jsonwentoken')
const singkey ='mes_qdhd_mobile_xhykjyxgs'


// 签发token
exports.setToken = (userName, userId) => {
	return new Promise((resolve, reject) => {
		const token = jwt.sign({
			name: userName,
			_id: userId
		}, singkey,{expiresIn: '1h'})
		resolve(token)
	})
}

// 验证token
exports.verToken = (token) => {
	return new Promise((resolve,reject) => {
		const info = jwt.verify(token.split(' ')[1], singkey)
		resolve(info)
	})
}