import React, { Component } from 'react'
import './App.css';
import LoginAplication from './components/login/LoginPage';
import HomePage from './components/supplyIn/HomePage';
import NavBar from './navBar';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuarioLogin: ""
    }
  }

  componentDidMount(){
    const usuarioAutenticacion = localStorage.getItem( 'user' )

    if(usuarioAutenticacion === 'beron_01'){
      this.setState({
        usuarioLogin: 'beron_01'
      })
    } 
  }

  handleLogInCaliRefugio(usuario){
    if(usuario === 'beron_01'){
      this.setState({
        usuarioLogin: 'beron_01'
      })
    } 
  }  

  handleLogOut(){
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    this.setState({
      usuarioLogin: ''
    })
  }

  render(){
    const opcionPantalla = () => {
      switch(this.state.usuarioLogin){
        case "": return <LoginAplication loginHandlerCaliRefugio={this.handleLogInCaliRefugio.bind(this)}/>
        case "beron_01": return <NavBar logoutHandler={this.handleLogOut.bind(this)}/>
  
        default: return <h1>Algo paso.... contacte al administrador !</h1>
      }
    } 

    return (    
      <>
        {opcionPantalla()}
      </>
    );
  }
}

export default App;
