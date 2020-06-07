export default string => {
  const d = string.split('/')

  return `${d[2]}-${d[1]}-${d[0]}`
}