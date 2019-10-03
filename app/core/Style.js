
import { DefaultTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'

export const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0345fc',
    accent: '#0345fc',
    background: '#ffffff',
    surface: '#efefef',
    error: '#B00020',
    text: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    disabled: 'rgba(0, 0, 0, 0.5)',
    placeholder: 'rgba(0, 0, 0, 0.75)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: 'rgba(255, 0, 0, 0.75)',
  },
  fonts: {
    ...DefaultTheme.fonts,
    //regular: '',
    //medium: '',
    //light: '',
    //thin: '',
  },
  animation: {
    scale: 1.0,
  },
}

export const styles = StyleSheet.create({
  appBar: {
    backgroundColor: 'none',
    borderWidth: 0,
    bottom: 0,
    left: -15,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100vw',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  center: {
    alignItems: 'center',
  },
  container: {

  },
  content: {
    flex: 1,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  fab: {
    bottom: 20,
    position: 'absolute',
    right: 20,
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexFull: {
    flex: 1,
  },
  flexRow: {
    flexDirection: 'row',
  },
  input: {
    marginTop: 10,
    width: '100%',
  },
  logo: {
    height: 238,
    width: 238,
  },
  margins: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  modal: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  paddings: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  textCenter: {
    textAlign: 'center',
  },
  textPrimary: {
    color: theme.colors.primary,
  },
})

export default {
  styles,
  theme,
}
