const baseURL = 'http://127.0.0.1:3000'
// 实时监控
export const realtime = baseURL + '/api/realtime';
// 最新异常
export const getNewErr = baseURL + '/api/newErr';
// 获取指定id异常
export const getNewErrById = baseURL + '/api/getErrById';
// 获取当前的报警hook
export const getCurrentAlertMethod = baseURL + '/api/getCurrentAlertMethod';