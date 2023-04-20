import React, { Component } from 'react';
import '../../App.css';
import Container from 'react-bootstrap/Container';
import BestImg from '../../images/bestIcono.png'
import { ToastComponent, Toast, ToastModel } from '@syncfusion/ej2-react-notifications';

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            password: '',  
            jwToken: ''
        }

        this.handleLoging = this.handleLoging.bind(this);
    }

    handleLoging(event){
        event.preventDefault();

        console.log(this.state.user)
        console.log(this.state.password)

        const requestOptions ={
            method: 'POST',
            headers : {'Content-type':'application/json'},
            body: JSON.stringify({user: this.state.user, password: this.state.password})    
          }      
          fetch(`http://${process.env.REACT_APP_URL_PRODUCCION}/api/auth`, requestOptions)
              .then(response => response.json())
              .then(data => {
                    console.log(data)
                    if(data.msj==='Usuario o contraseña incorrecta.'){
                        this.toastObj.show(this.toasts[1]);                        
                    }else{
                        this.toastObj.show(this.toasts[0]);
                        this.props.loginHandlerCaliRefugio(data.user.user)

                        localStorage.setItem( 'user', data.user.user );
                        localStorage.setItem( 'token', data.jwToken );
                    }
              })
              .catch(err => console.log(err))
    }  
    
    toastObj;
    position = { X: 'Right' };
    toasts = [
        { title: 'Success!', content: `Usuario logeado !...`, cssClass: 'e-toast-success', icon: 'e-success toast-icons' },
        { title: 'Error!', content: 'Usuario y/o contraseña incorrectos !...', cssClass: 'e-toast-danger', icon: 'e-error toast-icons' }
    ];

    create() {
        
    }
    onclose(e) {
        if (e.toastContainer.childElementCount === 0) {
            this.hideTosat.element.style.display = 'none';
        }
    }

    render() {
        return (
            <Container>
                <ToastComponent 
                    ref={(toast) => { this.toastObj = toast; }} 
                    id='toast_type' 
                    position={this.position} 
                    created={this.create.bind(this)} 
                    close={this.onclose.bind(this)}>

                    </ToastComponent>

            <img src={BestImg} className="card-img-top mt-2" />
            <form onSubmit={this.handleLoging}>

                <label htmlFor="inputPassword5" className="form-label mt-2">User</label>
                <select defaultValue={'DEFAULT'} className="form-control" aria-label="Default select example" onChange={(e) => this.setState({ user:e.target.value })}>
                    <option value="DEFAULT">Seleccione usuario</option>
                    <option value="beron_01">beron_01</option>
                    <option value="beron_02">beron_02</option>
                    <option value="beron_03">beron_03</option>
                    <option value="admin">admin</option>
                </select>
        
                <label htmlFor="inputPassword5" className="form-label mt-2">Password</label>
                <input type="password" id="inputPassword5" className="form-control" aria-labelledby="passwordHelpBlock" onChange={(e) => this.setState({ password:e.target.value })}/>

                <button type="submit" className="btn btn-primary form-control mt-2">Ingresar</button>

            </form>
          </Container>
        );
    }
}

export default LoginPage;