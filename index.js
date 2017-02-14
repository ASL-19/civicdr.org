var mount = require('choo/mount')
var html = require('choo/html')
var css = require('sheetify')
var choo = require('choo')
var path = require('path')
var fs = require('fs')

;css('tachyons')
var style = css('./index.css')

var app = choo()

app.model({
  namespace: 'email',
  state: { contents: [] },
  reducers: {
    send: function (state, data) {
      return { contents: data }
    }
  },
  effects: {
    getFormData: function (state, data, send, done) {
      send('email:send', data, function (err, value) {
        if (err) return done(err)
        done(null, value)
      })
    }
  }
})

function mainView (state, prev, send) {
  addFont()

  return html`
    <body class='${style}'>
      ${intro()}
      ${about()}
      ${getInTouch(state, prev, send)}
      ${origins()}
      ${footer()}
    </body>
  `
}

function intro () {
  var text = fs.readFileSync(path.join(__dirname, '/assets/intro.txt'), 'utf8')

  return html`
    <section class="pl5 pr5 pb5 pt2 bg-salmon" id="intro">
      <div class="fr">
        ${href('white', '#contact', 'contact')}
      </div>
      ${border('white')}
      <article class="f-5-ns f2 tl mw8 lh-title white">${text}</article>
    </section>
  `
}

function about () {
  var about = fs.readFileSync(path.join(__dirname, '/assets/about.txt'), 'utf8')
  var aboutEmergency = fs.readFileSync(path.join(__dirname, '/assets/about-emergency.txt'), 'utf8')
  var logo = fs.readFileSync(path.join(__dirname, '/assets/civicdr-logo.svg'), 'utf8')

  return html`
    <section class="pa5">
      <div class="logo-dark mw5-m mw5-l">
        ${toHtml(logo)}
      </div>
      ${border('salmon')}
      <article class="tl mw8 lh-copy">
        <h2 class="ttu fw7"> what we do </h2>
        <p class="f3">${about}</p>
        <p class="f3">${aboutEmergency}</p>
      </article>
    </section>
  `
}

function getInTouch (state, prev, send) {
  return html`
    <section class="pa3 pr5 pl5 pb5 bg-dark-gray" id="contact">
      ${border('salmon')}
      <article class="flex-ns justify-between mw8">
        ${formDescription()}
        ${form(state, prev, send)}
      </article>
    </section>
  `
}

function origins () {
  var origins = fs.readFileSync(path.join(__dirname, '/assets/origins.txt'), 'utf8')

  return html`
    <section class="pt3 pr5 pl5 pb5">
      ${border('salmon')}
      <article class="tl mw8 lh-copy">
        <h2 class="ttu fw7"> what we do </h2>
        <p class="f3">${origins}</p>
      </article>
    </section>
  `
}

function footer () {
  var logo = fs.readFileSync(path.join(__dirname, '/assets/civicdr-logo.svg'), 'utf8')

  return html`
    <section class="bg-salmon pa5">
      <article class="center w-50 tc">
        <a class="ttu no-underline white" href="#intro">back to top</a>
        <div class="logo-salmon w-80 w-50-ns center mt4">
          ${toHtml(logo)}
        </div>
      </article>
    </section>
  `
}

function formDescription () {
  var organizations = fs.readFileSync(path.join(__dirname, '/assets/organizations.txt'), 'utf8')
  var partner = fs.readFileSync(path.join(__dirname, '/assets/partner.txt'), 'utf8')

  return html`
    <div class="tl pa0-ns pb4 lh-copy w-50-ns">
      <h2 class="ttu fw7 white"> we can help </h2>
      <p class="f3 fw7 white">${organizations}</p>
      <p class="f3 white">${partner}</p>
      <div>
        ${href('salmon', 'https://www.accessnow.org/help/', '&#8594;Access Now Digital Security Helpline')} 
      </div>
      <div>
        ${href('salmon', 'https://securitywithoutborders.org/', '&#8594;Security Without Borders')} 
      </div>
    </article>
  `
}

function form (state, prev, send) {
  return html`
    <form class="w-50-ns" onsubmit=${email}>
      ${input({ type: 'text', id: 'organisation', placeholder: 'Your organisation name*' })}
      ${input({ type: 'text', id: 'issue', placeholder: 'Briefly describe your problem*' })}
      <div class="bg-white mb3">
        <p class="pt3 pl3 pr3 dark-gray">Does the person dealing with this incident speak English?*</p>
        ${input({ type: 'radio', id: 'yes', value: 'yes' })}
        ${input({ type: 'radio', id: 'no', value: 'no' })}
      </div>
      ${input({ type: 'email', id: 'email', placeholder: 'Contact Email Address*' })}
      <div>
        <input type="submit" class="pt3 pb3 w-100 white ttu bg-salmon b--transparent br2" value="submit">
      </div>
    </form>
  `

  function email (e) {
    e.preventDefault()
    send('email:getFormData', e.target)
  }
}

function border (colour) {
  return html`
    <div class="bw3 bt mw4 pb4 mt5 ${colour}"></div>
  `
}

function href (color, href, text) {
  return html`
    <a class="ttu ${color} no-underline fw7" href=${href}>${text}</a>
  `
}

function input (opts) {
  var id = opts.id || ''
  var type = opts.type || 'text'
  var placeholder = opts.placeholder || ''
  var value = opts.value || ''

  return html`
    <input id=${id} value=${value} class="input-reset w-100 pt3 pb4 pr3 pl3 ba b--black-20 mb3" type=${type} required placeholder=${placeholder}>
  `
}

function toHtml (item) {
  var element = html`<div></div>`
  element.innerHTML = item

  return element.childNodes[0]
}

function addFont () {
  var link = document.createElement('link')
  var head = document.getElementsByTagName('head')[0]
  link.href = 'https://fonts.googleapis.com/css?family=Roboto:400,700'
  link.rel = 'stylesheet'
  head.appendChild(link)
}

app.router(['/', mainView])
mount('body', app.start())
