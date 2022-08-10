// Credit to ClockworkSquirrel for his awesome work!

const { Registry } = require('rage-edit')
const Axios = require('axios')
Axios.default.defaults.withCredentials = true
const RobloxReg = new Registry('HKCU\\\Software\\Roblox\\RobloxStudioBrowser\\roblox.com')
const plist = require('plist');
const fs = require('fs');
const os = require('os');
const path = require('path');
const child_process = require('child_process');
var macFirstGetCookie = false
exports.getCookie = () => {
  return RobloxReg.get('.ROBLOSECURITY').then(entry => {
    const data = {}

    entry.split(',').map(dataset => {
      const pairs = dataset.split('::')
      data[pairs[0].toLowerCase()] = pairs[1].substr(1, pairs[1].length - 2)
    })

    if (data.cook === undefined && data.exp === undefined) {
      throw new Error('Couldn\'t get login cookie')
    } else {
      if (new Date(data.exp).getTime() - Date.now() <= 0) {
        throw new Error('Login cookie has expired')
      }
    }

    return data.cook
  })
}

exports.get = options => exports.getCookie().then(cookie => {
  options = typeof (options) === 'object' ? options : {}
  options = Object.assign({ method: 'get' }, options)

  if (typeof (options.headers) !== 'object') options.headers = {}
  options.headers.Cookie = `.ROBLOSECURITY=${cookie}`

  return Axios(options)
})

exports.post = options => exports.getCookie().then(cookie => {
  options = typeof (options) === 'object' ? options : {}
  options = Object.assign({ method: 'post' }, options)

  if (typeof (options.headers) !== 'object') options.headers = {}
  options.headers.Cookie = `.ROBLOSECURITY=${cookie}`
  options.withCredentials = true

  return Axios(options)
})

exports.getCurrentUser = () => exports.get({
  url: 'https://www.roblox.com/mobileapi/userinfo'
})



exports.getMacCookie = () => {
  if (macFirstGetCookie == false) {
    macFirstGetCookie = true
    if (fs.existsSync(path.join(__dirname, '../temp/com.roblox.RobloxStudioBrowser.RoPresenceTemp.plist'))) {fs.unlinkSync(path.join(__dirname, '../temp/com.roblox.RobloxStudioBrowser.RoPresenceTemp.plist'))}
    fs.copyFile(path.join(os.homedir(), '/Library/Preferences/com.roblox.RobloxStudioBrowser.plist'), path.join(__dirname, '../temp/com.roblox.RobloxStudioBrowser.RoPresenceTemp.plist'), (err) => {if (err) {console.log("Error Found:", err);}});
    child_process.execSync("plutil -convert xml1 " + path.join(__dirname, '../temp/com.roblox.RobloxStudioBrowser.RoPresenceTemp.plist'))
  }
  var obj = plist.parse(fs.readFileSync(path.join(__dirname, '../temp/com.roblox.RobloxStudioBrowser.RoPresenceTemp.plist'), 'utf8'));


  var entry = obj["roblox·com.·ROBLOSECURITY"]
  
  const data = {}

  entry.split(',').map(dataset => {
    const pairs = dataset.split('::')
    data[pairs[0].toLowerCase()] = pairs[1].substr(1, pairs[1].length - 2)
  })

  if (data.cook === undefined && data.exp === undefined) {
    throw new Error('Couldn\'t get login cookie')
  } else {
    if (new Date(data.exp).getTime() - Date.now() <= 0) {
      throw new Error('Login cookie has expired')
    }
  }
  //console.log(data.cook)

  return data.cook
}

exports.macGet = function(options) {
  var cookie = exports.getMacCookie()
  //console.log(cookie)
  options = typeof (options) === 'object' ? options : {}
  options = Object.assign({ method: 'get' }, options)

  if (typeof (options.headers) !== 'object') options.headers = {}
  options.headers.Cookie = `.ROBLOSECURITY=${cookie}`

  return Axios(options)
}

exports.macPost = function(options) {
  var cookie = exports.getMacCookie()
  options = typeof (options) === 'object' ? options : {}
  options = Object.assign({ method: 'post' }, options)

  if (typeof (options.headers) !== 'object') options.headers = {}
  options.headers.Cookie = ".ROBLOSECURITY=" + cookie
  options.withCredentials = true
  options.xsrfHeaderName = 'Set-Cookie'
  options.xsrfCookieName = '.ROBLOSECURITY'
  //document.cookie = '.ROBLOSECURITY=' + cookie

  return Axios(options)
}

exports.getCurrentUserMac = () => exports.macGet({
  url: 'https://www.roblox.com/mobileapi/userinfo'
})
