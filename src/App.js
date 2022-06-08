
import { connect } from 'react-redux'

import { NavLink } from 'react-router-dom'
import { Route, Routes } from 'react-router-dom'
import Scanner from './components/Scanner'
import EditProduct from './components/EditProduct'
import Home from './components/Home'
import Auth from './components/auth/Auth'
import MailAuth from './components/auth/MailAuth'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

library.add(fas)
const App = () => {
  return (
    <div className=''>
    </div>
  )
}

export default connect()(App)

{
  
}
