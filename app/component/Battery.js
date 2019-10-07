
import { ICON } from '../core/Constants'
import React from 'react'

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const getBatteryIcon = power => {
  if (power <= 10) return ICON.BATTERY_10
  if (power <= 20) return ICON.BATTERY_20
  if (power <= 30) return ICON.BATTERY_30
  if (power <= 40) return ICON.BATTERY_40
  if (power <= 50) return ICON.BATTERY_50
  if (power <= 60) return ICON.BATTERY_60
  if (power <= 70) return ICON.BATTERY_70
  if (power <= 80) return ICON.BATTERY_80
  if (power <= 90) return ICON.BATTERY_90
  if (power <= 100) return ICON.BATTERY_100
}

const Battery = ({ power, ...props }) => (
  <Icon
    color={ power < 20 ? 'red' : power < 50 ? 'orange' : 'black' }
    { ...props }
    name={ getBatteryIcon(power) } />
)

export default Battery
