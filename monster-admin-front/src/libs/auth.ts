import { TOKEN_NAME } from './constants'

export const checkLocalStorageHasUserToken: () => boolean = () => {
  const token = localStorage.getItem(TOKEN_NAME)

  if (token) {
    return true
  }

  return false
}
