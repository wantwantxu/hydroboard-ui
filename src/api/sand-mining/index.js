import {http} from '@/http'
const API_HOST = process.env.API_HOST
const API_URL = API_HOST + '/'

export default {

  listLocation: (data) => http(API_URL + 'ship/track/listLocation', 'postJson', data),
  getShip: (data) => http(API_URL + 'ship/list', 'postJson', data)
}
