
import { DefaultTheme } from 'react-native-paper'
import { StyleSheet } from 'react-native'

export const theme = {
  ...DefaultTheme,
  dark: false,
  roundness: 10,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF6A29',
    accent: '#437C90',
    background: '#FFFFFF',
    surface: '#FFCE36',
    error: '#B00020',
    black: '#000000',
    text: '#000000',
    onBackground: '#000000',
    onSurface: '#000000',
    disabled: 'rgba(0, 0, 0, 0.5)',
    placeholder: 'rgba(0, 0, 0, 0.75)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: 'rgba(255, 0, 0, 0.95)',
    green: 'rgba(0, 255, 0, 0.9)',
    red: 'rgba(255, 0, 0, 0.9)',
    white: '#ffffff',
    whiteOpacity: 'rgba(255, 255, 255, 0.5)',
  },
  fonts: {
    ...DefaultTheme.fonts,
    bold: 'modelica-bold',
    regular: 'modelica',
    medium: 'modelica',
    light: 'modelica-light',
    thin: 'modelica',
  },
  animation: {
    scale: 1.0,
  },
}

export const styles = StyleSheet.create({
  alert: {
    backgroundColor: theme.colors.notification,
  },
  appBar: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
    borderWidth: 0,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },
  backgroundSurface: {
    backgroundColor: theme.colors.surface,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  cardButton: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.accent,
    marginTop: 10,
    width: '100%',
  },
  cardButtonNoLeft: {
    borderBottomLeftRadius: 0,
    borderTopLeftRadius: 0,
  },
  cardButtonNoRight: {
    borderBottomRightRadius: 0,
    borderTopRightRadius: 0,
  },
  center: {
    alignItems: 'center',
  },
  container: {

  },
  content: {
    backgroundColor: theme.colors.background,
    flex: 1,
    padding: 10,
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
  mailboxMessage: {
    //backgroundColor: theme.colors.surface,
    borderBottomColor: theme.colors.accent,
    borderBottomWidth: 1,
    margin: 10,
    padding: 10,
  },
  margins: {
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  modal: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.accent,
    padding: 20,
  },
  paddings: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
  },
  scanner: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  textAccent: {
    color: theme.colors.accent,
  },
  textBig: {
    fontSize: 18,
  },
  textCenter: {
    textAlign: 'center',
  },
  textHuge: {
    fontSize: 22,
  },
  textPrimary: {
    color: theme.colors.primary,
  },
  textWhite: {
    color: theme.colors.white,
  },
  textWhiteOpacity: {
    color: theme.colors.whiteOpacity,
  },
})

export default {
  styles,
  theme,
}
