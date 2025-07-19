import Vue from 'vue'
import moment from 'moment'
import round from 'lodash/round'
import replace from 'lodash/replace'
import pluralize from 'pluralize'

export default function ugx (value) {
  if (!value) { return '' }
  return 'UGX ' + round(value).toFixed(0).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

Vue.filter('diffForHumans', value => moment(value).fromNow())
Vue.filter('timeTaken', (secs) => {
  const pad = num => ('0' + num).slice(-2)

  let minutes = Math.floor(secs / 60)
  secs = secs % 60
  const hours = Math.floor(minutes / 60)
  minutes = minutes % 60
  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
})

Vue.filter('pluralize', (value, number) => pluralize(value, number))

Vue.filter('removeDash', value => replace(value, '_', ' '))

Vue.filter('humanHours', value => moment(value, 'h:mm:ss').format('LT'))

Vue.filter('humanDate', value => moment(value).format('LL'))

Vue.filter('humanYearMonth', value => moment(value).format('MMMM, YYYY'))

Vue.filter('humanMonthDay', value => moment(value).format('DD MMMM'))

Vue.filter('humanDateTime', value => moment(value).format('lll'))

Vue.filter('fromNow', value => moment(value).fromNow())

Vue.filter('humanDayDate', value => moment(value).format('ddd D MMM, YYYY'))

Vue.filter('number_format', (value) => {
  return round(value).toFixed(0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('number_format_original_value', (value) => {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
})

Vue.filter('toHumanNumber', (value) => {
  // Remove dash (-) if mistakenly entered.
  const number = value.split('-').join('')
  return number.match(/.{1,3}/g).join(' ')
})

Vue.filter('month', (value) => {
  const month = value === 0 ? value : value - 1
  return moment().month(month).format('MMMM')
})

Vue.filter('age', (value) => {
  return moment().diff(value, 'years')
})
