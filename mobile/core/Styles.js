
import { StyleSheet, Dimensions } from 'react-native'

export const COLOR = {
  ACCENT: '#FF6A29',
  BACKGROUND: '#FFCE36',
  BLACK: 'rgba(0, 0, 0, 1.0)',
  GRAY: 'rgba(0, 0, 0, 0.75)',
  HALF_BLACK: 'rgba(0, 0, 0, 0.5)',
  HALF_WHITE: 'rgba(255, 255, 255, 0.5)',
  PRIMARY: '#437C90',
  RED: 'rgba(255, 0, 0, 1.0)',
  WHITE: 'rgba(255, 255, 255, 1.0)',

  // Legacy
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
  whiteOpacity: 'rgba(255, 255, 255, 0.5)',
}

export const THEME = {

}

export const height = Dimensions.get('window').height
export const width = Dimensions.get('window').width

export default StyleSheet.create({
  background: {
    backgroundColor: COLOR.BACKGROUND,
  },
  button: {
    margin: 10,
  },
  card: {
    backgroundColor: COLOR.WHITE,
    borderColor: COLOR.HALF_WHITE,
    elevation: 1,
    margin: 20,
    padding: 20,
    shadowColor: COLOR.HALF_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
  center: {
    textAlign: 'center',
  },
  centered: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    alignContent: 'center',
    flex: 1,
    flexDirection: 'column',
    fontSize: 16,
  },
  empty: {
    backgroundColor: COLOR.HALF_WHITE,
    color: COLOR.ACCENT,
    fontSize: 20,
    justifyContent: 'center',
    margin: 20,
    padding: 20,
    textAlign: 'center',
  },
  error: {
    color: COLOR.RED,
  },
  flexColumn: { flexDirection: 'column' },
  flexFull: { flex: 1 },
  flexRow: { flexDirection: 'row' },
  form: {},
  formTitle: {
    fontSize: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
    padding: 3,
  },
  logo: {
    height: 120,
    width: 120,
  },
  margin: { margin: 10 },
  marginBottom: { marginBottom: 10 },
  marginLeft: { marginLeft: 10 },
  marginRight: { marginRight: 10 },
  marginTop: { marginTop: 10 },
  modal: {
    backgroundColor: COLOR.WHITE,
  },
  modalListHeader: {
    borderColor: COLOR.PRIMARY,
    borderBottomWidth: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalListItem: {
    borderColor: COLOR.PRIMARY,
    borderBottomWidth: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalListTitle: {
    color: COLOR.PRIMARY,
    fontSize: 20,
    marginTop: 8,
  },
  modalContent: {
    width: Math.floor(width * 0.8),
  },
  padding: { padding: 10 },
  paddingBottom: { paddingBottom: 10 },
  paddingLeft: { paddingLeft: 10 },
  paddingRight: { paddingRight: 10 },
  paddingTop: { paddingTop: 10 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  whiteBackground: { backgroundColor: COLOR.WHITE },
})
