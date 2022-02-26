import fetch from '@/utils/axios'
import _config from '@/config'
const prefix = _config.ADMIN_URL + '/'

export const login = (params: Type.Object = {}) => fetch(prefix + 'auth/login', params, 'post')

export default {
  login,
}
