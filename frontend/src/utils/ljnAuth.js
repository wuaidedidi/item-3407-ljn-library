export const ljnGetToken = () => localStorage.getItem('ljnToken')

export const ljnSetToken = (token) => localStorage.setItem('ljnToken', token)

export const ljnRemoveToken = () => localStorage.removeItem('ljnToken')

export const ljnGetUser = () => {
  const ljnUserStr = localStorage.getItem('ljnUser')
  return ljnUserStr ? JSON.parse(ljnUserStr) : null
}

export const ljnSetUser = (user) => localStorage.setItem('ljnUser', JSON.stringify(user))

export const ljnRemoveUser = () => localStorage.removeItem('ljnUser')

export const ljnIsAdmin = () => {
  const ljnUser = ljnGetUser()
  return ljnUser && ljnUser.ljnRole === 0
}

export const ljnIsLoggedIn = () => !!ljnGetToken()

export const ljnLogout = () => {
  ljnRemoveToken()
  ljnRemoveUser()
  window.location.href = '/login'
}
